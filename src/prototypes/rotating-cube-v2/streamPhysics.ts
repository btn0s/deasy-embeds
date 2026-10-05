export const DOCUMENT_INTAKE_PHYSICS = {
  collapseDistance: 0.55,
  passThroughDistance: 0.08,
  suctionDistance: 2.4,
} as const
export const DOCUMENT_TURBULENCE_PHYSICS = {
  depthAmplitude: 0.8,
  lateralAmplitude: 0.95,
  longitudinalAmplitude: 0.34,
  onsetEnd: 0.16,
  onsetStart: 0.02,
  reducedMotionStrength: 0.18,
  rotationXAmplitude: 0.55,
  rotationYAmplitude: 0.8,
  rotationZAmplitude: 0.7,
  sourceWidthInfluence: 0.12,
} as const
export const DEASY_MASSING_SCALE = 2.3
export const DEASY_MASSING_LENGTH = DEASY_MASSING_SCALE
const DEASY_MASSING_INTAKE_OFFSET = DEASY_MASSING_LENGTH / 2


export type StreamPoint = readonly [number, number, number]
export type StreamPath = 'source' | 'ordered'

export type StreamEmitter = {
  densityScale: number
  end: StreamPoint
  intake: StreamPoint
  obstacle: StreamPoint
  path: StreamPath
  start: StreamPoint
  variantIndexes: readonly number[]
}

export type DocumentStreamMode = {
  deasyVisible: boolean
  intakeStrength: number
  orderedOutputActive: boolean
}

export type DocumentStreamTopology = {
  orderedStream: StreamEmitter
  sourceStreams: readonly StreamEmitter[]
}

type CreateDocumentStreamTopologyOptions = {
  aiX: number
  /** Height of the agent's screen; the river aims here. */
  aiY?: number
  deasyX: number
  depth: number
  exitX: number
  sourceX: number
  sourceYPositions: readonly number[]
}

type SampleDocumentIntakeOptions = {
  intake: StreamPoint
  position: StreamPoint
  strength: number
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const progress = Math.min(
    1,
    Math.max(0, (value - edge0) / (edge1 - edge0)),
  )
  return progress * progress * (3 - 2 * progress)
}
export function sampleDocumentTurbulenceEnvelope(progress: number) {
  return smoothstep(
    DOCUMENT_TURBULENCE_PHYSICS.onsetStart,
    DOCUMENT_TURBULENCE_PHYSICS.onsetEnd,
    progress,
  )
}


export function sampleDocumentIntake({
  intake,
  position,
  strength,
}: SampleDocumentIntakeOptions) {
  const clampedStrength = Math.min(1, Math.max(0, strength))
  const suction =
    smoothstep(
      intake[0] - DOCUMENT_INTAKE_PHYSICS.suctionDistance,
      intake[0],
      position[0],
    ) * clampedStrength
  const collapse =
    smoothstep(
      intake[0] - DOCUMENT_INTAKE_PHYSICS.collapseDistance,
      intake[0] + DOCUMENT_INTAKE_PHYSICS.passThroughDistance,
      position[0],
    ) * clampedStrength

  return {
    position: [
      position[0],
      position[1] + (intake[1] - position[1]) * suction,
      position[2] + (intake[2] - position[2]) * suction,
    ] as StreamPoint,
    scale: 1 - collapse,
  }
}

export function createDocumentStreamTopology({
  aiX,
  aiY = 0,
  deasyX,
  depth,
  exitX,
  sourceX,
  sourceYPositions,
}: CreateDocumentStreamTopologyOptions): DocumentStreamTopology {
  const intake: StreamPoint = [deasyX - DEASY_MASSING_INTAKE_OFFSET, 0, depth]
  const obstacle: StreamPoint = [aiX, aiY, depth]
  const sourceStreams = sourceYPositions.map(
    (sourceY, batchIndex): StreamEmitter => ({
      densityScale: 1,
      end: [exitX, 0, depth],
      intake,
      obstacle,
      path: 'source',
      start: [sourceX, sourceY, depth],
      variantIndexes: [batchIndex],
    }),
  )

  return {
    orderedStream: {
      densityScale: 1 / 17,
      end: obstacle,
      intake,
      obstacle,
      path: 'ordered',
      start: [deasyX, aiY, depth],
      variantIndexes: sourceYPositions.map((_, index) => index),
    },
    sourceStreams,
  }
}

export function getDocumentStreamMode(
  withDeasy: boolean,
): DocumentStreamMode {
  return {
    deasyVisible: withDeasy,
    intakeStrength: Number(withDeasy),
    orderedOutputActive: withDeasy,
  }
}
