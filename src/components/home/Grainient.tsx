"use client";

import React, { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import type { Palette } from "@/lib/palettes";

/* ---------- helpers ---------- */

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
}

const DEFAULT_COLORS: Palette = [
  "#0a0204", "#5c0f12", "#b3201a", "#f0501e", "#ff8a2b", "#ffd166",
];

/* ---------- shaders ---------- */

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2  iResolution;
uniform float iTime;
uniform float uTimeSpeed;
uniform float uColorBalance;
uniform float uWarpStrength;
uniform float uWarpFrequency;
uniform float uWarpSpeed;
uniform float uWarpAmplitude;
uniform float uBlendAngle;
uniform float uBlendSoftness;
uniform float uRotationAmount;
uniform float uNoiseScale;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uGrainAnimated;
uniform float uContrast;
uniform float uGamma;
uniform float uSaturation;
uniform vec2  uCenterOffset;
uniform float uZoom;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
uniform vec3  uColor4;
uniform vec3  uColor5;
uniform vec3  uColor6;
out vec4 fragColor;

#define S(a,b,t) smoothstep(a,b,t)
mat2 Rot(float a){ float s=sin(a),c=cos(a); return mat2(c,-s,s,c); }
vec2 hash(vec2 p){ p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37))); return fract(sin(p)*43758.5453); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p), u=f*f*(3.0-2.0*f);
  return 0.5+0.5*mix(
    mix(dot(-1.0+2.0*hash(i),f),dot(-1.0+2.0*hash(i+vec2(1,0)),f-vec2(1,0)),u.x),
    mix(dot(-1.0+2.0*hash(i+vec2(0,1)),f-vec2(0,1)),dot(-1.0+2.0*hash(i+vec2(1,1)),f-vec2(1,1)),u.x),u.y);
}

// 6-stop colour ramp (t in 0..1)
vec3 ramp6(float t){
  t = clamp(t, 0.0, 1.0) * 5.0;
  if (t < 1.0) return mix(uColor1, uColor2, t);
  if (t < 2.0) return mix(uColor2, uColor3, t - 1.0);
  if (t < 3.0) return mix(uColor3, uColor4, t - 2.0);
  if (t < 4.0) return mix(uColor4, uColor5, t - 3.0);
  return mix(uColor5, uColor6, t - 4.0);
}

void mainImage(out vec4 o, vec2 C){
  float t = iTime * uTimeSpeed;
  vec2 uv = C / iResolution.xy;
  float ratio = iResolution.x / iResolution.y;
  vec2 tuv = uv - 0.5 + uCenterOffset;
  tuv /= max(uZoom, 0.001);

  float degree = noise(vec2(t*0.1, tuv.x*tuv.y) * uNoiseScale);
  tuv.y *= 1.0 / ratio;
  tuv *= Rot(radians((degree-0.5)*uRotationAmount+180.0));
  tuv.y *= ratio;

  float ws = max(uWarpStrength, 0.001);
  float amplitude = uWarpAmplitude / ws;
  float warpTime = t * uWarpSpeed;
  tuv.x += sin(tuv.y * uWarpFrequency + warpTime) / amplitude;
  tuv.y += sin(tuv.x * (uWarpFrequency*1.5) + warpTime) / (amplitude*0.5);

  // diagonal sweep across the canvas, already warped by the distortion above
  mat2 blendRot = Rot(radians(uBlendAngle));
  vec2 r = tuv * blendRot;
  float gt = (r.x + r.y) * 0.62 + 0.5 + uColorBalance;
  // soft secondary wave so the six bands aren't perfectly straight
  gt += (0.06 + uBlendSoftness) * sin((r.x - r.y) * 3.14159 + warpTime * 0.3);
  vec3 col = ramp6(gt);

  vec2 grainUv = uv * max(uGrainScale, 0.001);
  if (uGrainAnimated > 0.5) grainUv += vec2(iTime * 0.05);
  float grain = fract(sin(dot(grainUv, vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - 0.5) * uGrainAmount;

  col = (col - 0.5) * uContrast + 0.5;
  float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(vec3(luma), col, uSaturation);
  col = pow(max(col, 0.0), vec3(1.0 / max(uGamma, 0.001)));

  o = vec4(clamp(col, 0.0, 1.0), 1.0);
}

void main(){ vec4 o=vec4(0.0); mainImage(o, gl_FragCoord.xy); fragColor=o; }
`;

/* ---------- WeakMap to share ctx between effects ---------- */

type GrainientCtx = {
  renderer: Renderer;
  program: Program;
  mesh: Mesh;
};
const ctxMap = new WeakMap<HTMLDivElement, GrainientCtx>();

/* ---------- props ---------- */

export interface GrainientProps {
  className?: string;
  /** Shared ref that the parent writes [centerX, centerY] into — read in the RAF loop, zero re-renders */
  posRef?: React.MutableRefObject<[number, number]>;
  /** Six gradient stops, dark → light */
  colors?: Palette;
  timeSpeed?: number;
  colorBalance?: number;
  warpStrength?: number;
  warpFrequency?: number;
  warpSpeed?: number;
  warpAmplitude?: number;
  blendAngle?: number;
  blendSoftness?: number;
  rotationAmount?: number;
  noiseScale?: number;
  grainAmount?: number;
  grainScale?: number;
  grainAnimated?: boolean;
  contrast?: number;
  gamma?: number;
  saturation?: number;
  zoom?: number;
}

export default function Grainient({
  className = "",
  posRef,
  colors = DEFAULT_COLORS,
  timeSpeed = 0.25,
  colorBalance = 0.0,
  warpStrength = 1.2,
  warpFrequency = 4.5,
  warpSpeed = 1.8,
  warpAmplitude = 55,
  blendAngle = 0,
  blendSoftness = 0.08,
  rotationAmount = 500,
  noiseScale = 2.2,
  grainAmount = 0.09,
  grainScale = 2.0,
  grainAnimated = false,
  contrast = 1.5,
  gamma = 1.0,
  saturation = 1.0,
  zoom = 0.9,
}: GrainientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // lerped mouse center — interpolated inside the RAF loop
  const lerped = useRef<[number, number]>([0, 0]);

  /* Effect 1 — build WebGL context once */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });

    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.cssText = "width:100%;height:100%;display:block;";
    container.appendChild(canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        iTime:           { value: 0 },
        iResolution:     { value: new Float32Array([1, 1]) },
        uTimeSpeed:      { value: 0.25 },
        uColorBalance:   { value: 0.0 },
        uWarpStrength:   { value: 1.0 },
        uWarpFrequency:  { value: 5.0 },
        uWarpSpeed:      { value: 2.0 },
        uWarpAmplitude:  { value: 50.0 },
        uBlendAngle:     { value: 0.0 },
        uBlendSoftness:  { value: 0.05 },
        uRotationAmount: { value: 500.0 },
        uNoiseScale:     { value: 2.0 },
        uGrainAmount:    { value: 0.1 },
        uGrainScale:     { value: 2.0 },
        uGrainAnimated:  { value: 0.0 },
        uContrast:       { value: 1.5 },
        uGamma:          { value: 1.0 },
        uSaturation:     { value: 1.0 },
        uCenterOffset:   { value: new Float32Array([0, 0]) },
        uZoom:           { value: 0.9 },
        uColor1:         { value: new Float32Array([1, 1, 1]) },
        uColor2:         { value: new Float32Array([1, 1, 1]) },
        uColor3:         { value: new Float32Array([1, 1, 1]) },
        uColor4:         { value: new Float32Array([1, 1, 1]) },
        uColor5:         { value: new Float32Array([1, 1, 1]) },
        uColor6:         { value: new Float32Array([1, 1, 1]) },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctxMap.set(container, { renderer, program, mesh });

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(Math.max(1, Math.floor(rect.width)), Math.max(1, Math.floor(rect.height)));
      const res = program.uniforms.iResolution.value as Float32Array;
      res[0] = gl.drawingBufferWidth;
      res[1] = gl.drawingBufferHeight;
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    setSize();

    let raf = 0;
    let visible = true;
    let pageVisible = !document.hidden;
    const t0 = performance.now();

    const loop = (t: number) => {
      program.uniforms.iTime.value = (t - t0) * 0.001;
      // lerp mouse center towards target (reads from posRef without causing React re-renders)
      if (posRef) {
        const [tx, ty] = posRef.current;
        lerped.current[0] += (tx - lerped.current[0]) * 0.06;
        lerped.current[1] += (ty - lerped.current[1]) * 0.06;
        (program.uniforms.uCenterOffset.value as Float32Array).set(lerped.current);
      }
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };
    const tryStart = () => { if (visible && pageVisible && raf === 0) raf = requestAnimationFrame(loop); };
    const tryStop  = () => { if (raf !== 0) { cancelAnimationFrame(raf); raf = 0; } };

    const io = new IntersectionObserver(
      ([e]) => { visible = e.isIntersecting; visible ? tryStart() : tryStop(); },
      { threshold: 0 }
    );
    io.observe(container);

    const onViz = () => { pageVisible = !document.hidden; pageVisible ? tryStart() : tryStop(); };
    document.addEventListener("visibilitychange", onViz);
    tryStart();

    return () => {
      tryStop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onViz);
      ctxMap.delete(container);
      try { container.removeChild(canvas); } catch { /* ignore */ }
    };
  }, []);

  /* Effect 2 — sync props → uniforms (zero GPU cost) */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ctx = ctxMap.get(container);
    if (!ctx) return;
    const u = ctx.program.uniforms;

    u.uTimeSpeed.value      = timeSpeed;
    u.uColorBalance.value   = colorBalance;
    u.uWarpStrength.value   = warpStrength;
    u.uWarpFrequency.value  = warpFrequency;
    u.uWarpSpeed.value      = warpSpeed;
    u.uWarpAmplitude.value  = warpAmplitude;
    u.uBlendAngle.value     = blendAngle;
    u.uBlendSoftness.value  = blendSoftness;
    u.uRotationAmount.value = rotationAmount;
    u.uNoiseScale.value     = noiseScale;
    u.uGrainAmount.value    = grainAmount;
    u.uGrainScale.value     = grainScale;
    u.uGrainAnimated.value  = grainAnimated ? 1.0 : 0.0;
    u.uContrast.value       = contrast;
    u.uGamma.value          = gamma;
    u.uSaturation.value     = saturation;
    u.uZoom.value           = zoom;

    const slots = [u.uColor1, u.uColor2, u.uColor3, u.uColor4, u.uColor5, u.uColor6];
    for (let i = 0; i < 6; i++) {
      (slots[i].value as Float32Array).set(hexToRgb(colors[i] ?? DEFAULT_COLORS[i]));
    }
  }, [
    colors,
    timeSpeed, colorBalance, warpStrength, warpFrequency, warpSpeed,
    warpAmplitude, blendAngle, blendSoftness, rotationAmount, noiseScale,
    grainAmount, grainScale, grainAnimated, contrast, gamma, saturation, zoom,
  ]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "absolute", inset: 0, overflow: "hidden" }}
    />
  );
}
