import { Edges, PerformanceMonitor, useTexture, type EdgesRef } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer, SMAA } from '@react-three/postprocessing'
import { Leva, useControls } from 'leva'
import { AnimatePresence, animate, motion, motionValue, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import {
  AdditiveBlending,
  BufferAttribute,
  Color,
  HalfFloatType,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  MeshStandardMaterial,
  SRGBColorSpace,
  Vector2,
  Vector3,
  type Group,
  type Mesh,
  type ShaderMaterial,
  type WebGLProgramParametersWithUniforms,
} from 'three'

import './App.css'
import {
  DEASY_MASSING_LENGTH,
  DEASY_MASSING_SCALE,
  DOCUMENT_INTAKE_PHYSICS,
  DOCUMENT_TURBULENCE_PHYSICS,
  createDocumentStreamTopology,
  getDocumentStreamMode,
  type DocumentStreamMode,
  type DocumentStreamTopology,
  type StreamEmitter,
  type StreamPath,
} from './streamPhysics'
import { AgentTerminal, agentIntake } from '../shared/AgentTerminal'
import { BRAND, glslColor } from '../shared/brand'
import { SourceBox } from '../shared/SourceBox'
import { HAIRLINE, edgeTint, glowPulse, glowVertexShader, haloFragmentShader } from '../shared/glow'
import { facetShading } from '../shared/facet'

/** Why a document was rejected. Index 0 is "accepted"; 1–3 map to the sorting boxes. */
const REJECT_REASONS = [
  { name: 'duplicate', label: 'Duplicates', color: BRAND.slate },
  { name: 'old', label: 'Old versions', color: BRAND.glacier },
  { name: 'sensitive', label: 'Sensitive', color: BRAND.ochre },
] as const
const ROTOR_WORDS = [
  { word: 'duplicates', reason: 1 },
  { word: 'old versions', reason: 2 },
  { word: 'sensitive files', reason: 3 },
  { word: 'stale docs', reason: 2 },
] as const
const ROTOR_MEASURE_WORD = 'sensitive files'
// Friday: half a second more grace on the swap so the word is read before it moves.
const ROTOR_INTERVAL_MS = 2960
/** Friday: bigger character. Same kit piece as the original, Limestone tone. */
const CHARACTER_SCALE = 3.2
const MIN_SCENE_LAYOUT_WIDTH = 18
const CHARACTER_Y = 0
const REJECT_BOX = { y: -3.05, spacing: 1.55, width: 1.3, height: 0.8, depth: 0.9 } as const
/** Discard boxes use the same Ash gray as the Game Boy shell. */
const REJECT_EDGE = edgeTint(new Color(BRAND.ash), new Color())


const DOCUMENT_VARIANTS = [
  {
    texture: '/renders/rotating-document/doc-paper-01.webp',
    abstractTexture:
      '/renders/rotating-document/doc-paper-01.webp',
    accent: BRAND.slate,
    brandColor: BRAND.ochre,
    logoEtchMap: '/brand/integrations/amazon-s3-etch.png',
    logoNormalMap: '/brand/integrations/amazon-s3-normal.png',
    sourceName: 'S3 bucket',
    halfWidth: 1.1,
    halfHeight: 1.65,
    seed: 0x18a4c921,
  },
  {
    texture: '/renders/rotating-document/doc-paper-02.webp',
    abstractTexture:
      '/renders/rotating-document/doc-paper-02.webp',
    accent: BRAND.slate,
    brandColor: '#1868DB',
    logoEtchMap: '/brand/integrations/confluence-etch.png',
    logoNormalMap: '/brand/integrations/confluence-normal.png',
    halfWidth: 1.6,
    halfHeight: 1.07,
    sourceName: 'Confluence',
    seed: 0xb7419ef3,
  },
  {
    texture: '/renders/rotating-document/doc-paper-04.webp',
    abstractTexture:
      '/renders/rotating-document/doc-paper-04.webp',
    accent: BRAND.slate,
    brandColor: '#FF3621',
    logoEtchMap: '/brand/integrations/databricks-etch.png',
    logoNormalMap: '/brand/integrations/databricks-normal.png',
    halfWidth: 1.5,
    halfHeight: 1,
    sourceName: 'Databricks',
    seed: 0x5d2e8a17,
  },
  {
    texture: '/renders/rotating-document/doc-paper-03.webp',
    abstractTexture:
      '/renders/rotating-document/doc-paper-03.webp',
    accent: BRAND.ochre,
    brandColor: '#038387',
    logoEtchMap: '/brand/integrations/sharepoint-etch.png',
    logoNormalMap: '/brand/integrations/sharepoint-normal.png',
    halfWidth: 1.1,
    halfHeight: 1.65,
    sourceName: 'SharePoint',
    seed: 0xe90347ad,
  },
] as const
const DOCUMENT_CAPACITY = 384
const DOCUMENT_BATCH_CAPACITY =
  DOCUMENT_CAPACITY / DOCUMENT_VARIANTS.length
const DOCUMENT_LANES = 24
const VERTICAL_LANES = 6
const DEPTH_LANE_POSITIONS = [4.6, 3.3, 2, -2.5] as const
const LANE_MULTIPLIERS = [5, 7, 11, 13, 17, 19, 23, 1] as const
const FLOW_DISTANCE = 24
const STALE_FRACTION = 0.3
const REJECT_DROP_LENGTH = 3.2
// Distances ahead of the agent intake: depth lanes funnel in from `funnel`,
// crammed-in documents shrink away between `start` and `end`.
const TERMINAL_COLLAPSE = { funnel: 4.4, start: 1.9, end: 0.7 } as const
const SOURCE_Y_POSITIONS = [2.4, 0.8, -0.8, -2.4] as const
const SOURCE_SLOT_BY_NAME = {
  'S3 bucket': 3,
  Confluence: 1,
  Databricks: 2,
  SharePoint: 0,
} as const
const SOURCE_STREAM_Y_POSITIONS = DOCUMENT_VARIANTS.map(
  (variant) => SOURCE_Y_POSITIONS[SOURCE_SLOT_BY_NAME[variant.sourceName]],
) as readonly number[]
/** Without runs short and hard; With gets time to be read. */
const WITHOUT_MS = 4000
const WITH_MS = 7000
const CANVAS_CONTROLS = {
  height: {
    value: 380,
    min: 240,
    max: 800,
    step: 10,
    label: 'Height',
  },
}
const RIVER_CONTROLS = {
  sourceWidth: {
    value: 1,
    min: 0,
    max: 2,
    step: 0.05,
    label: 'Source width',
  },
  velocity: {
    value: 6,
    min: 0,
    max: 20,
    step: 0.1,
    label: 'Velocity',
  },
  density: {
    value: 192,
    min: 0,
    max: DOCUMENT_CAPACITY,
    step: 1,
    label: 'Density',
  },
}
const MATERIAL_CONTROLS = {
  abstractTextures: {
    value: true,
    label: 'Abstract textures',
  },
}
const CONTROL_THEME = {
  colors: {
    elevation1: '#24221E',
    elevation2: '#2F2C25',
    elevation3: '#49463F',
    accent1: '#8BA68C',
    accent2: '#95AEDD',
    accent3: '#D67E43',
    highlight1: '#FBF9F5',
    highlight2: '#F7F3EB',
    highlight3: '#D9D2C4',
    vivid1: '#D67E43',
  },
  fonts: {
    mono: "'Rethink Sans', sans-serif",
    sans: "'Rethink Sans', sans-serif",
  },
  radii: {
    xs: '2px',
    sm: '4px',
    lg: '8px',
  },
  shadows: {
    level1: '0 8px 24px rgb(0 0 0 / 18%)',
    level2: '0 4px 12px rgb(0 0 0 / 16%)',
  },
} as const


const vertexShader = `
  attribute vec3 aOrigin;
  attribute float aRotation;
  attribute float aScale;
  attribute float aPhase;
  attribute vec2 aDrift;
  attribute float aWaveFrequency;
  attribute float aOrderLane;
  attribute float aReject;
  attribute float aIndex;

  uniform float uActive;
  uniform float uEmitterKind;
  uniform float uSourceWidth;
  uniform float uIntakeStrength;
  uniform float uTurbulenceStrength;
  uniform float uTime;
  uniform float uVelocity;
  uniform vec3 uIntakePosition;
  uniform vec3 uEmitterEnd;
  uniform vec3 uEmitterStart;
  uniform vec3 uObstaclePosition;
  uniform float uBoxY;
  uniform float uBoxSpacing;
  uniform float uBatchIndex;
  uniform float uSlotCount;
  uniform vec2 uHalfSize;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vViewDepth;
  varying float vStale;
  varying float vReason;
  varying float vFade;

  mat3 rotateZ(float angle) {
    float sine = sin(angle);
    float cosine = cos(angle);
    return mat3(
      cosine, sine, 0.0,
      -sine, cosine, 0.0,
      0.0, 0.0, 1.0
    );
  }

  vec3 getFlowPosition(float progress, float stale, out float drop) {
    float pathPhase =
      progress * 18.0 * aWaveFrequency + aPhase;
    vec3 flowPosition = mix(uEmitterStart, uEmitterEnd, progress);
    drop = 0.0;

    if (uEmitterKind < 0.5) {
      float travelX = flowPosition.x;
      float release = smoothstep(0.0, 0.3, progress);
      float laneY =
        aOrigin.y * (2.15 + uSourceWidth * 0.65);
      flowPosition.y = mix(
        uEmitterStart.y +
          sin(pathPhase * 1.15) * aDrift.x * 0.12,
        laneY + sin(pathPhase) * aDrift.x,
        release
      );
      flowPosition.z = mix(
        uEmitterStart.z + cos(pathPhase) * aDrift.y * 0.08,
        aOrigin.z + cos(pathPhase * 0.72) * aDrift.y,
        release
      );

      float turbulenceEnvelope = smoothstep(
        ${DOCUMENT_TURBULENCE_PHYSICS.onsetStart.toFixed(2)},
        ${DOCUMENT_TURBULENCE_PHYSICS.onsetEnd.toFixed(2)},
        progress
      );
      float turbulence =
        uTurbulenceStrength *
        turbulenceEnvelope *
        (0.82 + aDrift.x * 1.8);
      float gustTime =
        uTime * (1.7 + aWaveFrequency * 3.4);
      float gustA =
        pathPhase * 0.72 + gustTime + aOrigin.z * 0.33;
      float gustB =
        pathPhase * 2.1 - gustTime * 1.27 + aOrigin.y * 4.5;
      float gustC =
        pathPhase * 4.6 + gustTime * 0.73 + aPhase * 1.9;
      float widthBoost =
        1.0 +
        uSourceWidth *
        ${DOCUMENT_TURBULENCE_PHYSICS.sourceWidthInfluence.toFixed(2)};
      float longitudinalGust =
        sin(gustB) * 0.72 + cos(gustC) * 0.28;
      float lateralGust =
        (
          sin(gustA) +
          sin(gustB) * 0.55 +
          cos(gustC) * 0.28
        ) / 1.83;
      float depthGust =
        (
          cos(gustA * 0.87) +
          sin(gustB * 1.13) * 0.48 +
          cos(gustC * 0.71) * 0.32
        ) / 1.8;
      flowPosition.x +=
        longitudinalGust *
        ${DOCUMENT_TURBULENCE_PHYSICS.longitudinalAmplitude.toFixed(2)} *
        turbulence;
      flowPosition.y +=
        lateralGust *
        ${DOCUMENT_TURBULENCE_PHYSICS.lateralAmplitude.toFixed(2)} *
        widthBoost *
        turbulence;
      flowPosition.z +=
        depthGust *
        ${DOCUMENT_TURBULENCE_PHYSICS.depthAmplitude.toFixed(2)} *
        turbulence;

      // With Deasy: the river is drawn into the massing's mouth.
      float suction = smoothstep(
        uIntakePosition.x - ${DOCUMENT_INTAKE_PHYSICS.suctionDistance.toFixed(2)},
        uIntakePosition.x,
        flowPosition.x
      ) * uIntakeStrength;
      // Without Deasy: everything is crammed straight into the AI terminal.
      // Depth lanes funnel in first so the foreground never masks the device.
      float terminalPull = smoothstep(
        uObstaclePosition.x - ${DOCUMENT_INTAKE_PHYSICS.suctionDistance.toFixed(2)},
        uObstaclePosition.x,
        flowPosition.x
      ) * (1.0 - uIntakeStrength);
      float terminalDepthPull = smoothstep(
        uObstaclePosition.x - ${TERMINAL_COLLAPSE.funnel.toFixed(2)},
        uObstaclePosition.x - ${TERMINAL_COLLAPSE.end.toFixed(2)},
        flowPosition.x
      ) * (1.0 - uIntakeStrength);
      vec3 pullTarget = mix(
        uObstaclePosition,
        uIntakePosition,
        uIntakeStrength
      );
      flowPosition.y = mix(
        flowPosition.y,
        pullTarget.y,
        max(suction, terminalPull)
      );
      flowPosition.z = mix(
        flowPosition.z,
        pullTarget.z,
        max(suction, terminalDepthPull)
      );

      // Rejected documents fall out of the massing's underside into the
      // sorting box for their reason, then vanish at its mouth.
      float dropActive = uIntakeStrength * stale;
      drop = smoothstep(
        uIntakePosition.x,
        uIntakePosition.x + ${REJECT_DROP_LENGTH.toFixed(2)},
        travelX
      ) * dropActive;
      float boxX =
        uIntakePosition.x + ${DEASY_MASSING_LENGTH.toFixed(2)} * 0.5 +
        (aReject - 2.0) * uBoxSpacing;
      float settle = smoothstep(0.0, 0.7, drop);
      flowPosition.x = mix(
        flowPosition.x -
          max(0.0, flowPosition.x - uIntakePosition.x) * 0.45 * dropActive,
        boxX,
        settle
      );
      flowPosition.y = mix(
        flowPosition.y,
        uBoxY + 0.3,
        pow(drop, 1.25)
      ) - sin(drop * 3.14159) * 0.35 * dropActive;
    } else {
      // With Deasy: one clean file. No lanes, no depth wobble, level with the mouth.
      flowPosition.y = uEmitterStart.y;
      flowPosition.z = uEmitterStart.z;
    }

    return flowPosition;
  }

  void main() {
    float travelDistance =
      max(0.1, distance(uEmitterStart, uEmitterEnd));
    float orderedOutput = step(1.5, uEmitterKind);
    // Ordered output uses evenly spaced slots instead of the river's jittered origins.
    float slotOrigin =
      (aIndex * ${DOCUMENT_VARIANTS.length.toFixed(1)} + uBatchIndex) /
      max(uSlotCount, 1.0) * ${FLOW_DISTANCE.toFixed(1)};
    float originX = mix(aOrigin.x, slotOrigin, orderedOutput);
    // Order is slow: the file after Deasy moves at a fraction of the river.
    float progress = mod(
      originX / ${FLOW_DISTANCE.toFixed(1)} +
        uTime * uVelocity * mix(1.0, 0.3, orderedOutput) / travelDistance,
      1.0
    );
    float stale = step(0.5, aReject) * (1.0 - orderedOutput);
    float drop;
    float nextDrop;
    vec3 particlePosition = getFlowPosition(progress, stale, drop);
    vec3 nextParticlePosition =
      getFlowPosition(min(progress + 0.004, 1.0), stale, nextDrop);
    vec2 flowDirection = normalize(
      nextParticlePosition.xy -
        particlePosition.xy +
        vec2(0.0001, 0.0)
    );
    float flowAngle = atan(flowDirection.y, flowDirection.x);
    float particleTime = uTime + aPhase;
    float turbulenceEnvelope =
      smoothstep(
        ${DOCUMENT_TURBULENCE_PHYSICS.onsetStart.toFixed(2)},
        ${DOCUMENT_TURBULENCE_PHYSICS.onsetEnd.toFixed(2)},
        progress
      ) *
      uTurbulenceStrength;
    float tumbleZ =
      sin(particleTime * (1.8 + aWaveFrequency * 2.4) * 0.83 + aPhase * 1.7);
    float dropTumble =
      drop * 1.6 * (step(3.14159, aPhase) * 2.0 - 1.0);
    float rotation =
      mix(
        aRotation +
          flowAngle +
          tumbleZ *
          ${DOCUMENT_TURBULENCE_PHYSICS.rotationZAmplitude.toFixed(2)} *
          turbulenceEnvelope +
          dropTumble,
        // Every page upright; landscape pages turn so their long side is vertical.
        step(uHalfSize.y, uHalfSize.x) * 1.570796,
        orderedOutput
      );
    mat3 rotationMatrix = rotateZ(rotation);
    float emergence = smoothstep(0.0, 0.08, progress);
    float intake =
      1.0 - smoothstep(0.86, 1.0, progress);
    float intakeScale =
      1.0 -
      uIntakeStrength *
      (1.0 - stale) *
      smoothstep(
        uIntakePosition.x - ${DOCUMENT_INTAKE_PHYSICS.collapseDistance.toFixed(2)},
        uIntakePosition.x + ${DOCUMENT_INTAKE_PHYSICS.passThroughDistance.toFixed(2)},
        particlePosition.x
      );
    float terminalScale =
      1.0 -
      (1.0 - uIntakeStrength) *
      (1.0 - orderedOutput) *
      smoothstep(
        uObstaclePosition.x - ${TERMINAL_COLLAPSE.start.toFixed(2)},
        uObstaclePosition.x - ${TERMINAL_COLLAPSE.end.toFixed(2)},
        particlePosition.x
      );
    float dropScale = 1.0 - 0.55 * drop;
    // Nothing survives past the terminal in any mode or mid-transition. The
    // mode-blended collapses above leave a gap while uIntakeStrength lerps.
    float wall =
      1.0 -
      smoothstep(
        uObstaclePosition.x - ${TERMINAL_COLLAPSE.start.toFixed(2)},
        uObstaclePosition.x - ${TERMINAL_COLLAPSE.end.toFixed(2)},
        particlePosition.x
      );
    float displayScale = mix(aScale, 0.32, orderedOutput);
    vec3 worldPosition =
      rotationMatrix *
        (
          position *
          displayScale *
          emergence *
          intake *
          intakeScale *
          terminalScale *
          dropScale *
          wall *
          uActive
        ) +
      particlePosition;
    vec4 viewPosition =
      modelViewMatrix * vec4(worldPosition, 1.0);

    vUv = uv;
    vNormal =
      normalize(normalMatrix * rotationMatrix * normal);
    vViewDepth = -viewPosition.z;
    vStale = stale;
    vReason = aReject;
    vFade = 1.0 - smoothstep(0.78, 0.98, drop);
    gl_Position = projectionMatrix * viewPosition;
  }
`

const CUBE_DEPTH = 0.8
/** Long lens at the distance that gives the same frame height at the scene plane as 42° / 11.5. */
const CAMERA = { z: 26.7, fov: 18 } as const

const fragmentShader = `
  uniform sampler2D uAbstractTexture;
  uniform sampler2D uTexture;
  uniform float uOrderedOutput;
  uniform float uUseAbstractTexture;
  uniform vec3 uAccent;
  uniform float uIntakeStrength;
  uniform vec2 uHalfSize;
  uniform float uReasonHighlight;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vViewDepth;
  varying float vStale;
  varying float vReason;
  varying float vFade;

  const vec3 PITCH = ${glslColor(BRAND.pitch)};
  const vec3 ASH = ${glslColor(BRAND.ash)};
  const vec3 STONE = ${glslColor(BRAND.stone)};
  const vec3 CLAY = ${glslColor(BRAND.clay)};
  const vec3 LIMESTONE = ${glslColor(BRAND.limestone)};
  const vec3 SAGE = ${glslColor(BRAND.sage)};
  const vec3 REASON_1 = ${glslColor(REJECT_REASONS[0].color)};
  const vec3 REASON_2 = ${glslColor(REJECT_REASONS[1].color)};
  const vec3 REASON_3 = ${glslColor(REJECT_REASONS[2].color)};

  float hash(vec2 point) {
    return fract(sin(dot(point, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec4 texel = mix(
      texture2D(uTexture, vUv),
      texture2D(uAbstractTexture, vUv),
      uUseAbstractTexture
    );
    if (texel.a < 0.04) discard;
    if (hash(gl_FragCoord.xy) > vFade) discard;

    // Remap the render onto the brand paper ramp: Pitch ink, Ash/Stone/Clay
    // rules, Limestone stock. Saturated marks collapse to the variant accent.
    float luma = dot(texel.rgb, vec3(0.2126, 0.7152, 0.0722));
    float peak = max(texel.r, max(texel.g, texel.b));
    float saturation =
      (peak - min(texel.r, min(texel.g, texel.b))) / max(peak, 0.02);
    vec3 paper = mix(PITCH, ASH, smoothstep(0.0, 0.1, luma));
    paper = mix(paper, STONE, smoothstep(0.1, 0.3, luma));
    paper = mix(paper, CLAY, smoothstep(0.3, 0.55, luma));
    paper = mix(paper, LIMESTONE, smoothstep(0.55, 0.85, luma));
    vec3 accent = uAccent * (0.7 + 0.6 * smoothstep(0.0, 0.4, luma));
    paper = mix(paper, accent, smoothstep(0.25, 0.5, saturation));
    // Rejects carry their reason's color, but only once Deasy is sorting:
    // without it every page is just a page. The reason named in the headline
    // reads a touch stronger so the word and the paper feel like one piece.
    vec3 reasonColor = vReason < 1.5 ? REASON_1 : (vReason < 2.5 ? REASON_2 : REASON_3);
    float named = step(0.5, 1.0 - abs(uReasonHighlight - vReason));
    float sorted = vStale * uIntakeStrength;
    paper = mix(paper, mix(paper, reasonColor, 0.3 + 0.2 * named), sorted);

    vec2 local = (vUv - 0.5) * uHalfSize * 2.0;
    float edgeDistance =
      min(uHalfSize.x - abs(local.x), uHalfSize.y - abs(local.y));
    float edgePixel = fwidth(edgeDistance);
    float edge =
      1.0 - smoothstep(
        edgePixel * 1.4,
        edgePixel * mix(2.4, 3.2, uOrderedOutput),
        edgeDistance
      );
    vec3 edgeColor = mix(CLAY, SAGE, uOrderedOutput);
    edgeColor = mix(edgeColor, reasonColor, sorted);
    paper = mix(paper, edgeColor, edge);

    vec3 lightDirection = normalize(vec3(0.35, 0.6, 1.0));
    float lighting =
      0.72 + 0.28 * abs(dot(normalize(vNormal), lightDirection));
    // Tonal recession: cards more than ~1.3 behind the scene plane step
    // toward Pitch. Anchored to the camera so the lens is one constant.
    float fog = smoothstep(${(CAMERA.z - CUBE_DEPTH + 1.3).toFixed(1)}, ${(CAMERA.z - CUBE_DEPTH + 12.3).toFixed(1)}, vViewDepth);

    gl_FragColor = vec4(mix(paper * lighting, PITCH, fog * 0.82), 1.0);
    #include <colorspace_fragment>
  }
`


function randomGenerator(seed: number) {
  let state = seed

  return () => {
    state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0
    return state / 0x1_0000_0000
  }
}

type DocumentVariant = (typeof DOCUMENT_VARIANTS)[number]
type NumberRef = { current: number }
type BooleanRef = { current: boolean }

function createParticleGeometry(
  variant: DocumentVariant,
  batchIndex: number,
) {
  const geometry = new InstancedBufferGeometry()
  const random = randomGenerator(variant.seed)
  const origins = new Float32Array(DOCUMENT_BATCH_CAPACITY * 3)
  const rotations = new Float32Array(DOCUMENT_BATCH_CAPACITY)
  const scales = new Float32Array(DOCUMENT_BATCH_CAPACITY)
  const phases = new Float32Array(DOCUMENT_BATCH_CAPACITY)
  const drifts = new Float32Array(DOCUMENT_BATCH_CAPACITY * 2)
  const waveFrequencies = new Float32Array(DOCUMENT_BATCH_CAPACITY)
  const orderLanes = new Float32Array(DOCUMENT_BATCH_CAPACITY)
  const rejects = new Float32Array(DOCUMENT_BATCH_CAPACITY)
  const indexes = Float32Array.from({ length: DOCUMENT_BATCH_CAPACITY }, (_, index) => index)

  geometry.setAttribute(
    'position',
    new BufferAttribute(
      new Float32Array([
        -variant.halfWidth, -variant.halfHeight,  0.004,
         variant.halfWidth, -variant.halfHeight,  0.004,
         variant.halfWidth,  variant.halfHeight,  0.004,
        -variant.halfWidth,  variant.halfHeight,  0.004,
        -variant.halfWidth, -variant.halfHeight, -0.004,
         variant.halfWidth, -variant.halfHeight, -0.004,
         variant.halfWidth,  variant.halfHeight, -0.004,
        -variant.halfWidth,  variant.halfHeight, -0.004,
      ]),
      3,
    ),
  )
  geometry.setAttribute(
    'uv',
    new BufferAttribute(
      new Float32Array([
        0, 0,
        1, 0,
        1, 1,
        0, 1,
        1, 0,
        0, 0,
        0, 1,
        1, 1,
      ]),
      2,
    ),
  )
  geometry.setIndex([
    0, 1, 2,
    0, 2, 3,
    4, 6, 5,
    4, 7, 6,
  ])
  geometry.computeVertexNormals()

  for (let index = 0; index < DOCUMENT_BATCH_CAPACITY; index += 1) {
    const vectorOffset = index * 3
    const driftOffset = index * 2
    const globalIndex = index * DOCUMENT_VARIANTS.length + batchIndex
    const laneBlock = Math.floor(globalIndex / DOCUMENT_LANES)
    const laneOffset = globalIndex % DOCUMENT_LANES
    const laneIndex =
      (laneOffset * LANE_MULTIPLIERS[laneBlock] + laneBlock * 7) %
      DOCUMENT_LANES
    const verticalLane = laneIndex % VERTICAL_LANES
    const depthLane = Math.floor(laneIndex / VERTICAL_LANES)
    const distributedIndex = (globalIndex * 73) % DOCUMENT_CAPACITY

    const xJitter = (random() - 0.5) * 1.1
    origins[vectorOffset] =
      ((distributedIndex / DOCUMENT_CAPACITY) * FLOW_DISTANCE +
        xJitter +
        FLOW_DISTANCE) %
      FLOW_DISTANCE
    origins[vectorOffset + 1] =
      verticalLane / (VERTICAL_LANES - 1) - 0.5 +
      (random() - 0.5) * 0.06
    origins[vectorOffset + 2] =
      DEPTH_LANE_POSITIONS[depthLane] + (random() - 0.5) * 0.16
    rotations[index] = -Math.PI / 2 + (random() - 0.5) * 0.2
    scales[index] = 0.26 + random() * 0.24
    orderLanes[index] = verticalLane
    phases[index] = random() * Math.PI * 2
    drifts[driftOffset] = 0.05 + random() * 0.08
    drifts[driftOffset + 1] = 0.03 + random() * 0.05
    waveFrequencies[index] = 0.14 + random() * 0.22
    // One draw keeps the locked scale/lane sequence; the same roll picks the reason.
    const roll = random()
    rejects[index] =
      roll < STALE_FRACTION ? 1 + Math.floor((roll / STALE_FRACTION) * 3) : 0
  }

  geometry.setAttribute('aOrigin', new InstancedBufferAttribute(origins, 3))
  geometry.setAttribute('aRotation', new InstancedBufferAttribute(rotations, 1))
  geometry.setAttribute('aScale', new InstancedBufferAttribute(scales, 1))
  geometry.setAttribute('aPhase', new InstancedBufferAttribute(phases, 1))
  geometry.setAttribute('aDrift', new InstancedBufferAttribute(drifts, 2))
  geometry.setAttribute(
    'aOrderLane',
    new InstancedBufferAttribute(orderLanes, 1),
  )
  geometry.setAttribute(
    'aWaveFrequency',
    new InstancedBufferAttribute(waveFrequencies, 1),
  )
  geometry.setAttribute('aReject', new InstancedBufferAttribute(rejects, 1))
  geometry.setAttribute('aIndex', new InstancedBufferAttribute(indexes, 1))
  geometry.instanceCount = DOCUMENT_BATCH_CAPACITY

  return geometry
}


function getBatchDensity(total: number, batchIndex: number) {
  const baseDensity = Math.floor(total / DOCUMENT_VARIANTS.length)
  const remainder = total % DOCUMENT_VARIANTS.length

  return baseDensity + (batchIndex < remainder ? 1 : 0)
}

const EMITTER_KIND: Record<StreamPath, number> = {
  source: 0,
  ordered: 2,
}

type DocumentEmitterSettings = {
  abstractTextures: BooleanRef
  density: NumberRef
  sourceWidth: NumberRef
  velocity: NumberRef
  /** Reject reason (1–3) named by the headline right now; 0 when none. */
  reasonHighlight: NumberRef
}

function DocumentParticleBatch({
  active,
  batchIndex,
  intakeStrength,
  settings,
  stream,
  turbulenceStrength,
  variant,
}: {
  active: boolean
  batchIndex: number
  intakeStrength: number
  settings: DocumentEmitterSettings
  stream: StreamEmitter
  turbulenceStrength: number
  variant: DocumentVariant
}) {
  const {
    densityScale,
    end,
    intake,
    obstacle,
    path,
    start,
  } = stream
  const material = useRef<ShaderMaterial>(null)
  const mesh = useRef<Mesh<InstancedBufferGeometry, ShaderMaterial>>(null)
  const abstractTexture = useTexture(variant.abstractTexture)
  const texture = useTexture(variant.texture)
  const geometry = useMemo(
    () => createParticleGeometry(variant, batchIndex),
    [batchIndex, variant],
  )
  const emitterKind = EMITTER_KIND[path]
  const uniforms = useMemo(
    () => ({
      uAbstractTexture: { value: abstractTexture },
      uTexture: { value: texture },
      uAccent: { value: new Color(variant.accent) },
      uActive: { value: Number(path === 'source') },
      uEmitterKind: { value: emitterKind },
      uEmitterEnd: { value: new Vector3() },
      uEmitterStart: { value: new Vector3() },
      uHalfSize: { value: new Vector2(variant.halfWidth, variant.halfHeight) },
      uIntakePosition: { value: new Vector3() },
      uIntakeStrength: { value: 0 },
      uObstaclePosition: { value: new Vector3() },
      uBoxY: { value: REJECT_BOX.y },
      uBoxSpacing: { value: REJECT_BOX.spacing },
      uReasonHighlight: { value: 0 },
      uBatchIndex: { value: batchIndex },
      uSlotCount: { value: 1 },
      uOrderedOutput: { value: Number(path === 'ordered') },
      uSourceWidth: { value: RIVER_CONTROLS.sourceWidth.value },
      uTurbulenceStrength: { value: 0 },
      uTime: { value: 0 },
      uUseAbstractTexture: {
        value: Number(MATERIAL_CONTROLS.abstractTextures.value),
      },
      uVelocity: { value: RIVER_CONTROLS.velocity.value },
    }),
    [
      abstractTexture,
      emitterKind,
      path,
      texture,
      variant,
    ],
  )

  useEffect(() => {
    for (const loadedTexture of [abstractTexture, texture]) {
      loadedTexture.colorSpace = SRGBColorSpace
      loadedTexture.anisotropy = 8
      loadedTexture.needsUpdate = true
    }
    return () => geometry.dispose()
  }, [abstractTexture, geometry, texture])

  useFrame(({ clock }, delta) => {
    const liveGeometry = mesh.current?.geometry
    const shader = material.current
    if (!liveGeometry || !shader) return

    const damping = Math.min(1, delta * 7)
    shader.uniforms.uActive.value +=
      (Number(active) - shader.uniforms.uActive.value) * damping
    shader.uniforms.uIntakeStrength.value +=
      (intakeStrength - shader.uniforms.uIntakeStrength.value) * damping
    shader.uniforms.uTurbulenceStrength.value +=
      (turbulenceStrength - shader.uniforms.uTurbulenceStrength.value) *
      damping
    liveGeometry.instanceCount =
      active || shader.uniforms.uActive.value > 0.001
        ? getBatchDensity(
            Math.round(settings.density.current * densityScale),
            batchIndex,
          )
        : 0
    shader.uniforms.uTime.value = clock.elapsedTime
    shader.uniforms.uSourceWidth.value = settings.sourceWidth.current
    shader.uniforms.uVelocity.value = settings.velocity.current
    shader.uniforms.uUseAbstractTexture.value = Number(
      settings.abstractTextures.current,
    )
    shader.uniforms.uEmitterStart.value.set(...start)
    shader.uniforms.uEmitterEnd.value.set(...end)
    shader.uniforms.uIntakePosition.value.set(...intake)
    shader.uniforms.uObstaclePosition.value.set(...obstacle)
    shader.uniforms.uReasonHighlight.value = settings.reasonHighlight.current
    shader.uniforms.uSlotCount.value =
      Math.round(settings.density.current * densityScale)
  })

  return (
    <mesh ref={mesh} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        // Shader edits arrive over HMR as new strings; keying on them forces a
        // recompile instead of leaving the old program bound.
        key={vertexShader.length ^ (fragmentShader.length << 12)}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        vertexShader={vertexShader}
      />
    </mesh>
  )
}

function DocumentEmitter({
  active,
  intakeStrength,
  settings,
  stream,
  turbulenceStrength,
}: {
  active: boolean
  intakeStrength: number
  settings: DocumentEmitterSettings
  stream: StreamEmitter
  turbulenceStrength: number
}) {
  return stream.variantIndexes.map((batchIndex) => {
    const variant = DOCUMENT_VARIANTS[batchIndex]

    return (
      <DocumentParticleBatch
        active={active}
        batchIndex={batchIndex}
        intakeStrength={intakeStrength}
        key={`${stream.path}-${variant.texture}`}
        settings={settings}
        stream={stream}
        turbulenceStrength={turbulenceStrength}
        variant={variant}
      />
    )
  })
}

function DocumentParticleSystem({
  mode,
  reasonHighlight,
  topology,
  turbulenceStrength,
}: {
  mode: DocumentStreamMode
  reasonHighlight: NumberRef
  topology: DocumentStreamTopology
  turbulenceStrength: number
}) {
  const sourceWidth = useRef(RIVER_CONTROLS.sourceWidth.value)
  const velocity = useRef(RIVER_CONTROLS.velocity.value)
  const density = useRef(RIVER_CONTROLS.density.value)
  const abstractTextures = useRef(MATERIAL_CONTROLS.abstractTextures.value)
  const settings = useMemo(
    () => ({
      abstractTextures,
      density,
      sourceWidth,
      velocity,
      reasonHighlight,
    }),
    [reasonHighlight],
  )

  useControls('Document River', {
    sourceWidth: {
      ...RIVER_CONTROLS.sourceWidth,
      onChange(value) {
        sourceWidth.current = value
      },
    },
    velocity: {
      ...RIVER_CONTROLS.velocity,
      onChange(value) {
        velocity.current = value
      },
    },
    density: {
      ...RIVER_CONTROLS.density,
      onChange(value) {
        density.current = Math.round(value)
      },
    },
    abstractTextures: {
      ...MATERIAL_CONTROLS.abstractTextures,
      onChange(value) {
        abstractTextures.current = value
      },
    },
  })

  return (
    <>
      {topology.sourceStreams.map((stream) => (
        <DocumentEmitter
          active
          intakeStrength={mode.intakeStrength}
          key={`source-${stream.variantIndexes[0]}`}
          settings={settings}
          stream={stream}
          turbulenceStrength={turbulenceStrength}
        />
      ))}
      <DocumentEmitter
        active={mode.orderedOutputActive}
        intakeStrength={0}
        settings={settings}
        stream={topology.orderedStream}
        turbulenceStrength={0}
      />
    </>
  )
}

// Reads the symbol out of the Clay-on-Clay etch map and inks it in Chalk on
// the block. The symbol's diffuse stays Chalk (white core); its emissive is
// Sage well above 1.0 so the bloom pass spills green around it.
function etchSymbol(shader: WebGLProgramParametersWithUniforms) {
  shader.uniforms.uLogoGlow = { value: 0 }
  shader.fragmentShader = shader.fragmentShader
    .replace('#include <common>', '#include <common>\nuniform float uLogoGlow;')
    .replace(
      '#include <map_fragment>',
      `
      float etch = smoothstep(
        0.58,
        0.42,
        luminance( texture2D( map, vMapUv ).rgb )
      );
      diffuseColor.rgb = mix( diffuseColor.rgb, ${glslColor(BRAND.chalk)}, etch );
      `,
    )
    .replace(
      '#include <emissivemap_fragment>',
      `
      #include <emissivemap_fragment>
      totalEmissiveRadiance += ${glslColor(BRAND.sage)} * etch * uLogoGlow * 4.0;
      `,
    )
}

const GLOW_CONTROLS = {
  logoGlow: { value: 0.7, min: 0, max: 2, step: 0.05, label: 'Logo glow' },
  halo: { value: 0, min: 0, max: 1, step: 0.05, label: 'Block halo' },
  sageCast: { value: 0, min: 0, max: 0.6, step: 0.05, label: 'Sage cast' },
}


const DEASY_LOGO_NORMAL_URL = '/brand/logos/deasy-labs-symbol-normal.png'
const DEASY_LOGO_ETCH_URL = '/brand/logos/deasy-labs-symbol-etch.png'

// Stays mounted across the cycle so textures, materials, and the etch/bloom
// shaders compile once at load, not on every With flip; hidden at scale 0.
function DeasyMassing({
  reduceMotion,
  visible,
  x,
}: {
  reduceMotion: boolean
  visible: boolean
  x: number
}) {
  const group = useRef<Group>(null)
  const logoEtchMap = useTexture(DEASY_LOGO_ETCH_URL)
  const logoNormalMap = useTexture(DEASY_LOGO_NORMAL_URL)
  const initialScale = reduceMotion ? 0.98 : 0.9
  const glow = useControls('Deasy glow', GLOW_CONTROLS)
  const halo = useRef<ShaderMaterial>(null)
  const blockEdges = useRef<EdgesRef>(null)
  const { faces, materials, etched } = useMemo(() => {
    const plaster = new MeshStandardMaterial({
      color: '#b7500c',
      roughness: 0.78,
    })
    plaster.onBeforeCompile = facetShading
    const etched = new MeshStandardMaterial({
      color: '#b7500c',
      map: logoEtchMap,
      normalMap: logoNormalMap,
      normalScale: new Vector2(0.6, 0.6),
      roughness: 0.78,
    })
    etched.onBeforeCompile = (shader) => { facetShading(shader); etchSymbol(shader); etched.userData.shader = shader }
    return {
      faces: [plaster, plaster, plaster, plaster, etched, plaster],
      materials: [plaster, etched],
      etched,
    }
  }, [logoEtchMap, logoNormalMap])

  useEffect(() => {
    const body = new Color(visible ? '#b7500c' : BRAND.coal).lerp(new Color(BRAND.sage), glow.sageCast)
    for (const material of materials) material.color.copy(body)
  }, [glow.sageCast, materials, visible])

  useFrame(({ clock }) => {
    const pulse = glowPulse(clock.elapsedTime, reduceMotion)
    if (halo.current) halo.current.uniforms.uHalo.value = glow.halo * pulse
    const logoUniform = etched.userData.shader?.uniforms.uLogoGlow
    if (logoUniform) logoUniform.value = glow.logoGlow * pulse
    if (blockEdges.current) edgeTint(materials[0].color, blockEdges.current.material.color)
  })

  useEffect(() => {
    logoEtchMap.colorSpace = SRGBColorSpace
    for (const texture of [logoEtchMap, logoNormalMap]) {
      texture.anisotropy = 8
      texture.needsUpdate = true
    }
  }, [logoEtchMap, logoNormalMap])

  useEffect(
    () => () => {
      for (const material of materials) material.dispose()
    },
    [materials],
  )

  useEffect(() => {
    const target = group.current
    if (!target) return
    if (!visible) {
      target.scale.setScalar(0)
      return
    }
    const scale = motionValue(initialScale)
    const unsubscribe = scale.on('change', (value) => {
      target.scale.setScalar(value)
    })
    const animation = animate(
      scale,
      1,
      reduceMotion
        ? {
            duration: 0.2,
            ease: [0.23, 1, 0.32, 1],
          }
        : {
            type: 'spring',
            stiffness: 420,
            damping: 17,
            mass: 0.8,
          },
    )

    return () => {
      unsubscribe()
      animation.stop()
    }
  }, [initialScale, reduceMotion, visible])

  return (
    <group
      ref={group}
      position={[x, 0, CUBE_DEPTH]}
      scale={visible ? initialScale : 0}
    >
      <mesh material={faces} scale={DEASY_MASSING_SCALE}>
        <boxGeometry />
        <Edges ref={blockEdges} color={BRAND.coal} lineWidth={HAIRLINE} toneMapped={false} />
      </mesh>
      {/* Optional soft halo behind the block; off by default, Leva "Block halo". */}
      <mesh position={[0, 0, -DEASY_MASSING_SCALE * 0.55]} scale={DEASY_MASSING_SCALE * 3.4}>
        <planeGeometry />
        <shaderMaterial
          ref={halo}
          blending={AdditiveBlending}
          depthWrite={false}
          fragmentShader={haloFragmentShader}
          transparent
          uniforms={{ uHalo: { value: 0 } }}
          vertexShader={glowVertexShader}
        />
      </mesh>
    </group>
  )
}


/**
 * Three sorting boxes under the massing, one per reject reason, in the
 * SourceBox kit: Coal body, Pitch mouth, Stone edges, and a colored lip
 * that lights when the headline names that reason. Labels are intentionally
 * omitted so the visual communicates sorting without stale copy.
 */
function RejectBoxes({
  deasyX,
  reasonHighlight,
  reduceMotion,
  visible,
}: {
  deasyX: number
  reasonHighlight: NumberRef
  reduceMotion: boolean
  visible: boolean
}) {
  const group = useRef<Group>(null)
  const lips = useRef<(MeshStandardMaterial | null)[]>([null, null, null])
  const shown = useRef(0)
  useFrame((_, delta) => {
    const damping = reduceMotion ? 1 : 1 - Math.exp(-Math.min(delta, 0.1) * 6)
    shown.current += (Number(visible) - shown.current) * damping
    const target = group.current
    if (target) {
      target.visible = shown.current > 0.01
      target.position.y = REJECT_BOX.y - (1 - shown.current) * 1.4
      target.scale.setScalar(0.7 + shown.current * 0.3)
    }
    lips.current.forEach((lip, index) => {
      if (!lip) return
      const named = reasonHighlight.current === index + 1 ? 1 : 0
      lip.emissiveIntensity += (named * 0.55 - lip.emissiveIntensity) * damping
    })
  })
  const { width, height, depth } = REJECT_BOX
  return (
    <group ref={group} position={[deasyX, REJECT_BOX.y, CUBE_DEPTH]} visible={false}>
      {REJECT_REASONS.map((reason, index) => (
        <group key={reason.name} name={`reject-box-${reason.name}`} position={[(index - 1) * REJECT_BOX.spacing, 0, 0]}>
          <mesh>
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial color={BRAND.ash} onBeforeCompile={facetShading} roughness={0.7} />
            <Edges color={REJECT_EDGE} lineWidth={HAIRLINE} toneMapped={false} />
          </mesh>
          <mesh position={[0, height / 2 + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[width - 0.12, depth - 0.12]} />
            <meshStandardMaterial color={BRAND.pitch} onBeforeCompile={facetShading} roughness={0.85} />
          </mesh>
          <mesh position={[0, height / 2 - 0.07, depth / 2 + 0.004]}>
            <planeGeometry args={[width, 0.12]} />
            <meshStandardMaterial
              ref={(material) => { lips.current[index] = material }}
              color={reason.color}
              emissive={reason.color}
              emissiveIntensity={0}
              onBeforeCompile={facetShading}
              roughness={0.55}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}



function StreamObjects({
  engaged,
  pressure,
  reasonHighlight,
  withDeasy,
}: {
  /** Second beat of the flip: block, intake, sorting, and the fed terminal. */
  engaged: boolean
  pressure: NumberRef
  reasonHighlight: NumberRef
  withDeasy: boolean
}) {
  const reduceMotion = Boolean(useReducedMotion())
  const { camera, viewport } = useThree()
  const currentViewport = viewport.getCurrentViewport(
    camera,
    [0, 0, CUBE_DEPTH],
  )
  // Preserve the desktop composition on narrow screens and uniformly scale it
  // down, rather than pulling individual objects into a mobile-only layout.
  const sceneScale = Math.min(1, currentViewport.width / MIN_SCENE_LAYOUT_WIDTH)
  const layoutWidth = currentViewport.width / sceneScale
  const agentX = layoutWidth / 4 + 0.6
  const characterScale = CHARACTER_SCALE
  const [aiX, aiY] = agentIntake({ x: agentX, y: CHARACTER_Y, z: CUBE_DEPTH, scale: characterScale, layout: 'tall' })
  const deasyX = 0
  const sourceX = -layoutWidth / 4
  const emitterX = sourceX - 0.78
  const exitX = layoutWidth / 2 + 3
  const topology = useMemo(
    () =>
      createDocumentStreamTopology({
        aiX,
        aiY,
        deasyX,
        depth: CUBE_DEPTH,
        exitX,
        sourceX: emitterX,
        sourceYPositions: SOURCE_STREAM_Y_POSITIONS,
      }),
    [aiX, aiY, deasyX, emitterX, exitX],
  )
  const mode = getDocumentStreamMode(engaged)
  // With Deasy the river settles: same physics, less gust.
  const turbulenceStrength = reduceMotion
    ? DOCUMENT_TURBULENCE_PHYSICS.reducedMotionStrength
    : withDeasy ? 0.45 : 1

  return (
    <group scale={sceneScale}>
      {DOCUMENT_VARIANTS.map((variant) => (
        <SourceBox
          active={withDeasy}
          key={variant.sourceName}
          tone="coal"
          markColor={variant.brandColor}
          markScale={1.35}
          variant={variant}
          x={sourceX}
          y={SOURCE_Y_POSITIONS[SOURCE_SLOT_BY_NAME[variant.sourceName]]}
          z={CUBE_DEPTH}
        />
      ))}
      <DocumentParticleSystem
        mode={mode}
        reasonHighlight={reasonHighlight}
        topology={topology}
        turbulenceStrength={turbulenceStrength}
      />
      <DeasyMassing reduceMotion={reduceMotion} visible={mode.deasyVisible} x={deasyX} />
      <RejectBoxes
        deasyX={deasyX}
        reasonHighlight={reasonHighlight}
        reduceMotion={reduceMotion}
        visible={engaged}
      />
      <AgentTerminal
        pressure={pressure}
        reduceMotion={reduceMotion}
        scale={characterScale}
        state={engaged ? 'fed' : 'stressed'}
        tone="limestone"
        layout="tall"
        z={CUBE_DEPTH}
        positive
        x={agentX}
        y={CHARACTER_Y}
      />
    </group>
  )
}


const DEBUG_CONTROLS = new URLSearchParams(window.location.search).has('debug')

/**
 * The locked rotor, with the active word colored by its reject reason and the
 * reason reported upward so the matching box and papers light with it.
 */
function HeroRotor({ onReason }: { onReason: (reason: number) => void }) {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  useEffect(() => {
    if (reduceMotion) return
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % ROTOR_WORDS.length)
    }, ROTOR_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [reduceMotion])
  const entry = ROTOR_WORDS[reduceMotion ? 0 : index]
  useEffect(() => onReason(entry.reason), [entry, onReason])
  const color = REJECT_REASONS[entry.reason - 1].color
  return (
    <span className="rotor" aria-label={ROTOR_WORDS.map((item) => item.word).join(', ')}>
      <span className="rotor-measure" aria-hidden="true">{ROTOR_MEASURE_WORD}</span>
      <span className="rotor-stage">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={entry.word}
            className="rot-word"
            style={{ color }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            {entry.word}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  )
}

/**
 * Drives the character's pressure through each Without phase: a slow build,
 * then a surge in the last second so the timed flip reads as a rescue.
 */
function PressureClock({ pressure, withDeasy }: { pressure: NumberRef; withDeasy: boolean }) {
  const reduceMotion = Boolean(useReducedMotion())
  const elapsed = useRef(0)
  useEffect(() => { elapsed.current = 0 }, [withDeasy])
  useFrame((_, delta) => {
    elapsed.current += Math.min(delta, 0.1)
    const t = Math.min(1, elapsed.current / (WITHOUT_MS / 1000 - 0.25))
    // Already shaking at t=0, swelling fast, and peaking just before the flip.
    const target = withDeasy ? 0 : reduceMotion ? 0.6 : 0.4 + 0.6 * (0.5 * t + 0.5 * Math.pow(t, 3))
    pressure.current += (target - pressure.current) * (reduceMotion ? 1 : 1 - Math.exp(-Math.min(delta, 0.1) * 6))
  })
  return null
}

export default function App() {
  const [withDeasy, setWithDeasy] = useState(false)
  const [autoCycle, setAutoCycle] = useState(true)
  // The flip is two beats: sources light on the click; Deasy engages after
  // a short hold so the rescue reads as cause and effect. Dropping out is instant.
  const [engaged, setEngaged] = useState(false)
  useEffect(() => {
    if (!withDeasy) { setEngaged(false); return }
    const timer = window.setTimeout(() => setEngaged(true), 380)
    return () => window.clearTimeout(timer)
  }, [withDeasy])
  const { height: canvasHeight } = useControls('Canvas', CANVAS_CONTROLS)
  const pressure = useRef(0)
  const reasonHighlight = useRef(0)
  const onReason = useCallback((reason: number) => { reasonHighlight.current = reason }, [])
  // Runtime hygiene: drop to 1x on GPUs that can't hold 2x with bloom, and
  // stop rendering entirely while the hero is scrolled out of view.
  const [dpr, setDpr] = useState(2)
  const frame = useRef<HTMLDivElement>(null)
  const [onScreen, setOnScreen] = useState(true)
  useEffect(() => {
    const target = frame.current
    if (!target) return
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0 })
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!autoCycle) return
    const timer = window.setTimeout(
      () => setWithDeasy((value) => !value),
      withDeasy ? WITH_MS : WITHOUT_MS,
    )
    return () => window.clearTimeout(timer)
  }, [autoCycle, withDeasy])

  const selectMode = (value: boolean) => {
    setAutoCycle(false)
    setWithDeasy(value)
  }

  // Friday: leaving before the payoff still shows it. Any downward scroll
  // intent during the Without phase flips to With Deasy.
  useEffect(() => {
    if (!autoCycle || withDeasy) return
    const flip = () => { setAutoCycle(false); setWithDeasy(true) }
    const onWheel = (event: WheelEvent) => { if (event.deltaY > 0) flip() }
    let touchStart = 0
    const onTouchStart = (event: TouchEvent) => { touchStart = event.touches[0].clientY }
    const onTouchMove = (event: TouchEvent) => { if (touchStart - event.touches[0].clientY > 12) flip() }
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('scroll', flip, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', flip)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [autoCycle, withDeasy])

  return (
    <div
      className="rotating-document-page"
      data-deasy-mode={withDeasy ? 'with' : 'without'}
    >
      <header className="prototype-topbar">
        <div className="prototype-topbar-inner">
          <a className="prototype-brand" href="/" aria-label="Deasy Labs home">
            <span aria-hidden="true" />
          </a>
          <nav className="prototype-nav" aria-label="Primary navigation">
            <a href="#">Platform</a>
            <a href="#">Blog</a>
            <a href="#">Docs</a>
            <a className="prototype-cta" href="#">Book a demo</a>
          </nav>
        </div>
      </header>

      <main className="rotating-document-scene">
        <div className="prototype-hero-copy">
          <h1>
            <span className="hero-line">
              Catch <HeroRotor onReason={onReason} />
            </span>
            <span className="hero-line">before they become context</span>
          </h1>
          <p>
            Good answers start with good sources. Deasy reads across your files and systems, figures out how everything connects, and delivers the right context to your agents at runtime.
          </p>
        </div>
        <div
          aria-label="Compare the document stream"
          className="deasy-mode-toggle"
          role="group"
        >
          <button
            aria-pressed={!withDeasy}
            data-active={!withDeasy}
            onClick={() => selectMode(false)}
            type="button"
          >
            Without Deasy
          </button>
          <button
            aria-pressed={withDeasy}
            data-active={withDeasy}
            onClick={() => selectMode(true)}
            type="button"
          >
            With Deasy
          </button>
        </div>

        <div
          className="document-scene-frame"
          ref={frame}
          style={{ '--scene-height': `${canvasHeight}px` } as CSSProperties}
        >
          <Canvas
            camera={{ position: [0, 0, CAMERA.z], fov: CAMERA.fov }}
            dpr={dpr}
            flat
            frameloop={onScreen ? 'always' : 'never'}
          >
            <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(2)} />
            <StreamObjects engaged={engaged} pressure={pressure} reasonHighlight={reasonHighlight} withDeasy={withDeasy} />
            <PressureClock pressure={pressure} withDeasy={withDeasy} />
            {/* Half-float target: the bloom falloff bands in 8-bit. */}
            <EffectComposer frameBufferType={HalfFloatType} multisampling={0}>
              <Bloom
                intensity={0.7}
                luminanceSmoothing={0.45}
                luminanceThreshold={0.92}
                mipmapBlur
                radius={0.4}
              />
              <SMAA />
            </EffectComposer>
          </Canvas>
        </div>
      </main>

      {DEBUG_CONTROLS ? (
        <aside className="prototype-controls" aria-label="Scene controls">
          <Leva fill theme={CONTROL_THEME} />
        </aside>
      ) : (
        <Leva hidden />
      )}
    </div>
  )
}
