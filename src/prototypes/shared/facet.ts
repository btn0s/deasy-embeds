import type { WebGLProgramParametersWithUniforms } from 'three'

/**
 * Brand-illustration shading: fixed tonal steps by facing instead of lit
 * shading. Front face is the material colour; top lifts, sides drop. Scene
 * lights are ignored, so the read is identical at any angle and on any GPU.
 * Emissive is untouched, so heat and glow paths still work on top.
 */
const TOP_LIFT = 0.1
const SIDE_DROP = 0.18
const BOTTOM_DROP = 0.06

export function facetShading(shader: WebGLProgramParametersWithUniforms) {
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <lights_fragment_end>',
    `
    #include <lights_fragment_end>
    {
      vec3 facing = normalize( normal );
      float tone =
        1.0 +
        ${TOP_LIFT.toFixed(2)} * max( facing.y, 0.0 ) -
        ${BOTTOM_DROP.toFixed(2)} * max( -facing.y, 0.0 ) -
        ${SIDE_DROP.toFixed(2)} * abs( facing.x );
      reflectedLight.directDiffuse = vec3( 0.0 );
      reflectedLight.directSpecular = vec3( 0.0 );
      reflectedLight.indirectSpecular = vec3( 0.0 );
      reflectedLight.indirectDiffuse = diffuseColor.rgb * tone;
    }
    `,
  )
}
