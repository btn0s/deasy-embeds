import { computed, defineComponent, shallowRef, type CSSProperties, type PropType } from 'vue';
import { watchAfterMount, useMotionPreference } from '../composables';
import { Three, StandardMaterial, SceneCanvas as Canvas, Edges, PerformanceMonitor, EffectComposer, Bloom, SMAA, SceneControls as Leva, useSceneControls, useSceneFrame, useSceneContext, loadTexture, getGLTF, preloadGLTF, type EdgesRef } from '../scene';
import { Color, Vector3, SRGBColorSpace, type Mesh, type MeshStandardMaterial, type WebGLProgramParametersWithUniforms } from 'three';
import { KIT_TONES, type KitTone } from './AgentTerminal';
import { BRAND } from './brand';
import { HAIRLINE, edgeTint, glowPulse } from './glow';
import { facetShading } from './facet';

/**
 * Hollow Coal box, open on its +x face (the mouth), Pitch interior, Stone
 * edge outline. Local space: body spans x ∈ [-1.4, 0], y ±0.525, z ±0.46;
 * the mark surface sits on the +z (camera-facing) wall.
 */
export const SOURCE_BOX_MODEL_URL = '/models/document-emitter.glb';
export const SOURCE_BOX_SCALE = 1.25;
export type SourceBoxMark = {
  logoEtchMap: string;
  logoNormalMap: string;
};

/** Keeps the material colour and takes only the mark's coverage from the map. */
export function maskFromMap(shader: WebGLProgramParametersWithUniforms) {
  shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', 'diffuseColor.a *= texture2D( map, vMapUv ).a;');
}
const SAGE = new Color(BRAND.sage);
const CHALK = new Color(BRAND.chalk);
export const SourceBox = defineComponent({
  name: "SourceBox",
  props: {
    variant: {
      type: null as unknown as PropType<SourceBoxMark>,
      required: true
    },
    x: {
      type: null as unknown as PropType<number>,
      required: true
    },
    y: {
      type: null as unknown as PropType<number>,
      required: true
    },
    z: {
      type: null as unknown as PropType<number>,
      required: false
    },
    scale: {
      type: null as unknown as PropType<number>,
      required: false
    },
    tone: {
      type: null as unknown as PropType<KitTone>,
      required: false
    },
    active: {
      type: null as unknown as PropType<boolean>,
      required: false
    },
    markColor: {
      type: null as unknown as PropType<string>,
      required: false
    },
    markScale: {
      type: null as unknown as PropType<number>,
      required: false
    }
  },
  setup(props, {
    slots
  }) {
    const variant = computed(() => props.variant);
    const x = computed(() => props.x);
    const y = computed(() => props.y);
    const z = computed(() => props.z ?? 0);
    const scale = computed(() => props.scale ?? SOURCE_BOX_SCALE);
    const tone = computed(() => props.tone ?? 'coal');
    const active = computed(() => props.active ?? false);
    const markColor = computed(() => props.markColor);
    const markScale = computed(() => props.markScale ?? 1);
    const colors = computed(() => KIT_TONES[tone.value]);
    const idleBody = (() => new Color(BRAND.ash))();
    const idle = computed(() => new Color(markColor.value ?? colors.value.control));
    const idleEmissive = computed(() => new Color(markColor.value ?? '#000000'));
    const mark = shallowRef<MeshStandardMaterial>(null);
    const body = shallowRef<MeshStandardMaterial>(null);
    const edges = shallowRef<EdgesRef>(null);
    const glowLevel = shallowRef(0);
    useSceneFrame(({
      clock
    }, delta) => {
      const material = mark.value;
      if (!material) return;
      glowLevel.value += (Number(active.value) - glowLevel.value) * Math.min(1, delta * 5);
      const level = glowLevel.value;
      const pulse = glowPulse(clock.elapsedTime) * level;
      // Source boxes stay neutral in both states. Deasy's presence is carried
      // by the shared white-core/Sage-emissive logo glow only.
      material.color.copy(idle.value).lerp(CHALK, level);
      material.emissive.copy(idleEmissive.value).lerp(SAGE, level);
      material.emissiveIntensity = (markColor.value ? 0.35 : 0) * (1 - level) + 4.0 * pulse;
      if (body.value) {
        body.value.color.copy(idleBody);
        if (edges.value) edgeTint(body.value.color, edges.value.material.color);
      }
    });
    const {
      scene
    } = getGLTF(SOURCE_BOX_MODEL_URL);
    const geometry = {
      shell: (scene.getObjectByName('EmitterShell') as Mesh).geometry,
      interior: (scene.getObjectByName('EmitterInterior') as Mesh).geometry,
      mark: (scene.getObjectByName('EmitterLogoSurface') as Mesh).geometry
    };
    const markCenter = computed(() => {
      geometry.mark.computeBoundingBox();
      return geometry.mark.boundingBox!.getCenter(new Vector3());
    });
    const logoEtchMap = loadTexture(variant.value.logoEtchMap);
    const logoNormalMap = loadTexture(variant.value.logoNormalMap);
    watchAfterMount(() => {
      logoEtchMap.colorSpace = SRGBColorSpace;
      logoEtchMap.flipY = false;
      logoNormalMap.flipY = false;
      for (const texture of [logoEtchMap, logoNormalMap]) {
        texture.anisotropy = 8;
        texture.needsUpdate = true;
      }
    }, () => [logoEtchMap, logoNormalMap]);
    return () => <Three.Group dispose={null} position={[x.value, y.value, z.value]} scale={scale.value}>
      <Three.Mesh geometry={geometry.shell}>
        <StandardMaterial ref={body} color={BRAND.ash} onBeforeCompile={facetShading} roughness={0.7} />
        <Edges ref={edges} color={BRAND.ash} lineWidth={HAIRLINE} toneMapped={false} />
      </Three.Mesh>
      {/* Actual open-mouth recess: the GLB interior does not cover this visible aperture. */}
      <Three.Mesh position={[-0.035, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <Three.PlaneGeometry args={[0.86, 1.02]} />
        <Three.MeshBasicMaterial color={BRAND.pitch} />
      </Three.Mesh>
      <Three.Group position={markCenter.value} scale={markScale.value}>
        <Three.Mesh geometry={geometry.mark} position={markCenter.value.clone().negate()}>
          <StandardMaterial ref={mark} alphaTest={0.02} color={colors.value.control} depthWrite={false} emissive={markColor.value ?? '#000000'} emissiveIntensity={markColor.value ? 0.35 : 0} map={logoEtchMap} normalMap={logoNormalMap} normalScale={[0.8, 0.8]} onBeforeCompile={shader => {
            facetShading(shader);
            maskFromMap(shader);
          }} roughness={0.65} transparent />
        </Three.Mesh>
      </Three.Group>
    </Three.Group>;
  }
});
