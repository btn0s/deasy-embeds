import { Edges } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'

import { BRAND } from './brand'

/**
 * Two-link planar arm in the SourceBox construction: hard-edged Limestone
 * links, Coal hinge cubes, Clay gripper fingers, Stone outlines. Reaches
 * `target` (world, same z-plane as `base`) with an analytic elbow-up IK; rests
 * folded when `target` is null. All motion is smoothed here so callers can set
 * targets discretely.
 */

const UPPER = 1.5
const FORE = 1.3
const LINK_W = 0.16
const HINGE = 0.24
const FINGER = { length: 0.3, width: 0.06, gap: 0.22 } as const
const EFFECTOR = FORE + FINGER.length
const REST_SHOULDER = 1.15
const REST_ELBOW = -2.35
const SMOOTHING = 48

function solve(dx: number, dy: number): [shoulder: number, elbow: number] {
  const reach = Math.min(Math.hypot(dx, dy), UPPER + EFFECTOR - 0.01)
  const cosElbow =
    (reach * reach - UPPER * UPPER - EFFECTOR * EFFECTOR) /
    (2 * UPPER * EFFECTOR)
  const elbow = -Math.acos(Math.max(-1, Math.min(1, cosElbow)))
  const shoulder =
    Math.atan2(dy, dx) -
    Math.atan2(EFFECTOR * Math.sin(elbow), UPPER + EFFECTOR * Math.cos(elbow))
  return [shoulder, elbow]
}

/** Local-space gripper tip for the given joint angles. */
export function armTip(shoulder: number, elbow: number): [number, number] {
  return [
    UPPER * Math.cos(shoulder) + EFFECTOR * Math.cos(shoulder + elbow),
    UPPER * Math.sin(shoulder) + EFFECTOR * Math.sin(shoulder + elbow),
  ]
}

export type ArmHandle = { tip: [number, number, number] }

export function DeasyArm({
  base,
  target,
  gripping,
  handle,
  scale = 1,
}: {
  base: [number, number, number]
  /** World-space point for the gripper; null = rest. */
  target: [number, number] | null
  gripping: boolean
  /** Written every frame with the gripper's world position. */
  handle?: ArmHandle
  scale?: number
}) {
  const shoulderRef = useRef<Group>(null)
  const elbowRef = useRef<Group>(null)
  const fingerA = useRef<Group>(null)
  const fingerB = useRef<Group>(null)
  const angles = useRef({ elbow: REST_ELBOW, grip: 0, shoulder: REST_SHOULDER })

  useFrame((_, delta) => {
    const [wantShoulder, wantElbow] = target
      ? solve((target[0] - base[0]) / scale, (target[1] - base[1]) / scale)
      : [REST_SHOULDER, REST_ELBOW]
    const k = 1 - Math.exp(-SMOOTHING * delta)
    const a = angles.current
    a.shoulder += (wantShoulder - a.shoulder) * k
    a.elbow += (wantElbow - a.elbow) * k
    a.grip += (Number(gripping) - a.grip) * k * 1.6
    shoulderRef.current?.rotation.set(0, 0, a.shoulder)
    elbowRef.current?.rotation.set(0, 0, a.elbow)
    const spread = (FINGER.gap * (1 - a.grip * 0.7)) / 2
    fingerA.current?.position.set(0, spread, 0)
    fingerB.current?.position.set(0, -spread, 0)
    if (handle) {
      const [tx, ty] = armTip(a.shoulder, a.elbow)
      handle.tip = [base[0] + tx * scale, base[1] + ty * scale, base[2]]
    }
  })

  return (
    <group position={base} scale={scale}>
      {/* Shoulder block on the slab */}
      <mesh position={[0, -HINGE / 2, 0]}>
        <boxGeometry args={[HINGE * 1.6, HINGE, HINGE * 1.6]} />
        <meshStandardMaterial color={BRAND.coal} roughness={0.7} />
        <Edges color={BRAND.stone} lineWidth={1} />
      </mesh>
      <group ref={shoulderRef}>
        <mesh position={[UPPER / 2, 0, 0]}>
          <boxGeometry args={[UPPER, LINK_W, LINK_W]} />
          <meshStandardMaterial color={BRAND.limestone} roughness={0.8} />
          <Edges color={BRAND.stone} lineWidth={1} />
        </mesh>
        <group position={[UPPER, 0, 0]}>
          <mesh>
            <boxGeometry args={[HINGE, HINGE, HINGE]} />
            <meshStandardMaterial color={BRAND.coal} roughness={0.7} />
            <Edges color={BRAND.stone} lineWidth={1} />
          </mesh>
          <group ref={elbowRef}>
            <mesh position={[FORE / 2, 0, 0]}>
              <boxGeometry args={[FORE, LINK_W, LINK_W]} />
              <meshStandardMaterial color={BRAND.limestone} roughness={0.8} />
              <Edges color={BRAND.stone} lineWidth={1} />
            </mesh>
            {/* Wrist + gripper */}
            <group position={[FORE, 0, 0]}>
              <mesh>
                <boxGeometry args={[HINGE * 0.8, HINGE * 0.8, HINGE * 0.8]} />
                <meshStandardMaterial color={BRAND.coal} roughness={0.7} />
                <Edges color={BRAND.stone} lineWidth={1} />
              </mesh>
              {[fingerA, fingerB].map((ref, index) => (
                <group key={index} ref={ref}>
                  <mesh position={[FINGER.length / 2, 0, 0]}>
                    <boxGeometry args={[FINGER.length, FINGER.width, FINGER.width * 2]} />
                    <meshStandardMaterial color={BRAND.clay} roughness={0.7} />
                    <Edges color={BRAND.stone} lineWidth={1} />
                  </mesh>
                </group>
              ))}
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}
