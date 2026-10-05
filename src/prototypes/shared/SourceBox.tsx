import { Edges, useGLTF, useTexture, type EdgesRef } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import {
  Color,
  Vector3,
  SRGBColorSpace,
  type Mesh,
  type MeshStandardMaterial,
  type WebGLProgramParametersWithUniforms,
} from 'three'

import { KIT_TONES, type KitTone } from './AgentTerminal'
import { BRAND } from './brand'
import { HAIRLINE, edgeTint, glowPulse } from './glow'
import { facetShading } from './facet'

/**
 * Hollow Coal box, open on its +x face (the mouth), Pitch interior, Stone
 * edge outline. Local space: body spans x ∈ [-1.4, 0], y ±0.525, z ±0.46;
 * the mark surface sits on the +z (camera-facing) wall.
 */
export const SOURCE_BOX_MODEL_URL = '/models/document-emitter.glb'
export const SOURCE_BOX_SCALE = 1.25

export type SourceBoxMark = {
  logoEtchMap: string
  logoNormalMap: string
}

/** Keeps the material colour and takes only the mark's coverage from the map. */
export function maskFromMap(shader: WebGLProgramParametersWithUniforms) {
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <map_fragment>',
    'diffuseColor.a *= texture2D( map, vMapUv ).a;',
  )
}

const SAGE = new Color(BRAND.sage)
const CHALK = new Color(BRAND.chalk)

export function SourceBox({
  variant,
  x,
  y,
  z = 0,
  scale = SOURCE_BOX_SCALE,
  tone = 'coal',
  active = false,
  markColor,
  markScale = 1,
}: {
  variant: SourceBoxMark
  x: number
  y: number
  z?: number
  scale?: number
  tone?: KitTone
  /** Connected to Deasy: the mark and outline take the Sage state color. */
  active?: boolean
  /** Vendor brand color for the etched mark; defaults to the tone's control color. */
  markColor?: string
  /** Enlarges the mark about its own centre; brand-colored marks also get a slight emissive lift. */
  markScale?: number
}) {
  const colors = KIT_TONES[tone]
  const idleBody = useMemo(() => new Color(BRAND.ash), [])
  const idle = useMemo(() => new Color(markColor ?? colors.control), [colors, markColor])
  const idleEmissive = useMemo(() => new Color(markColor ?? '#000000'), [markColor])
  const mark = useRef<MeshStandardMaterial>(null)
  const body = useRef<MeshStandardMaterial>(null)
  const edges = useRef<EdgesRef>(null)
  const glowLevel = useRef(0)
  useFrame(({ clock }, delta) => {
    const material = mark.current
    if (!material) return
    glowLevel.current += (Number(active) - glowLevel.current) * Math.min(1, delta * 5)
    const level = glowLevel.current
    const pulse = glowPulse(clock.elapsedTime) * level
    // Source boxes stay neutral in both states. Deasy's presence is carried
    // by the shared white-core/Sage-emissive logo glow only.
    material.color.copy(idle).lerp(CHALK, level)
    material.emissive.copy(idleEmissive).lerp(SAGE, level)
    material.emissiveIntensity = (markColor ? 0.35 : 0) * (1 - level) + 4.0 * pulse
    if (body.current) {
      body.current.color.copy(idleBody)
      if (edges.current) edgeTint(body.current.color, edges.current.material.color)
    }
  })
  const { scene } = useGLTF(SOURCE_BOX_MODEL_URL)
  const geometry = {
    shell: (scene.getObjectByName('EmitterShell') as Mesh).geometry,
    interior: (scene.getObjectByName('EmitterInterior') as Mesh).geometry,
    mark: (scene.getObjectByName('EmitterLogoSurface') as Mesh).geometry,
  }
  const markCenter = useMemo(() => {
    geometry.mark.computeBoundingBox()
    return geometry.mark.boundingBox!.getCenter(new Vector3())
  }, [geometry.mark])
  const logoEtchMap = useTexture(variant.logoEtchMap)
  const logoNormalMap = useTexture(variant.logoNormalMap)
  useEffect(() => {
    logoEtchMap.colorSpace = SRGBColorSpace
    logoEtchMap.flipY = false
    logoNormalMap.flipY = false
    for (const texture of [logoEtchMap, logoNormalMap]) {
      texture.anisotropy = 8
      texture.needsUpdate = true
    }
  }, [logoEtchMap, logoNormalMap])

  return (
    <group dispose={null} position={[x, y, z]} scale={scale}>
      <mesh geometry={geometry.shell}>
        <meshStandardMaterial ref={body} color={BRAND.ash} onBeforeCompile={facetShading} roughness={0.7} />
        <Edges ref={edges} color={BRAND.ash} lineWidth={HAIRLINE} toneMapped={false} />
      </mesh>
      {/* Actual open-mouth recess: the GLB interior does not cover this visible aperture. */}
      <mesh position={[-0.035, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.86, 1.02]} />
        <meshBasicMaterial color={BRAND.pitch} />
      </mesh>
      <group position={markCenter} scale={markScale}>
        <mesh geometry={geometry.mark} position={markCenter.clone().negate()}>
          <meshStandardMaterial
            ref={mark}
            alphaTest={0.02}
            color={colors.control}
            depthWrite={false}
            emissive={markColor ?? '#000000'}
            emissiveIntensity={markColor ? 0.35 : 0}
            map={logoEtchMap}
            normalMap={logoNormalMap}
            normalScale={[0.8, 0.8]}
            onBeforeCompile={(shader) => { facetShading(shader); maskFromMap(shader) }}
            roughness={0.65}
            transparent
          />
        </mesh>
      </group>
    </group>
  )
}

useGLTF.preload(SOURCE_BOX_MODEL_URL)
