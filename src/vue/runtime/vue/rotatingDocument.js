import { defineComponent, h, onBeforeUnmount, onMounted, ref, Transition, watch } from 'vue';
import * as THREE from 'three';
const words = [
    { text: 'duplicates', color: '#95aedd' },
    { text: 'old versions', color: '#8ba68c' },
    { text: 'sensitive files', color: '#d67e43' },
    { text: 'stale docs', color: '#8ba68c' },
];
const documentTextures = [
    '/renders/rotating-document/doc-paper-01.webp',
    '/renders/rotating-document/doc-paper-02.webp',
    '/renders/rotating-document/doc-paper-04.webp',
    '/renders/rotating-document/doc-paper-03.webp',
];
const componentCss = `
.deasy-vue-cube{box-sizing:border-box;min-height:100vh;background:#2f2c25;color:#fbf9f5;font-family:'Rethink Sans',sans-serif;position:relative;overflow:hidden;padding:72px 24px 32px}
.deasy-vue-cube *{box-sizing:border-box}.deasy-vue-cube__topbar{position:absolute;z-index:2;inset:0 0 auto;height:64px;display:flex;align-items:center;padding:0 max(24px,calc((100vw - 1200px)/2));border-bottom:1px solid rgb(255 255 255 / 8%);font-size:14px;letter-spacing:.08em}
.deasy-vue-cube__copy{position:relative;z-index:1;max-width:970px;margin:0 auto 26px;text-align:center}.deasy-vue-cube__copy h1{font:400 clamp(34px,5vw,64px)/1.06 'Gilda Display',serif;letter-spacing:-.025em;margin:0 auto 14px}.deasy-vue-cube__copy p{font-size:15px;line-height:1.55;max-width:650px;margin:0 auto;color:#d9d2c4}
.deasy-vue-cube__rotor{display:inline-block;min-width:5.3em}.deasy-vue-cube__rotor-enter-active,.deasy-vue-cube__rotor-leave-active{transition:transform .38s cubic-bezier(.22,1,.36,1),opacity .38s cubic-bezier(.22,1,.36,1)}.deasy-vue-cube__rotor-enter-from{opacity:0;transform:translateY(12px)}.deasy-vue-cube__rotor-leave-to{opacity:0;transform:translateY(-12px)}.deasy-vue-cube__toggle{position:relative;z-index:1;display:flex;justify-content:center;gap:4px;margin:0 auto 14px;padding:4px;width:max-content;border:1px solid #49463f;border-radius:6px;background:#24221e}.deasy-vue-cube__toggle button{font:500 12px 'Rethink Sans',sans-serif;color:#d9d2c4;background:transparent;border:0;border-radius:4px;padding:8px 13px;cursor:pointer;transition:background .18s ease,color .18s ease}.deasy-vue-cube__toggle button[aria-pressed=true]{background:#49463f;color:#fbf9f5}
.deasy-vue-cube__frame{height:380px;max-width:1440px;margin:auto;position:relative}.deasy-vue-cube__frame canvas{display:block;width:100%;height:100%;outline:0}.deasy-vue-cube__frame:after{content:'';pointer-events:none;position:absolute;inset:0;background:linear-gradient(90deg,#2f2c25 0%,transparent 13%,transparent 87%,#2f2c25 100%)}
@media(max-width:700px){.deasy-vue-cube{padding:54px 14px 24px;min-height:100svh}.deasy-vue-cube__copy{margin-bottom:20px}.deasy-vue-cube__copy p{font-size:13px}.deasy-vue-cube__frame{height:330px}.deasy-vue-cube__frame:after{background:linear-gradient(90deg,#2f2c25,transparent 7%,transparent 93%,#2f2c25)}}
@media(prefers-reduced-motion:reduce){.deasy-vue-cube__rotor-enter-active,.deasy-vue-cube__rotor-leave-active,.deasy-vue-cube__toggle button{transition:none}}
`;
/** Vue-native rendering and interaction for the rotating-document hero. */
export const VueRotatingDocument = defineComponent({
    name: 'VueRotatingDocument',
    props: {
        showTopbar: { type: Boolean, default: false },
        loadFonts: { type: Boolean, default: true },
    },
    setup(props, { attrs }) {
        const host = ref();
        const withDeasy = ref(false);
        const autoCycle = ref(true);
        const wordIndex = ref(0);
        let renderer;
        let observer;
        let raf = 0;
        let timer = 0;
        let visible = true;
        let reduceMotion = false;
        let motionQuery;
        let motionPreferenceListener;
        let scene;
        let camera;
        let papers = [];
        let block;
        let rejectionBoxes;
        let cloud;
        let startedAt = 0;
        let withStartedAt = 0;
        let rotorTimer = 0;
        let resizeObserver;
        const setMode = (next, manual = true) => {
            if (manual)
                autoCycle.value = false;
            withDeasy.value = next;
        };
        const makeMaterial = (color, roughness = 0.82) => new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.02 });
        function buildScene(canvas) {
            scene = new THREE.Scene();
            scene.background = new THREE.Color('#211e1c');
            camera = new THREE.PerspectiveCamera(18, 1, 0.1, 100);
            camera.position.set(0, 0, 26.7);
            renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
            renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
            renderer.setSize(canvas.clientWidth || 1, canvas.clientHeight || 1, false);
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            scene.add(new THREE.HemisphereLight('#f7f3eb', '#24221e', 2.1));
            const key = new THREE.DirectionalLight('#fbf9f5', 3.2);
            key.position.set(-4, 8, 12);
            scene.add(key);
            const sourceNames = ['S3', 'Confluence', 'Databricks', 'SharePoint'];
            const sourceColors = ['#ff9900', '#1868db', '#ff3621', '#038387'];
            sourceNames.forEach((name, i) => {
                const y = 2.4 - i * 1.6;
                const box = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.86, 0.42), makeMaterial('#2f2c25'));
                box.position.set(-6.2, y, 0.2);
                scene?.add(box);
                const mark = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.26, 0.04), makeMaterial(sourceColors[i], 0.45));
                mark.position.set(-6.2, y, 0.44);
                scene?.add(mark);
            });
            cloud = new THREE.Group();
            const loader = new THREE.TextureLoader();
            const paperColors = ['#c9c1b2', '#d6d0c5', '#bcb6a9', '#e2ddd3'];
            for (let i = 0; i < 72; i++) {
                const wide = i % 4 === 1 || i % 4 === 2;
                const paper = new THREE.Mesh(new THREE.BoxGeometry(wide ? 0.58 : 0.38, wide ? 0.4 : 0.62, 0.035), new THREE.MeshStandardMaterial({
                    color: paperColors[i % paperColors.length],
                    map: loader.load(documentTextures[i % documentTextures.length], (texture) => {
                        texture.colorSpace = THREE.SRGBColorSpace;
                        texture.anisotropy = renderer?.capabilities.getMaxAnisotropy() ?? 1;
                    }),
                    roughness: 0.84,
                }));
                const lane = i % 6;
                paper.position.set(-8 + ((i * 17) % 96) / 6, 2.4 - lane * 0.96, (i % 4) * 0.38 - 0.5);
                paper.rotation.z = (i % 7 - 3) * 0.055;
                paper.userData.offset = i / 72;
                cloud.add(paper);
                papers.push(paper);
            }
            scene.add(cloud);
            block = new THREE.Mesh(new THREE.BoxGeometry(1.85, 1.85, 0.8), makeMaterial('#b7500c', 0.78));
            block.position.set(0, 0, 0.3);
            block.visible = false;
            scene.add(block);
            rejectionBoxes = new THREE.Group();
            for (let i = 0; i < 3; i++) {
                const group = new THREE.Group();
                group.position.set((i - 1) * 1.55, -3.05, 0.3);
                const body = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.8, 0.9), makeMaterial('#49463f'));
                const lip = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.11, 0.035), makeMaterial(['#95aedd', '#8ba68c', '#d67e43'][i], 0.45));
                lip.position.set(0, 0.34, 0.47);
                group.add(body, lip);
                rejectionBoxes.add(group);
            }
            rejectionBoxes.visible = false;
            scene.add(rejectionBoxes);
            const terminal = new THREE.Group();
            const shell = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 1.8, 6), makeMaterial('#d9d2c4'));
            shell.rotation.z = Math.PI / 2;
            const face = new THREE.Mesh(new THREE.CircleGeometry(0.74, 32), makeMaterial('#24221e', 0.4));
            face.position.set(0, 0, 0.94);
            terminal.add(shell, face);
            terminal.position.set(6.1, 0, 0.4);
            terminal.scale.setScalar(1.15);
            scene.add(terminal);
            const onResize = () => {
                if (!renderer || !camera || !canvas.clientWidth || !canvas.clientHeight)
                    return;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
            };
            resizeObserver = new ResizeObserver(onResize);
            resizeObserver.observe(canvas);
        }
        function animateScene(now) {
            raf = requestAnimationFrame(animateScene);
            if (!visible || !renderer || !scene || !camera)
                return;
            if (!startedAt)
                startedAt = now;
            const time = (now - startedAt) / 1000;
            const engaged = withDeasy.value && now - withStartedAt > 380;
            if (block)
                block.visible = engaged;
            if (rejectionBoxes)
                rejectionBoxes.visible = engaged;
            if (cloud)
                cloud.visible = true;
            papers.forEach((paper) => {
                const offset = paper.userData.offset;
                const progress = reduceMotion ? offset : (time * (withDeasy.value ? 0.36 : 0.62) + offset) % 1;
                if (!reduceMotion)
                    paper.position.x = -8 + progress * 15;
                paper.position.y += ((2.4 - ((Math.floor(offset * 6) % 6) * 0.96)) - paper.position.y) * 0.025;
                if (engaged && progress > 0.48 && progress < 0.66) {
                    paper.position.y += (0 - paper.position.y) * 0.025;
                    paper.scale.setScalar(Math.max(0.05, 1 - (progress - 0.48) * 4));
                }
                else {
                    paper.scale.setScalar(1);
                }
                paper.rotation.z = reduceMotion ? 0 : Math.sin(time * 2 + offset * 16) * 0.06;
            });
            if (block)
                block.rotation.y = reduceMotion ? 0 : Math.sin(time * 0.4) * 0.05;
            renderer.render(scene, camera);
        }
        function scheduleCycle() {
            window.clearTimeout(timer);
            if (!autoCycle.value || reduceMotion)
                return;
            timer = window.setTimeout(() => { withDeasy.value = !withDeasy.value; }, withDeasy.value ? 7000 : 4000);
        }
        watch([autoCycle, withDeasy], scheduleCycle);
        watch(withDeasy, () => { withStartedAt = performance.now(); });
        onMounted(() => {
            motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            reduceMotion = motionQuery.matches;
            motionPreferenceListener = (event) => {
                reduceMotion = event.matches;
                scheduleCycle();
                if (reduceMotion)
                    wordIndex.value = 0;
            };
            motionQuery.addEventListener('change', motionPreferenceListener);
            if (props.loadFonts && !document.head.querySelector('[data-deasy-vue-fonts]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://fonts.googleapis.com/css2?family=Gilda+Display&family=Rethink+Sans:ital,wght@0,400..800;1,400..800&display=swap';
                link.dataset.deasyVueFonts = '';
                document.head.append(link);
            }
            const canvas = host.value?.querySelector('canvas');
            if (!canvas)
                return;
            buildScene(canvas);
            raf = requestAnimationFrame(animateScene);
            if (!reduceMotion)
                rotorTimer = window.setInterval(() => { wordIndex.value = (wordIndex.value + 1) % words.length; }, 2960);
            scheduleCycle();
            observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
            observer.observe(canvas);
        });
        onBeforeUnmount(() => {
            window.clearTimeout(timer);
            window.clearInterval(rotorTimer);
            cancelAnimationFrame(raf);
            observer?.disconnect();
            if (motionPreferenceListener)
                motionQuery?.removeEventListener('change', motionPreferenceListener);
            resizeObserver?.disconnect();
            renderer?.dispose();
            scene?.traverse((object) => {
                const mesh = object;
                mesh.geometry?.dispose?.();
                if (Array.isArray(mesh.material))
                    mesh.material.forEach((material) => material.dispose());
                else
                    mesh.material?.dispose?.();
            });
        });
        return () => h('main', { ...attrs, class: ['deasy-vue-cube', attrs.class], 'data-mode': withDeasy.value ? 'with' : 'without' }, [
            h('style', componentCss),
            props.showTopbar ? h('header', { class: 'deasy-vue-cube__topbar' }, 'Deasy Labs') : null,
            h('section', { class: 'deasy-vue-cube__copy' }, [
                h('h1', ['Catch ', h(Transition, { name: 'deasy-vue-cube__rotor', mode: 'out-in' }, {
                        default: () => h('span', { key: words[wordIndex.value].text, class: 'deasy-vue-cube__rotor', style: { color: words[wordIndex.value].color } }, words[wordIndex.value].text),
                    }), h('br'), 'before they become context']),
                h('p', 'Good answers start with good sources. Deasy reads across your files and systems, figures out how everything connects, and delivers the right context to your agents at runtime.'),
            ]),
            h('div', { class: 'deasy-vue-cube__toggle', role: 'group', 'aria-label': 'Compare the document stream' }, [
                h('button', { type: 'button', 'aria-pressed': !withDeasy.value, onClick: () => setMode(false) }, 'Without Deasy'),
                h('button', { type: 'button', 'aria-pressed': withDeasy.value, onClick: () => setMode(true) }, 'With Deasy'),
            ]),
            h('div', { class: 'deasy-vue-cube__frame', ref: host }, [h('canvas', { 'aria-label': 'Animated document stream showing the effect of Deasy' })]),
        ]);
    },
});
