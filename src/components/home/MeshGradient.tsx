"use client";

import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// Weighted color points → smooth mesh gradient, gentle warp, film grain.
const FRAG = `
precision highp float;
uniform vec2  u_res;
uniform float u_time;
uniform float u_grain;

vec2 hash2(vec2 p){
  p = vec2(dot(p, vec2(127.1,311.7)), dot(p, vec2(269.5,183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  float a = dot(hash2(i+vec2(0.0,0.0)), f-vec2(0.0,0.0));
  float b = dot(hash2(i+vec2(1.0,0.0)), f-vec2(1.0,0.0));
  float c = dot(hash2(i+vec2(0.0,1.0)), f-vec2(0.0,1.0));
  float d = dot(hash2(i+vec2(1.0,1.0)), f-vec2(1.0,1.0));
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
float fbm(vec2 p){
  float v=0.0, amp=0.5;
  for(int i=0;i<4;i++){ v+=amp*noise(p); p*=2.0; amp*=0.5; }
  return v;
}
float grainRand(vec2 c){ return fract(sin(dot(c, vec2(12.9898,78.233))) * 43758.5453); }

// gaussian weight
float w(vec2 uv, vec2 p, float s){
  float d = length(uv - p);
  return exp(-d*d / s);
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float t = u_time * 0.04;

  // gentle organic warp so the bands aren't mechanical
  vec2 warp = vec2(fbm(uv*1.6 + t), fbm(uv*1.6 + 4.0 - t)) - 0.5;
  vec2 p = uv + warp * 0.16;

  // ---- mesh color points (positioned to match the reference) ----
  vec3 deepBlue = vec3(0.13, 0.24, 0.55);
  vec3 lightBlue= vec3(0.66, 0.78, 0.90);
  vec3 coolGray = vec3(0.49, 0.55, 0.60);
  vec3 orange   = vec3(0.93, 0.41, 0.13);
  vec3 ember    = vec3(0.70, 0.22, 0.08);
  vec3 black    = vec3(0.03, 0.02, 0.02);

  float wSum = 0.0; vec3 cSum = vec3(0.0);
  #define ADD(POS, COL, S) { float ww = w(p, POS, S); cSum += COL * ww; wSum += ww; }
  ADD(vec2(0.12, 0.88), deepBlue,  0.16)   // top-left blue  (uv y-up)
  ADD(vec2(0.40, 0.66), lightBlue, 0.10)   // light-blue glow
  ADD(vec2(0.90, 0.82), coolGray,  0.14)   // top-right cool
  ADD(vec2(0.30, 0.16), orange,    0.13)   // bottom-left orange
  ADD(vec2(0.58, 0.30), orange,    0.10)   // bright orange core
  ADD(vec2(0.80, 0.10), ember,     0.10)   // lower deep orange
  ADD(vec2(0.96, 0.04), black,     0.10)   // bottom-right black
  vec3 col = cSum / max(wSum, 0.0001);

  // film grain
  float g = grainRand(uv * u_res.xy * 0.5 + u_time);
  col += (g - 0.5) * u_grain;

  gl_FragColor = vec4(col, 1.0);
}
`;

export default function MeshGradient({
  grain = 0.07,
  className,
}: {
  grain?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false });
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
    gl.uniform1f(uGrain, grain);

    // Size the drawing buffer from the PARENT box (the hero). Observing the
    // parent — not the canvas — keeps sizing independent of the backing store,
    // so it fills the hero exactly with no feedback loop.
    const parent = canvas.parentElement ?? canvas;
    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let raf = 0;
    const start = performance.now();
    const render = (now: number) => {
      gl.uniform1f(uTime, reduce ? 0 : (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
