import { Color } from 'three'

export const BRAND = {
  pitch: '#24221E',
  coal: '#2F2C25',
  ash: '#49463F',
  stone: '#B4AC9D',
  clay: '#D9D2C4',
  limestone: '#F7F3EB',
  chalk: '#FBF9F5',
  sage: '#8BA68C',
  ochre: '#D67E43',
  slate: '#5F7193',
  glacier: '#95AEDD',
} as const

/** Brand hex as a linear-space GLSL `vec3` literal. */
export function glslColor(hex: string) {
  const { r, g, b } = new Color(hex)
  return `vec3(${r.toFixed(4)}, ${g.toFixed(4)}, ${b.toFixed(4)})`
}
