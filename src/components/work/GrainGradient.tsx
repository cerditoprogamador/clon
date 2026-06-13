"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** 4 hex colors mapped across the warped noise field. */
  colors?: [string, string, string, string];
  /** Animation speed multiplier. */
  speed?: number;
  /** Grain intensity 0–1. */
  grain?: number;
  className?: string;
};

function hexToRGB(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h,
    16
  );
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

const VERT = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// Domain-warped value noise mapped to a 4-stop ramp + film grain.
const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_grain;
uniform vec3 u_c0;
uniform vec3 u_c1;
uniform vec3 u_c2;
uniform vec3 u_c3;

vec2 hash2(vec2 p){
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0));
  float b = dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
  float c = dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
  float d = dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p){
  float v = 0.0;
  float amp = 0.5;
  for(int i = 0; i < 5; i++){
    v += amp * noise(p);
    p *= 2.0;
    amp *= 0.5;
  }
  return v;
}

float grainRand(vec2 co){
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = uv;
  p.x *= u_res.x / u_res.y;

  float t = u_time * 0.06;

  // Two layers of domain warping for organic, slow-moving blobs.
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3 - t)));
  vec2 r = vec2(
    fbm(p + 1.6 * q + vec2(1.7, 9.2) + 0.15 * t),
    fbm(p + 1.6 * q + vec2(8.3, 2.8) - 0.12 * t)
  );
  float f = fbm(p + 2.4 * r);

  // Remap into 0..1 and build the color ramp.
  float n = clamp(0.5 + 0.7 * f, 0.0, 1.0);
  float m = clamp(0.5 + 0.6 * length(r), 0.0, 1.0);

  vec3 col = mix(u_c0, u_c1, smoothstep(0.0, 0.45, n));
  col = mix(col, u_c2, smoothstep(0.35, 0.75, n));
  col = mix(col, u_c3, smoothstep(0.65, 1.0, n));
  // Spatial second tone keeps the field from looking like a single sweep.
  col = mix(col, u_c2, 0.25 * m);

  // Subtle vignette pulls the eye to the warm core.
  float vig = smoothstep(1.25, 0.2, length(uv - 0.5));
  col *= mix(0.82, 1.06, vig);

  // Film grain.
  float g = grainRand(uv * u_res.xy * 0.5 + u_time);
  col += (g - 0.5) * u_grain;

  gl_FragColor = vec4(col, 1.0);
}
`;

export default function GrainGradient({
  colors = ["#070708", "#1f4dff", "#ff5a1e", "#acd2ff"],
  speed = 1,
  grain = 0.09,
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      antialias: false,
      premultipliedAlpha: false,
    });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uGrain = gl.getUniformLocation(prog, "u_grain");
    const cLocs = [0, 1, 2, 3].map((i) =>
      gl.getUniformLocation(prog, `u_c${i}`)
    );
    colors.forEach((c, i) => gl.uniform3fv(cLocs[i], hexToRGB(c)));
    gl.uniform1f(uGrain, grain);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let raf = 0;
    const start = performance.now();
    const render = (now: number) => {
      const t = ((now - start) / 1000) * speed;
      gl.uniform1f(uTime, reduce ? 0 : t);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduce) raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
    // colors/grain/speed are read once on mount; remount to change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
