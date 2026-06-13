"use client";

import { useEffect, useState, useRef, useId } from "react";
import "./GlassSurface.css";

type BlendMode =
  | "normal" | "multiply" | "screen" | "overlay" | "darken" | "lighten"
  | "color-dodge" | "color-burn" | "hard-light" | "soft-light" | "difference"
  | "exclusion" | "hue" | "saturation" | "color" | "luminosity";

interface GlassSurfaceProps {
  children?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  borderWidth?: number;
  brightness?: number;
  opacity?: number;
  blur?: number;
  displace?: number;
  backgroundOpacity?: number;
  saturation?: number;
  distortionScale?: number;
  redOffset?: number;
  greenOffset?: number;
  blueOffset?: number;
  xChannel?: "R" | "G" | "B";
  yChannel?: "R" | "G" | "B";
  mixBlendMode?: BlendMode;
  className?: string;
  style?: React.CSSProperties;
}

export default function GlassSurface({
  children,
  width = 200,
  height = 80,
  borderRadius = 20,
  borderWidth = 0.07,
  brightness = 50,
  opacity = 0.93,
  blur = 11,
  displace = 0,
  backgroundOpacity = 0,
  saturation = 1,
  distortionScale = -180,
  redOffset = 0,
  greenOffset = 10,
  blueOffset = 20,
  xChannel = "R",
  yChannel = "G",
  mixBlendMode = "difference",
  className = "",
  style = {},
}: GlassSurfaceProps) {
  const rawId = useId().replace(/:/g, "-");
  const filterId   = `glass-filter-${rawId}`;
  const redGradId  = `red-grad-${rawId}`;
  const blueGradId = `blue-grad-${rawId}`;

  const [svgSupported, setSvgSupported] = useState(false);

  const containerRef   = useRef<HTMLDivElement>(null);
  const feImageRef     = useRef<SVGFEImageElement>(null);
  const redRef         = useRef<SVGFEDisplacementMapElement>(null);
  const greenRef       = useRef<SVGFEDisplacementMapElement>(null);
  const blueRef        = useRef<SVGFEDisplacementMapElement>(null);
  const gaussianRef    = useRef<SVGFEGaussianBlurElement>(null);

  const generateMap = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    const w = rect?.width  || 400;
    const h = rect?.height || 200;
    const edge = Math.min(w, h) * (borderWidth * 0.5);
    const svg = `
      <svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${w}" height="${h}" fill="black"/>
        <rect x="0" y="0" width="${w}" height="${h}" rx="${borderRadius}" fill="url(#${redGradId})"/>
        <rect x="0" y="0" width="${w}" height="${h}" rx="${borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode:${mixBlendMode}"/>
        <rect x="${edge}" y="${edge}" width="${w - edge * 2}" height="${h - edge * 2}" rx="${borderRadius}"
          fill="hsl(0 0% ${brightness}% / ${opacity})" style="filter:blur(${blur}px)"/>
      </svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  };

  const updateMap = () => {
    feImageRef.current?.setAttribute("href", generateMap());
  };

  // sync props → filter primitives
  useEffect(() => {
    updateMap();
    [
      { ref: redRef,   offset: redOffset },
      { ref: greenRef, offset: greenOffset },
      { ref: blueRef,  offset: blueOffset },
    ].forEach(({ ref, offset }) => {
      ref.current?.setAttribute("scale", String(distortionScale + offset));
      ref.current?.setAttribute("xChannelSelector", xChannel);
      ref.current?.setAttribute("yChannelSelector", yChannel);
    });
    gaussianRef.current?.setAttribute("stdDeviation", String(displace));
  }, [
    width, height, borderRadius, borderWidth, brightness, opacity, blur,
    displace, distortionScale, redOffset, greenOffset, blueOffset,
    xChannel, yChannel, mixBlendMode,
  ]);

  // resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(() => setTimeout(updateMap, 0));
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // width/height prop changes
  useEffect(() => { setTimeout(updateMap, 0); }, [width, height]);

  // feature detection (client-only)
  useEffect(() => {
    const isWebkit  = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);
    if (isWebkit || isFirefox) { setSvgSupported(false); return; }
    const div = document.createElement("div");
    div.style.backdropFilter = `url(#${filterId})`;
    setSvgSupported(div.style.backdropFilter !== "");
  }, []);

  const containerStyle = {
    ...style,
    width:        typeof width  === "number" ? `${width}px`  : width,
    height:       typeof height === "number" ? `${height}px` : height,
    borderRadius: `${borderRadius}px`,
    "--glass-frost":      backgroundOpacity,
    "--glass-saturation": saturation,
    "--filter-id":        `url(#${filterId})`,
  } as React.CSSProperties;

  const variant = svgSupported ? "glass-surface--svg" : "glass-surface--fallback";

  return (
    <div
      ref={containerRef}
      className={`glass-surface ${variant} ${className}`.trim()}
      style={containerStyle}
    >
      <svg className="glass-surface__filter" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
            <feImage ref={feImageRef} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />

            <feDisplacementMap ref={redRef}   in="SourceGraphic" in2="map" result="dispRed"   />
            <feColorMatrix in="dispRed"   type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red"   />

            <feDisplacementMap ref={greenRef} in="SourceGraphic" in2="map" result="dispGreen" />
            <feColorMatrix in="dispGreen" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />

            <feDisplacementMap ref={blueRef}  in="SourceGraphic" in2="map" result="dispBlue"  />
            <feColorMatrix in="dispBlue"  type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue"  />

            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg"  in2="blue"  mode="screen" result="output" />
            <feGaussianBlur ref={gaussianRef} in="output" stdDeviation="0.7" />
          </filter>
        </defs>
      </svg>

      <div className="glass-surface__content">{children}</div>
    </div>
  );
}
