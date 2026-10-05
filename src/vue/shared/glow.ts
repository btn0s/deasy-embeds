import { Color } from 'three'

import { BRAND, glslColor } from './brand'

const CHALK = new Color(BRAND.chalk)

/** Outline colour: the object's current colour lifted 10% toward Chalk, written into `out`. */
export function edgeTint(base: Color, out: Color) {
  return out.copy(base).lerp(CHALK, 0.1)
}

/** One hairline width for every outline in the kit, in CSS px (LineMaterial is screen-space). */
export const HAIRLINE = 1.25

/** Shared vertex shader for the additive glow planes. */
export const glowVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

/** Soft radial Sage halo behind the Deasy block; off by default via Leva. */
export const haloFragmentShader = `
  uniform float uHalo;
  varying vec2 vUv;
  void main() {
    float d = length((vUv - 0.5) * 2.0);
    gl_FragColor = vec4(${glslColor(BRAND.sage)}, pow(max(0.0, 1.0 - d), 1.3) * 0.85 * uHalo);
  }
`

/** Same pulse the Deasy block uses for its glow. */
export function glowPulse(elapsedTime: number, reduceMotion = false) {
  return reduceMotion ? 1 : 0.92 + Math.sin(elapsedTime * 1.6) * 0.08
}
