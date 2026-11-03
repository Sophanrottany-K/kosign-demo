"use client";

import { useEffect, useRef } from "react";
import type { WebGLRenderer } from "three";
import styles from "./PixelBlast.module.css";
import { pixelBlastFragment } from "./pixelBlastShader";

const SHAPE_CIRCLE = 1;
const MAX_CLICKS = 10;
const TOUCH_TEXTURE_SIZE = 64;
const TOUCH_MAX_AGE = 64;

const LIQUID_FRAGMENT = `uniform sampler2D uTexture; uniform float uStrength; uniform float uTime; uniform float uFreq;
void mainUv(inout vec2 uv){ vec4 tex=texture2D(uTexture,uv); float vx=tex.r*2.0-1.0; float vy=tex.g*2.0-1.0; float intensity=tex.b; float wave=0.5+0.5*sin(uTime*uFreq+intensity*6.2831853); float amt=uStrength*intensity*wave; uv+=vec2(vx,vy)*amt; }`;

type Touch = { x: number; y: number; age: number; force: number; vx: number; vy: number };

/** A small canvas recording pointer movement; the liquid effect samples it to distort the image. */
function createTouchTexture(THREE: typeof import("three"), radiusScale: number) {
  const size = TOUCH_TEXTURE_SIZE;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.Texture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  const trail: Touch[] = [];
  const radius = 0.1 * size * radiusScale;
  const speed = 1 / size;
  let last: { x: number; y: number } | null = null;

  function drawTouch(p: Touch) {
    const pos = { x: p.x * size, y: (1 - p.y) * size };
    const fadeInEnd = TOUCH_MAX_AGE * 0.3;
    let intensity: number;
    if (p.age < fadeInEnd) {
      intensity = Math.sin((p.age / fadeInEnd) * (Math.PI / 2));
    } else {
      const t = 1 - (p.age - fadeInEnd) / (TOUCH_MAX_AGE - fadeInEnd);
      intensity = -t * (t - 2) || 0;
    }
    intensity *= p.force;
    const color = `${((p.vx + 1) / 2) * 255}, ${((p.vy + 1) / 2) * 255}, ${intensity * 255}`;
    const offset = size * 5;
    ctx.shadowOffsetX = offset;
    ctx.shadowOffsetY = offset;
    ctx.shadowBlur = radius;
    ctx.shadowColor = `rgba(${color},${0.22 * intensity})`;
    ctx.beginPath();
    ctx.fillStyle = "rgba(255,0,0,1)";
    ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  return {
    texture,
    addTouch(point: { x: number; y: number }) {
      let force = 0;
      let vx = 0;
      let vy = 0;
      if (last) {
        const dx = point.x - last.x;
        const dy = point.y - last.y;
        if (dx === 0 && dy === 0) return;
        const d2 = dx * dx + dy * dy;
        const d = Math.sqrt(d2);
        vx = dx / (d || 1);
        vy = dy / (d || 1);
        force = Math.min(d2 * 10000, 1);
      }
      last = { x: point.x, y: point.y };
      trail.push({ x: point.x, y: point.y, age: 0, force, vx, vy });
    },
    update() {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, size, size);
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        const step = speed * p.force * (1 - p.age / TOUCH_MAX_AGE);
        p.x += p.vx * step;
        p.y += p.vy * step;
        p.age++;
        if (p.age > TOUCH_MAX_AGE) trail.splice(i, 1);
      }
      for (const p of trail) drawTouch(p);
      texture.needsUpdate = true;
    },
  };
}

/** Dithered, animated dot field behind the closing section. Pointer moves ripple it; clicks send a wave. */
export function PixelBlast() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let frame = 0;
    let started = false;
    let visible = false;
    let resizeObserver: ResizeObserver | null = null;
    let renderer: WebGLRenderer | null = null;
    let removeListeners: (() => void) | null = null;

    async function start(el: HTMLDivElement) {
      let THREE: typeof import("three");
      let PP: typeof import("postprocessing");
      try {
        [THREE, PP] = await Promise.all([import("three"), import("postprocessing")]);
      } catch {
        return;
      }
      if (disposed) return;

      const probe = document.createElement("canvas");
      if (!probe.getContext("webgl2") && !probe.getContext("webgl")) return;

      const canvas = document.createElement("canvas");
      let r: WebGLRenderer;
      try {
        r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
      } catch {
        return;
      }
      renderer = r;
      r.domElement.style.width = "100%";
      r.domElement.style.height = "100%";
      r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      el.appendChild(r.domElement);
      r.setClearAlpha(0);

      const uniforms = {
        uResolution: { value: new THREE.Vector2(0, 0) },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("#939c9e") },
        uClickPos: { value: Array.from({ length: MAX_CLICKS }, () => new THREE.Vector2(-1, -1)) },
        uClickTimes: { value: new Float32Array(MAX_CLICKS) },
        uShapeType: { value: SHAPE_CIRCLE },
        uPixelSize: { value: 6 * r.getPixelRatio() },
        uScale: { value: 2.25 },
        uDensity: { value: 1.2 },
        uPixelJitter: { value: 0.5 },
        uEnableRipples: { value: 1 },
        uRippleSpeed: { value: 0.4 },
        uRippleThickness: { value: 0.12 },
        uRippleIntensity: { value: 1.5 },
        uEdgeFade: { value: 0.25 },
      };

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const material = new THREE.ShaderMaterial({
        vertexShader: "void main(){ gl_Position = vec4(position, 1.0); }",
        fragmentShader: pixelBlastFragment,
        uniforms,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        glslVersion: THREE.GLSL3,
      });
      scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));
      const clock = new THREE.Clock();

      let composer: InstanceType<typeof PP.EffectComposer> | null = null;
      let touch: ReturnType<typeof createTouchTexture> | null = null;
      let liquid: InstanceType<typeof PP.Effect> | null = null;

      function resize() {
        r.setSize(el.clientWidth || 1, el.clientHeight || 1, false);
        uniforms.uResolution.value.set(r.domElement.width, r.domElement.height);
        composer?.setSize(r.domElement.width, r.domElement.height);
        uniforms.uPixelSize.value = 6 * r.getPixelRatio();
      }

      try {
        touch = createTouchTexture(THREE, 1.2);
        composer = new PP.EffectComposer(r);
        composer.addPass(new PP.RenderPass(scene, camera));
        liquid = new PP.Effect("LiquidEffect", LIQUID_FRAGMENT, {
          uniforms: new Map<string, import("three").Uniform>([
            ["uTexture", new THREE.Uniform(touch.texture)],
            ["uStrength", new THREE.Uniform(0.12)],
            ["uTime", new THREE.Uniform(0)],
            ["uFreq", new THREE.Uniform(5)],
          ]),
        });
        const pass = new PP.EffectPass(camera, liquid);
        pass.renderToScreen = true;
        composer.addPass(pass);
      } catch {
        // Fall back to rendering the plain dot field without the liquid distortion.
        composer = null;
        touch = null;
        liquid = null;
      }

      function toCanvasCoords(e: PointerEvent) {
        const rect = r.domElement.getBoundingClientRect();
        const sx = r.domElement.width / rect.width;
        const sy = r.domElement.height / rect.height;
        return {
          fx: (e.clientX - rect.left) * sx,
          fy: (rect.height - (e.clientY - rect.top)) * sy,
          w: r.domElement.width,
          h: r.domElement.height,
        };
      }

      resize();
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(el);

      let clickIndex = 0;
      el.style.pointerEvents = "auto";
      const onPointerDown = (e: PointerEvent) => {
        const c = toCanvasCoords(e);
        uniforms.uClickPos.value[clickIndex].set(c.fx, c.fy);
        uniforms.uClickTimes.value[clickIndex] = uniforms.uTime.value;
        clickIndex = (clickIndex + 1) % MAX_CLICKS;
      };
      const onPointerMove = (e: PointerEvent) => {
        if (!touch) return;
        const c = toCanvasCoords(e);
        touch.addTouch({ x: c.fx / c.w, y: c.fy / c.h });
      };
      r.domElement.addEventListener("pointerdown", onPointerDown, { passive: true });
      r.domElement.addEventListener("pointermove", onPointerMove, { passive: true });
      removeListeners = () => {
        r.domElement.removeEventListener("pointerdown", onPointerDown);
        r.domElement.removeEventListener("pointermove", onPointerMove);
      };

      const timeOffset = Math.random() * 1000;
      const loop = () => {
        frame = requestAnimationFrame(loop);
        if (!visible) return;
        uniforms.uTime.value = timeOffset + 2.5 * clock.getElapsedTime();
        if (liquid) (liquid.uniforms.get("uTime") as import("three").Uniform).value = uniforms.uTime.value;
        if (composer) {
          touch?.update();
          composer.render();
        } else {
          r.render(scene, camera);
        }
      };
      frame = requestAnimationFrame(loop);
    }

    // three.js only loads once the section is close to the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visible = entry.isIntersecting;
          if (entry.isIntersecting && !started) {
            started = true;
            void start(container);
          }
        });
      },
      { rootMargin: "300px" },
    );
    observer.observe(container);

    return () => {
      disposed = true;
      observer.disconnect();
      resizeObserver?.disconnect();
      removeListeners?.();
      if (frame) cancelAnimationFrame(frame);
      if (renderer) {
        renderer.dispose();
        renderer.domElement.remove();
      }
    };
  }, []);

  return <div ref={containerRef} className={styles.blast} aria-hidden="true" />;
}
