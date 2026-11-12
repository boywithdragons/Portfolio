"use client";

import { Maximize2, MousePointer2, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface RippleDissolveCardProps {
  imageSrc: string;
  caption: string;
  linkUrl?: string;
  className?: string;
  badge?: string;
}

const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_image;
uniform vec2 u_resolution;
uniform vec2 u_imageSize;
uniform float u_time;
uniform float u_dissolve;
uniform vec4 u_ripples[8];

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p *= 2.03;
    amplitude *= 0.5;
  }
  return value;
}

vec2 coverUv(vec2 uv) {
  float screenAspect = u_resolution.x / max(u_resolution.y, 1.0);
  float imageAspect = u_imageSize.x / max(u_imageSize.y, 1.0);
  vec2 scale = screenAspect > imageAspect
    ? vec2(1.0, imageAspect / screenAspect)
    : vec2(screenAspect / imageAspect, 1.0);
  return (uv - 0.5) / scale + 0.5;
}

void main() {
  vec2 uv = coverUv(v_uv);
  float dissolve = clamp(u_dissolve, 0.0, 1.0);
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);

  vec2 offset = vec2(0.0);
  for (int i = 0; i < 8; i++) {
    vec4 ripple = u_ripples[i];
    if (ripple.w <= 0.0) continue;
    float age = u_time - ripple.z;
    if (age < 0.0 || age > 1.9) continue;

    vec2 diff = uv - ripple.xy;
    diff.x *= aspect;
    float dist = length(diff);
    float front = age * 0.72;
    float wave = sin((dist - front) * 42.0) * exp(-dist * 6.0) * exp(-age * 2.2);
    offset += normalize(diff + vec2(0.0001)) * wave * ripple.w * 0.008;
  }

  vec2 p = uv + offset;

  float n1 = fbm(p * 5.0 + vec2(u_time * 0.05, -u_time * 0.04));
  float n2 = fbm(p * 12.0 - vec2(u_time * 0.03, u_time * 0.02));
  float warp = dissolve * dissolve;

  p += (vec2(n1, n2) - 0.5) * 0.17 * warp;
  p += normalize(vec2(n2 - 0.5, n1 - 0.5) + 0.001) * warp * 0.018;

  float pixelSize = mix(1.0, 105.0, pow(dissolve, 1.8));
  vec2 pixel = vec2(pixelSize) / u_resolution;
  vec2 sampleUv = mix(p, (floor(p / pixel) + 0.5) * pixel, dissolve * 0.86);
  sampleUv = clamp(sampleUv, 0.002, 0.998);

  float chromatic = (0.002 + 0.010 * dissolve) * (0.35 + dissolve);
  vec3 color;
  color.r = texture2D(u_image, sampleUv + vec2(chromatic, 0.0)).r;
  color.g = texture2D(u_image, sampleUv).g;
  color.b = texture2D(u_image, sampleUv - vec2(chromatic, 0.0)).b;

  float luma = dot(color, vec3(0.299, 0.587, 0.114));
  vec3 tint = vec3(0.76, 0.62, 1.0);
  color = mix(color, mix(vec3(luma), tint * luma, 0.3), dissolve * 0.38);
  color += (n1 - 0.5) * 0.11 * dissolve;

  float band = step(0.982, hash(vec2(floor(uv.y * 150.0), floor(u_time * 2.5))));
  color = mix(color, color.gbr, band * dissolve * 0.6);

  gl_FragColor = vec4(color, 1.0);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function RippleDissolveCard({
  imageSrc,
  caption,
  linkUrl,
  className = "",
  badge = "Live preview",
}: RippleDissolveCardProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const captionRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const interactive = Boolean(linkUrl);

  useEffect(() => {
    if (!interactive) return;
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      premultipliedAlpha: false,
      powerPreference: "low-power",
    });

    if (!gl) return;

    let disposed = false;
    let raf = 0;
    let readyTexture = false;
    let dissolve = 0;
    let dissolveTarget = 0;
    let lastSpawn = 0;
    let lingerTimer = 0;
    let lastFrame = performance.now();
    let canvasWidth = 1;
    let canvasHeight = 1;

    const ripples: Array<{ x: number; y: number; start: number; strength: number }> = [];
    const rippleData = new Float32Array(32);

    const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertex || !fragment) {
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      return;
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      return;
    }

    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    const uniforms = {
      image: gl.getUniformLocation(program, "u_image"),
      resolution: gl.getUniformLocation(program, "u_resolution"),
      imageSize: gl.getUniformLocation(program, "u_imageSize"),
      time: gl.getUniformLocation(program, "u_time"),
      dissolve: gl.getUniformLocation(program, "u_dissolve"),
      ripples: gl.getUniformLocation(program, "u_ripples[0]"),
    };

    gl.uniform1i(uniforms.image, 0);

    const image = new Image();
    image.decoding = "async";
    image.src = imageSrc;

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvasWidth = Math.max(rect.width, 1);
      canvasHeight = Math.max(rect.height, 1);
      const nextWidth = Math.max(1, Math.round(canvasWidth * dpr));
      const nextHeight = Math.max(1, Math.round(canvasHeight * dpr));
      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth;
        canvas.height = nextHeight;
      }
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(wrapper);
    resize();

    image.onload = () => {
      if (disposed) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      resize();
      gl.uniform2f(uniforms.imageSize, image.naturalWidth || 16, image.naturalHeight || 9);
      readyTexture = true;
      setReady(true);
    };

    const render = (now: number) => {
      if (disposed) return;
      raf = window.requestAnimationFrame(render);
      if (!readyTexture) return;

      const dt = Math.min((now - lastFrame) / 1000, 0.05);
      lastFrame = now;

      const easing = dissolveTarget > dissolve ? 4.2 : 6.5;
      dissolve += (dissolveTarget - dissolve) * Math.min(dt * easing, 1);
      if (Math.abs(dissolveTarget - dissolve) < 0.001) dissolve = dissolveTarget;

      const caption = captionRef.current;
      if (caption) {
        const eased = dissolve * dissolve;
        caption.style.opacity = String(1 - eased * 0.88);
        caption.style.filter = `blur(${(eased * 5.5).toFixed(2)}px) saturate(${(1 - eased * 0.35).toFixed(2)})`;
        caption.style.transform = `translate3d(0, ${(eased * 9).toFixed(2)}px, 0) scale(${(1 - eased * 0.025).toFixed(3)}) skewY(${(eased * 1.8).toFixed(2)}deg)`;
      }

      const time = now / 1000;
      rippleData.fill(0);
      let slot = 0;
      for (const ripple of ripples) {
        const age = time - ripple.start;
        if (age < 0 || age > 1.9) continue;
        if (slot >= 8) break;
        rippleData[slot * 4] = ripple.x;
        rippleData[slot * 4 + 1] = ripple.y;
        rippleData[slot * 4 + 2] = ripple.start;
        rippleData[slot * 4 + 3] = ripple.strength;
        slot += 1;
      }

      gl.useProgram(program);
      gl.uniform1f(uniforms.time, time);
      gl.uniform1f(uniforms.dissolve, dissolve);
      gl.uniform2f(uniforms.resolution, canvasWidth, canvasHeight);
      gl.uniform4fv(uniforms.ripples, rippleData);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = wrapper.getBoundingClientRect();
      const x = (event.clientX - rect.left) / Math.max(rect.width, 1);
      const y = 1 - (event.clientY - rect.top) / Math.max(rect.height, 1);
      const now = performance.now() / 1000;

      if (now - lastSpawn > 0.055) {
        ripples.push({ x, y, start: now, strength: 1 });
        if (ripples.length > 8) ripples.shift();
        lastSpawn = now;
      }

      dissolveTarget = 0;
      if (lingerTimer) window.clearTimeout(lingerTimer);
      lingerTimer = window.setTimeout(() => {
        dissolveTarget = 1;
      }, 400);
    };

    const onPointerLeave = () => {
      if (lingerTimer) window.clearTimeout(lingerTimer);
      lingerTimer = 0;
      dissolveTarget = 0;
    };

    wrapper.addEventListener("pointermove", onPointerMove, { passive: true });
    wrapper.addEventListener("pointerleave", onPointerLeave);
    wrapper.addEventListener("pointercancel", onPointerLeave);

    raf = window.requestAnimationFrame(render);

    return () => {
      disposed = true;
      if (raf) window.cancelAnimationFrame(raf);
      if (lingerTimer) window.clearTimeout(lingerTimer);
      observer.disconnect();
      wrapper.removeEventListener("pointermove", onPointerMove);
      wrapper.removeEventListener("pointerleave", onPointerLeave);
      wrapper.removeEventListener("pointercancel", onPointerLeave);
      image.onload = null;
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      const loseContext = gl.getExtension("WEBGL_lose_context");
      loseContext?.loseContext();
    };
  }, [imageSrc, interactive]);

  return (
    <div
      ref={wrapperRef}
      className={`ripple-shell group relative aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-canvas-deep powershell:rounded-[2px] ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt={caption}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <canvas
        ref={canvasRef}
        aria-hidden
        className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[#120f2b]/75 via-[#120f2b]/10 to-transparent"
      />

      <div className="absolute top-3 left-3 z-[2] flex items-center gap-1.5 rounded-full border border-white/20 bg-black/25 px-2.5 py-1 font-mono text-[8.5px] font-semibold tracking-[0.14em] text-white/90 uppercase backdrop-blur-md powershell:rounded-[2px]">
        <Sparkles className="h-3 w-3" aria-hidden />
        {badge}
      </div>

      {interactive ? (
        <div className="absolute top-3 right-3 z-[2] flex items-center gap-1.5 rounded-full border border-white/20 bg-black/25 px-2.5 py-1 font-mono text-[8.5px] tracking-[0.12em] text-white/85 uppercase backdrop-blur-md powershell:rounded-[2px]">
          <MousePointer2 className="h-2.5 w-2.5" aria-hidden />
          Ripple · linger to dissolve
        </div>
      ) : null}

      <div ref={captionRef} className="ripple-caption absolute inset-x-0 bottom-0 z-[2] p-4 sm:p-5">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[9px] tracking-[0.16em] text-white/65 uppercase">{badge}</p>
            <p className="mt-1 truncate text-sm font-semibold text-white sm:text-base">{caption}</p>
          </div>
          {linkUrl ? (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-110 powershell:rounded-[2px]">
              <Maximize2 className="h-3.5 w-3.5" aria-hidden />
            </span>
          ) : null}
        </div>
      </div>

      {linkUrl ? (
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10"
          aria-label={`Open ${caption} in a new tab`}
        >
          <span className="sr-only">Open {caption}</span>
        </a>
      ) : null}
    </div>
  );
}
