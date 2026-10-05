import { computed, defineComponent, h, onBeforeUnmount, onMounted, reactive, shallowRef, watch, watchEffect, type DefineComponent } from 'vue'
import { TresCanvas, useLoop, useTres } from '@tresjs/core'
import { NoToneMapping, SRGBColorSpace, MeshStandardMaterial, Vector2, TextureLoader, WebGLRenderer, EdgesGeometry, HalfFloatType, type Mesh, type PerspectiveCamera, type Texture } from 'three'
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js'
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js'
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js'
import { LineMaterial } from 'three/addons/lines/LineMaterial.js'
import { EffectComposer as Composer, RenderPass, EffectPass, BloomEffect, SMAAEffect } from 'postprocessing'

/** Intrinsic objects are created by Tres's native Vue/Three renderer. */
export const Three = Object.fromEntries(['Group', 'Mesh', 'BoxGeometry', 'PlaneGeometry', 'MeshStandardMaterial', 'MeshBasicMaterial', 'ShaderMaterial', 'PerspectiveCamera'].map(name => [name, `Tres${name}`])) as Record<string, any>
const textures = new Map<string, Texture>()
const loadingTextures = new Map<string, Promise<Texture>>()
export function loadTexture(url: string) {
  if (!textures.has(url)) {
    loadingTextures.set(url, new Promise((resolve, reject) => {
      textures.set(url, new TextureLoader().load(url, resolve, undefined, reject))
    }))
  }
  return textures.get(url)!
}
export async function preloadTextures(urls: string[]) {
  for (const url of urls) loadTexture(url)
  await Promise.all(urls.map(url => loadingTextures.get(url)))
}
const models = new Map<string, GLTF>()
const loadingModels = new Map<string, Promise<GLTF>>()
export function preloadGLTF(url: string) {
  if (!loadingModels.has(url)) loadingModels.set(url, new GLTFLoader().loadAsync(url).then(model => { models.set(url, model); return model }))
  return loadingModels.get(url)!
}
export function getGLTF(url: string) {
  const model = models.get(url)
  if (!model) throw new Error(`Model has not finished loading: ${url}`)
  return model
}

export function useSceneFrame(callback: (state: { clock: { elapsedTime: number } }, delta: number) => void) {
  const { onBeforeRender } = useLoop()
  onBeforeRender(({ elapsed, delta }) => callback({ clock: { elapsedTime: elapsed } }, Math.min(delta, .1)))
}
export function useSceneContext() {
  const context = useTres()
  const camera = computed(() => context.camera.value as PerspectiveCamera)
  const viewport = computed(() => {
    const aspect = context.sizes.width.value / Math.max(1, context.sizes.height.value)
    return { getCurrentViewport: (cam: PerspectiveCamera, target: number[]) => {
      const distance = Math.abs(cam.position.z - target[2])
      const height = 2 * Math.tan(cam.fov * Math.PI / 360) * distance
      return { width: height * aspect, height }
    } }
  })
  return { camera, viewport }
}

/** Controls use the exact shipped defaults; their debug UI is also native Vue. */
const controlGroups = shallowRef<Record<string, { schema: Record<string, any>; values: Record<string, any> }>>({})
export function useSceneControls(group: string, schema: Record<string, any>) {
  const values = reactive(Object.fromEntries(Object.entries(schema).map(([key, definition]) => [key, definition.value])))
  controlGroups.value = { ...controlGroups.value, [group]: { schema, values } }
  onBeforeUnmount(() => { const groups = { ...controlGroups.value }; delete groups[group]; controlGroups.value = groups })
  return values
}
export const SceneControls = defineComponent({
  props: ['hidden', 'fill', 'theme'],
  setup(props) {
    return () => props.hidden ? null : h('div', { class: 'vue-scene-controls' }, Object.entries(controlGroups.value).map(([group, { schema, values }]) => h('fieldset', [h('legend', group), ...Object.entries(schema).map(([key, definition]) => h('label', [definition.label ?? key, h('input', {
      type: typeof definition.value === 'boolean' ? 'checkbox' : 'range', min: definition.min, max: definition.max, step: definition.step, checked: values[key], value: values[key],
      onInput: (event: Event) => { const input = event.target as HTMLInputElement; values[key] = input.type === 'checkbox' ? input.checked : Number(input.value); definition.onChange?.(values[key]) },
    })]))])))
  },
})

const SceneVisibility = defineComponent({
  props: ['active'],
  setup(props) {
    const loop = useLoop()
    const sync = () => props.active ? loop.start() : loop.stop()
    onMounted(sync)
    watch(() => props.active, sync, { flush: 'post' })
    return () => null
  },
})
export const SceneCanvas = defineComponent({
  props: ['camera', 'dpr', 'flat', 'frameloop'],
  setup(props, { slots }) {
    return () => h(TresCanvas, { alpha: true, clearColor: '#000000', clearAlpha: 0, antialias: false, dpr: props.dpr, renderMode: 'always', toneMapping: NoToneMapping, outputColorSpace: SRGBColorSpace }, {
      default: () => [h('TresPerspectiveCamera', { position: props.camera.position, fov: props.camera.fov, near: .1, far: 100 }), ...slots.default?.() ?? [], h(SceneVisibility, { active: props.frameloop !== 'never' })],
    })
  },
})


export const StandardMaterial = defineComponent({
  name: 'StandardMaterial', inheritAttrs: false,
  props: ['color','roughness','onBeforeCompile','alphaTest','depthWrite','emissive','emissiveIntensity','map','normalMap','normalScale','transparent'],
  setup(attrs, { expose }) {
    const material = new MeshStandardMaterial()
    expose(material)
    watchEffect(() => {
      const { onBeforeCompile, normalScale, ...values } = attrs
      material.setValues(Object.fromEntries(Object.entries(values).filter(([,value]) => value !== undefined)))
      if (normalScale) material.normalScale.copy(Array.isArray(normalScale) ? new Vector2(...normalScale as [number, number]) : normalScale as Vector2)
      if (onBeforeCompile) material.onBeforeCompile = onBeforeCompile as MeshStandardMaterial['onBeforeCompile']
    })
    onBeforeUnmount(() => material.dispose())
    return () => h('primitive', { object: material, attach: 'material' })
  },
})

export type EdgesRef = LineSegments2
export const Edges = defineComponent({
  props: ['color', 'lineWidth', 'threshold', 'toneMapped', 'opacity', 'transparent'],
  setup(props, { expose }) {
    const { sizes } = useTres()
    const material = new LineMaterial({ color: props.color, linewidth: props.lineWidth ?? 1, toneMapped: props.toneMapped ?? true, opacity: props.opacity ?? 1, transparent: props.transparent ?? false })
    const geometry = new LineSegmentsGeometry()
    const line = new LineSegments2(geometry, material)
    expose(line)
    onMounted(() => {
      const parent = line.parent as Mesh
      if (parent?.geometry) {
        const edges = new EdgesGeometry(parent.geometry, props.threshold ?? 15)
        geometry.setPositions(edges.getAttribute('position').array as Float32Array)
        line.computeLineDistances()
        edges.dispose()
      }
    })
    useLoop().onBeforeRender(() => material.resolution.set(sizes.width.value, sizes.height.value))
    onBeforeUnmount(() => { geometry.dispose(); material.dispose() })
    return () => h('primitive', { object: line })
  },
})

// These declarations label the effect slots; the composer owns their Three resources.
export const Bloom = defineComponent({ name: 'Bloom', props: ['intensity','luminanceSmoothing','luminanceThreshold','mipmapBlur','radius'], setup: () => () => null })
export const SMAA = defineComponent({ name: 'SMAA', setup: () => () => null })
export const EffectComposer = defineComponent({
  props: ['frameBufferType', 'multisampling'],
  setup(props, { slots }) {
    const { renderer, scene, camera, sizes } = useTres()
    const loop = useLoop()
    let composer: Composer | undefined
    let delta = 0
    loop.onBeforeRender(state => { delta = state.delta })
    onMounted(() => {
      const bloomProps = slots.default?.().find(node => node.type === Bloom)?.props ?? {}
      composer = new Composer(renderer as WebGLRenderer, { frameBufferType: props.frameBufferType ?? HalfFloatType, multisampling: props.multisampling ?? 0 })
      composer.addPass(new RenderPass(scene.value, camera.value))
      composer.addPass(new EffectPass(camera.value, new BloomEffect({ intensity: bloomProps.intensity, luminanceSmoothing: bloomProps.luminanceSmoothing, luminanceThreshold: bloomProps.luminanceThreshold, mipmapBlur: bloomProps.mipmapBlur, radius: bloomProps.radius }), new SMAAEffect()))
      composer.setSize(sizes.width.value, sizes.height.value)
      loop.render(notify => { composer?.render(delta); notify() })
    })
    watch([sizes.width, sizes.height], ([width, height]) => composer?.setSize(width, height))
    onBeforeUnmount(() => composer?.dispose())
    return () => null
  },
})
export const PerformanceMonitor = defineComponent({
  props: ['onDecline', 'onIncline'],
  setup(props) {
    let seconds = 0, frames = 0, low = false
    useLoop().onBeforeRender(({ delta }) => {
      seconds += delta; frames++
      if (seconds < 3) return
      const fps = frames / seconds
      if (fps < 45 && !low) { low = true; props.onDecline?.() }
      else if (fps > 58 && low) { low = false; props.onIncline?.() }
      seconds = 0; frames = 0
    })
    return () => null
  },
})
