import { computed, defineComponent, shallowRef, type CSSProperties, type PropType } from 'vue';
import { watchAfterMount, useMotionPreference } from '../composables';
import { Three, StandardMaterial, SceneCanvas as Canvas, Edges, PerformanceMonitor, EffectComposer, Bloom, SMAA, SceneControls as Leva, useSceneControls, useSceneFrame, useSceneContext, loadTexture, getGLTF, preloadGLTF, type EdgesRef } from '../scene';
import { BufferAttribute, BufferGeometry, Color, Vector4, type MeshStandardMaterial, type Group, type ShaderMaterial } from 'three';
import { BRAND, glslColor } from './brand';
import { facetShading } from './facet';
import { HAIRLINE, edgeTint, glowPulse } from './glow';

/**
 * The AI agent end of a stream, built in the SourceBox kit: hard-cornered
 * planar solids, Coal body, Pitch recesses, Clay controls, Stone hairline
 * edges on every part, and a Chalk-on-Pitch e-ink screen the river flies into.
 */
export type AgentState = 'idle' | 'calm' | 'fed' | 'stressed';
/** Coal body with Clay controls, or Limestone body with Ash controls. */
export type KitTone = 'coal' | 'limestone';
export const KIT_TONES: Record<KitTone, {
  body: string;
  control: string;
}> = {
  coal: {
    body: BRAND.coal,
    control: BRAND.clay
  },
  limestone: {
    body: BRAND.limestone,
    control: BRAND.ash
  }
};
export const AGENT_TERMINAL_SCALE = 1.9;
/** Turned so the screen meets the river arriving from -x, tilted to camera. */
const AGENT_TERMINAL_ROTATION_Y = -Math.PI / 2 + 0.55;
/** Overheat colour the body and controls lerp toward under pressure. */
const HOT = new Color('#c9331a');

// Local-space layout. Body is centred on the origin; the front face is +z.
const BODY = {
  width: 1,
  height: 1.35,
  depth: 0.28
} as const;
const FRONT = BODY.depth / 2;
const SCREEN_INSET = 0.04;
const SCREEN_LIFT = 0.01;
const CONTROL_DEPTH = 0.03;
/**
 * Front-face layouts. `standard` is the original; `tall` grows the screen and
 * lowers it so the mouth sits on the body's centre line (y = 0).
 */
export type AgentLayout = 'standard' | 'tall';
const LAYOUTS = {
  standard: {
    screen: {
      width: 0.8,
      height: 0.63,
      y: 0.24
    },
    dpad: {
      x: -0.28,
      y: -0.36,
      length: 0.28,
      width: 0.09
    },
    buttons: [{
      x: 0.16,
      y: -0.3
    }, {
      x: 0.34,
      y: -0.22
    }]
  },
  tall: {
    screen: {
      width: 0.84,
      height: 0.8,
      y: 0.12
    },
    dpad: {
      x: -0.28,
      y: -0.47,
      length: 0.28,
      width: 0.09
    },
    buttons: [{
      x: 0.16,
      y: -0.5
    }, {
      x: 0.34,
      y: -0.42
    }]
  }
} as const;
const SCREEN = LAYOUTS.standard.screen;
const BUTTON_SIZE = 0.13;

/** Mouth centre in the e-ink shader's point space (vUv - 0.5, y up). */
const MOUTH_POINT_Y = -0.15;

/** World position of the mouth on the screen: the point streams fly into. */
export function agentIntake({
  x,
  y,
  z = 0,
  scale = AGENT_TERMINAL_SCALE,
  layout = 'standard'
}: {
  x: number;
  y: number;
  z?: number;
  scale?: number;
  layout?: AgentLayout;
}): [number, number, number] {
  const screen = LAYOUTS[layout].screen;
  const localZ = FRONT - SCREEN_INSET + SCREEN_LIFT;
  const localY = screen.y + MOUTH_POINT_Y * screen.height;
  return [x + localZ * Math.sin(AGENT_TERMINAL_ROTATION_Y) * scale, y + localY * scale, z + localZ * Math.cos(AGENT_TERMINAL_ROTATION_Y) * scale];
}

/**
 * The body slab with the screen aperture cut out of its front face. Built as
 * exactly-tiling quads so `EdgesGeometry` outlines only the silhouette and
 * the aperture, never the seams between coplanar tiles.
 */
function createBodyGeometry(layout: AgentLayout) {
  const screen = LAYOUTS[layout].screen;
  const w = BODY.width / 2;
  const h = BODY.height / 2;
  const d = BODY.depth / 2;
  const ax = screen.width / 2;
  const top = screen.y + screen.height / 2;
  const bottom = screen.y - screen.height / 2;
  const positions: number[] = [];
  // Four corners, counter-clockwise as seen from outside.
  const quad = (a: readonly [number, number, number], b: readonly [number, number, number], c: readonly [number, number, number], e: readonly [number, number, number]) => positions.push(...a, ...b, ...c, ...a, ...c, ...e);
  const front = (x0: number, y0: number, x1: number, y1: number) => quad([x0, y0, d], [x1, y0, d], [x1, y1, d], [x0, y1, d]);
  quad([w, -h, -d], [-w, -h, -d], [-w, h, -d], [w, h, -d]); // back
  quad([-w, -h, -d], [-w, -h, d], [-w, h, d], [-w, h, -d]); // left
  quad([w, -h, d], [w, -h, -d], [w, h, -d], [w, h, d]); // right
  quad([-w, h, d], [w, h, d], [w, h, -d], [-w, h, -d]); // top
  quad([-w, -h, -d], [w, -h, -d], [w, -h, d], [-w, -h, d]); // bottom
  // Front frame: 3 × 3 tiles minus the centre aperture.
  front(-w, top, -ax, h);
  front(-ax, top, ax, h);
  front(ax, top, w, h);
  front(-w, bottom, -ax, top);
  front(ax, bottom, w, top);
  front(-w, -h, -ax, bottom);
  front(-ax, -h, ax, bottom);
  front(ax, -h, w, bottom);
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
  geometry.computeVertexNormals();
  return geometry;
}
export const eInkVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
/**
 * One parametric e-ink face. Expressions are parameter sets (see FACES) and the
 * terminal eases between them, so a change reads as the features moving —
 * eyes opening, the mouth bending — never two drawings cross-fading.
 */
export const eInkFragmentShader = (aspect = SCREEN.width / SCREEN.height) => `
  // Eye: one bent lens (half width, half height, bend [+ up ^, − down], hollow 0–1)
  uniform vec4 uEye;
  // Mouth: one bent lens (half width, half height, bend [+ frown, − smile], centre y)
  uniform vec4 uMouth;
  uniform float uStressed;
  uniform float uPanic;
  uniform float uRefresh;
  uniform float uHeat;
  uniform float uTime;
  // With Deasy: the ink emits Sage above 1.0 so the bloom pass spills green
  // around a Chalk core, the same recipe as the Deasy symbol.
  uniform float uFedGlow;

  varying vec2 vUv;

  const vec3 PITCH = ${glslColor(BRAND.pitch)};
  // Slightly under Chalk so the resting face stays below the bloom threshold;
  // panic/heat pushes the panel above it on purpose.
  const vec3 CHALK = ${glslColor(BRAND.chalk)} * 0.9;
  const float ASPECT = ${aspect.toFixed(4)};
  const float EYE_X = 0.25;
  const float EYE_Y = 0.09;

  float hash(vec2 point) {
    return fract(sin(dot(point, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float sdSegment(vec2 point, vec2 start, vec2 end) {
    vec2 toPoint = point - start;
    vec2 segment = end - start;
    float along = clamp(dot(toPoint, segment) / dot(segment, segment), 0.0, 1.0);
    return length(toPoint - segment * along);
  }

  float inkLine(float distanceToLine, float width) {
    return 1.0 - smoothstep(width, width + 0.014, distanceToLine);
  }

  // One lens shape bent along x: a thin one is a stroke, a round one a dot,
  // a hollow one a ring. Every expression is this shape with other numbers.
  float lens(vec2 local, float halfW, float halfH, float bend, float hollow) {
    float x = clamp(local.x, -halfW, halfW);
    float lift = bend * (1.0 - (x * x) / (halfW * halfW));
    vec2 q = vec2(local.x, local.y - lift) / vec2(halfW, max(halfH, 0.011));
    float r = length(q);
    float outer = 1.0 - smoothstep(0.9, 1.0, r);
    float inner = 1.0 - smoothstep(hollow * 0.9, hollow, r);
    return outer - inner * step(0.01, hollow);
  }

  float eye(vec2 point, vec2 centre) {
    return lens(point - centre, uEye.x, uEye.y, uEye.z, uEye.w);
  }

  float mouth(vec2 point) {
    return lens(point - vec2(0.0, uMouth.w), uMouth.x, uMouth.y, uMouth.z, 0.0);
  }

  void main() {
    float tick = floor(uTime * 14.0);
    float panicTick = floor(uTime * 30.0);
    vec2 jitter =
      (vec2(hash(vec2(tick, 1.0)), hash(vec2(tick, 7.0))) - 0.5) * 0.05 * uStressed +
      (vec2(hash(vec2(panicTick, 3.0)), hash(vec2(panicTick, 9.0))) - 0.5) * 0.12 * uPanic;
    vec2 point = (vUv - 0.5) * vec2(ASPECT, 1.0) + jitter;

    float face = max(eye(point, vec2(-EYE_X, EYE_Y)), eye(point, vec2(EYE_X, EYE_Y)));
    face = max(face, mouth(point));

    vec2 cell = floor(vUv * vec2(76.0, 60.0));
    float snow = step(1.0 - 0.13 * uStressed - 0.08 * uPanic - 0.45 * uRefresh, hash(cell + tick * 0.37));
    float tear =
      step(0.965 - 0.08 * uPanic, hash(vec2(floor(vUv.y * 24.0), tick))) * (0.55 * uStressed + 0.45 * uPanic);

    float ink = clamp(face + snow + tear, 0.0, 1.0);
    float flash = 0.5 + 0.5 * sin(uTime * 18.0);
    // The panel heats with pressure, then strobes at panic.
    float heat = max(uHeat * 0.8, uPanic);
    vec3 panel = mix(PITCH, vec3(0.62, 0.08, 0.05) * (0.8 + 0.4 * flash * uPanic + 0.2 * (1.0 - uPanic)), heat);
    gl_FragColor = vec4(mix(panel, CHALK, ink) + ${glslColor(BRAND.sage)} * ink * uFedGlow * 3.0, 1.0);
    #include <colorspace_fragment>
  }
`;
type FaceParams = {
  eye: [number, number, number, number];
  mouth: [number, number, number, number];
};
/** Expression parameter sets; see the shader uniform comments for each slot. */
const FACES: Record<AgentState | 'panic', FaceParams> = {
  idle: {
    eye: [0.05, 0.05, 0, 0],
    mouth: [0.13, 0, 0, -0.17]
  },
  calm: {
    eye: [0.12, 0, -0.08, 0],
    mouth: [0.17, 0, -0.07, -0.13]
  },
  fed: {
    eye: [0.12, 0, 0.11, 0],
    mouth: [0.3, 0.16, 0, -0.16]
  },
  stressed: {
    eye: [0.055, 0.055, 0, 0],
    mouth: [0.22, 0, 0.09, -0.22]
  },
  panic: {
    eye: [0.11, 0.11, 0, 0.62],
    mouth: [0.2, 0.19, 0, -0.2]
  }
};
const ControlEdges = defineComponent({
  name: "ControlEdges",
  props: {
    edgeRef: {
      type: null as unknown as PropType<(ref: EdgesRef | null) => void>,
      required: true
    }
  },
  setup(props, {
    slots
  }) {
    const edgeRef = computed(() => props.edgeRef);
    return () => <Edges ref={(instance: unknown) => edgeRef.value(instance as EdgesRef | null)} color={BRAND.stone} lineWidth={HAIRLINE} opacity={0.6} transparent toneMapped={false} />;
  }
});
export const AgentTerminal = defineComponent({
  name: "AgentTerminal",
  props: {
    state: {
      type: null as unknown as PropType<AgentState>,
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
    layout: {
      type: null as unknown as PropType<AgentLayout>,
      required: false
    },
    pressure: {
      type: null as unknown as PropType<{
        value: number;
      }>,
      required: false
    },
    reduceMotion: {
      type: null as unknown as PropType<boolean>,
      required: false
    },
    positive: {
      type: null as unknown as PropType<boolean>,
      required: false
    }
  },
  setup(props, {
    slots
  }) {
    const state = computed(() => props.state);
    const x = computed(() => props.x);
    const y = computed(() => props.y);
    const z = computed(() => props.z ?? 0);
    const scale = computed(() => props.scale ?? AGENT_TERMINAL_SCALE);
    const tone = computed(() => props.tone ?? 'coal');
    const layout = computed(() => props.layout ?? 'standard');
    const pressure = computed(() => props.pressure);
    const reduceMotion = computed(() => props.reduceMotion ?? false);
    const positive = computed(() => props.positive ?? false);
    const body = shallowRef<Group>(null);
    const smoothedPressure = shallowRef(pressure.value?.value ?? 0);
    const colors = computed(() => KIT_TONES[tone.value]);
    const _derived0 = computed(() => LAYOUTS[layout.value]),
      screen = computed(() => _derived0.value.screen),
      dpad = computed(() => _derived0.value.dpad),
      buttons = computed(() => _derived0.value.buttons);
    const bodyGeometry = computed(() => createBodyGeometry(layout.value));
    watchAfterMount(() => () => bodyGeometry.value.dispose(), () => [bodyGeometry.value]);
    const screenMaterial = shallowRef<ShaderMaterial>(null);
    const bodyMaterial = shallowRef<MeshStandardMaterial>(null);
    const controlMaterials = shallowRef<(MeshStandardMaterial | null)[]>([null, null, null, null]);
    const edgeRefs = shallowRef<(EdgesRef | null)[]>([]);
    const fedLevel = shallowRef(0);
    const bodyColor = (() => new Color(BRAND.ash))();
    const controlColor = (() => new Color(BRAND.coal))();
    // Face is a state machine over parameter sets: a change eases the features
    // (eyes, mouth, brows) from one expression into the next.
    const face = shallowRef<AgentState | 'panic'>(state.value);
    const screenUniforms = shallowRef((() => ({
      uEye: {
        value: new Vector4(...FACES[state.value].eye)
      },
      uMouth: {
        value: new Vector4(...FACES[state.value].mouth)
      },
      uStressed: {
        value: Number(state.value === 'stressed')
      },
      uPanic: {
        value: 0
      },
      uRefresh: {
        value: 0
      },
      uHeat: {
        value: 0
      },
      uTime: {
        value: 0
      },
      uFedGlow: {
        value: 0
      }
    }))());
    const goal = (() => ({
      eye: new Vector4(),
      mouth: new Vector4()
    }))();
    useSceneFrame(({
      clock
    }, delta) => {
      const material = screenMaterial.value;
      if (material) {
        const {
          uEye,
          uMouth,
          uStressed,
          uPanic,
          uRefresh,
          uHeat,
          uTime,
          uFedGlow
        } = material.uniforms;
        uTime.value = clock.elapsedTime;
        fedLevel.value += (Number(positive.value && state.value === 'fed') - fedLevel.value) * Math.min(1, delta * 5);
        uFedGlow.value = fedLevel.value * glowPulse(clock.elapsedTime, reduceMotion.value);
        // Panic is the last state before the flip; it latches until the state changes.
        const panicking = state.value === 'stressed' && (face.value === 'panic' || smoothedPressure.value > 0.62);
        const next: AgentState | 'panic' = panicking ? 'panic' : state.value;
        face.value = next;
        const params = FACES[next];
        goal.eye.set(...params.eye);
        goal.mouth.set(...params.mouth);
        // Fed chews: the mouth opens and closes while pages land.
        if (next === 'fed') goal.mouth.y = 0.06 + 0.12 * (0.55 + 0.45 * Math.sin(clock.elapsedTime * 7));
        if (next === 'panic') goal.mouth.y = 0.19 * (0.85 + 0.15 * Math.sin(clock.elapsedTime * 26));
        const ease = reduceMotion.value ? 1 : 1 - Math.exp(-Math.min(delta, 0.1) * 11);
        uEye.value.lerp(goal.eye, ease);
        uMouth.value.lerp(goal.mouth, ease);
        // Panel effects (static, tears, red) follow the same easing.
        uStressed.value += (Number(next === 'stressed') - uStressed.value) * ease;
        uPanic.value += (Number(next === 'panic') - uPanic.value) * ease;
        uRefresh.value = 0;
        uHeat.value = state.value === 'stressed' ? Math.pow(smoothedPressure.value, 1.5) : 0;
      }
      // Overheat: the whole body and its controls go red hot with pressure.
      const heat = state.value === 'stressed' ? Math.pow(smoothedPressure.value, 1.2) : 0;
      const glow = reduceMotion.value ? 1 : 0.9 + 0.1 * Math.sin(clock.elapsedTime * 9);
      for (const material of [bodyMaterial.value, ...controlMaterials.value] as const) {
        if (!material) continue;
        // Facet shading no longer dims the diffuse, so cap the tint; the emissive carries the overheat.
        if (material === bodyMaterial.value) {
          material.color.copy(bodyColor).lerp(HOT, heat * 0.65);
        } else {
          material.color.copy(controlColor).lerp(HOT, heat * 0.65);
        }
        material.emissive.copy(HOT);
        material.emissiveIntensity = heat * heat * 1.3 * glow;
      }
      // Outlines sit 10% above whatever their object currently is.
      const bodyEdge = bodyMaterial.value?.color;
      if (bodyEdge) for (const edge of [edgeRefs.value[0], edgeRefs.value[1]]) if (edge) edgeTint(bodyEdge, edge.material.color);
      controlMaterials.value.forEach((material, index) => {
        const edge = edgeRefs.value[2 + index];
        if (material && edge) edgeTint(material.color, edge.material.color);
      });
      const target = body.value;
      if (!target) return;
      const damping = reduceMotion.value ? 1 : 1 - Math.exp(-Math.min(delta, 0.1) * 7);
      const wanted = Math.max(0, Math.min(1, pressure.value?.value ?? 0));
      smoothedPressure.value += (wanted - smoothedPressure.value) * damping;
      const stress = smoothedPressure.value;
      const time = clock.elapsedTime;
      const shake = reduceMotion.value ? 0 : stress * stress * 0.03;
      target.scale.set(1 + stress * 0.26, 1 + stress * 0.14, 1 + stress * 0.3);
      target.position.x = Math.sin(time * 29) * shake;
      target.rotation.z = Math.sin(time * 23) * shake * 0.65;
    });
    const controlZ = FRONT + CONTROL_DEPTH / 2;
    return () => <Three.Group dispose={null} position={[x.value, y.value, z.value]} rotation={[0, AGENT_TERMINAL_ROTATION_Y, 0]} scale={scale.value}>
      <Three.Group ref={body}>
        <Three.Mesh geometry={bodyGeometry.value}>
          <StandardMaterial ref={bodyMaterial} color={colors.value.body} onBeforeCompile={facetShading} roughness={0.7} />
          <Edges ref={(r: unknown) => {
            edgeRefs.value[0] = r as EdgesRef | null;
          }} color={BRAND.stone} lineWidth={HAIRLINE} threshold={15} toneMapped={false} />
        </Three.Mesh>

        {/* Flat screen surround; the old inside-out box created a harsh black bevel. */}
        <Three.Mesh position={[0, screen.value.y, FRONT - SCREEN_INSET - 0.01]}>
          <Three.PlaneGeometry args={[screen.value.width + 0.08, screen.value.height + 0.08]} />
          <Three.MeshBasicMaterial color={BRAND.pitch} />
        </Three.Mesh>
        <Three.Mesh position={[0, screen.value.y, FRONT - SCREEN_INSET + SCREEN_LIFT]}>
          <Three.PlaneGeometry args={[screen.value.width, screen.value.height]} />
          <Three.ShaderMaterial ref={screenMaterial} fragmentShader={eInkFragmentShader(screen.value.width / screen.value.height)} uniforms={screenUniforms.value} vertexShader={eInkVertexShader} />
        </Three.Mesh>

        {/* D-pad: two crossed bars. */}
        <Three.Mesh position={[dpad.value.x, dpad.value.y, controlZ]}>
          <Three.BoxGeometry args={[dpad.value.length, dpad.value.width, CONTROL_DEPTH]} />
          <StandardMaterial ref={(m: unknown) => {
            controlMaterials.value[0] = m as MeshStandardMaterial | null;
          }} color={colors.value.control} onBeforeCompile={facetShading} roughness={0.7} />
          <ControlEdges edgeRef={r => {
            edgeRefs.value[2] = r;
          }} />
        </Three.Mesh>
        <Three.Mesh position={[dpad.value.x, dpad.value.y, controlZ]}>
          <Three.BoxGeometry args={[dpad.value.width, dpad.value.length, CONTROL_DEPTH]} />
          <StandardMaterial ref={(m: unknown) => {
            controlMaterials.value[1] = m as MeshStandardMaterial | null;
          }} color={colors.value.control} onBeforeCompile={facetShading} roughness={0.7} />
          <ControlEdges edgeRef={r => {
            edgeRefs.value[3] = r;
          }} />
        </Three.Mesh>

        {buttons.value.map((button, index) => <Three.Mesh key={button.x} position={[button.x, button.y, controlZ]}>
            <Three.BoxGeometry args={[BUTTON_SIZE, BUTTON_SIZE, CONTROL_DEPTH]} />
            <StandardMaterial ref={(m: unknown) => {
            controlMaterials.value[2 + index] = m as MeshStandardMaterial | null;
          }} color={colors.value.control} onBeforeCompile={facetShading} roughness={0.7} />
            <ControlEdges edgeRef={r => {
            edgeRefs.value[4 + index] = r;
          }} />
          </Three.Mesh>)}
      </Three.Group>
    </Three.Group>;
  }
});
