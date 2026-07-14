(function () {
  "use strict";

  const host = document.querySelector("[data-aurora]");
  if (!host) return;

  const canvas = host.querySelector("canvas");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    antialias: false,
    premultipliedAlpha: false,
    powerPreference: "low-power"
  });

  if (!gl) {
    host.classList.add("aurora-fallback");
    return;
  }

  const vertexSource = `#version 300 es
    in vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fragmentSource = `#version 300 es
    precision highp float;

    uniform float uTime;
    uniform vec3 uResolution;
    uniform float uSpeed;
    uniform float uScale;
    uniform float uBrightness;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform float uNoiseFreq;
    uniform float uNoiseAmp;
    uniform float uBandHeight;
    uniform float uBandSpread;
    uniform float uOctaveDecay;
    uniform float uLayerOffset;
    uniform float uColorSpeed;
    uniform vec2 uMouse;
    uniform float uMouseInfluence;
    out vec4 fragColor;

    #define TAU 6.28318

    vec3 gradientHash(vec3 p) {
      p = vec3(
        dot(p, vec3(127.1, 311.7, 234.6)),
        dot(p, vec3(269.5, 183.3, 198.3)),
        dot(p, vec3(169.5, 283.3, 156.9))
      );
      vec3 h = fract(sin(p) * 43758.5453123);
      float phi = acos(2.0 * h.x - 1.0);
      float theta = TAU * h.y;
      return vec3(cos(theta) * sin(phi), sin(theta) * cos(phi), cos(phi));
    }

    float quinticSmooth(float t) {
      float t2 = t * t;
      float t3 = t * t2;
      return 6.0 * t3 * t2 - 15.0 * t2 * t2 + 10.0 * t3;
    }

    vec3 cosineGradient(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
      return a + b * cos(TAU * (c * t + d));
    }

    float perlin3D(float amplitude, float frequency, float px, float py, float pz) {
      float x = px * frequency;
      float y = py * frequency;
      float fx = floor(x); float fy = floor(y); float fz = floor(pz);
      float cx = ceil(x);  float cy = ceil(y);  float cz = ceil(pz);

      vec3 g000 = gradientHash(vec3(fx, fy, fz));
      vec3 g100 = gradientHash(vec3(cx, fy, fz));
      vec3 g010 = gradientHash(vec3(fx, cy, fz));
      vec3 g110 = gradientHash(vec3(cx, cy, fz));
      vec3 g001 = gradientHash(vec3(fx, fy, cz));
      vec3 g101 = gradientHash(vec3(cx, fy, cz));
      vec3 g011 = gradientHash(vec3(fx, cy, cz));
      vec3 g111 = gradientHash(vec3(cx, cy, cz));

      float d000 = dot(g000, vec3(x - fx, y - fy, pz - fz));
      float d100 = dot(g100, vec3(x - cx, y - fy, pz - fz));
      float d010 = dot(g010, vec3(x - fx, y - cy, pz - fz));
      float d110 = dot(g110, vec3(x - cx, y - cy, pz - fz));
      float d001 = dot(g001, vec3(x - fx, y - fy, pz - cz));
      float d101 = dot(g101, vec3(x - cx, y - fy, pz - cz));
      float d011 = dot(g011, vec3(x - fx, y - cy, pz - cz));
      float d111 = dot(g111, vec3(x - cx, y - cy, pz - cz));

      float sx = quinticSmooth(x - fx);
      float sy = quinticSmooth(y - fy);
      float sz = quinticSmooth(pz - fz);
      float lx00 = mix(d000, d100, sx);
      float lx10 = mix(d010, d110, sx);
      float lx01 = mix(d001, d101, sx);
      float lx11 = mix(d011, d111, sx);
      return amplitude * mix(mix(lx00, lx10, sy), mix(lx01, lx11, sy), sz);
    }

    float auroraGlow(float t, vec2 shift) {
      vec2 uv = gl_FragCoord.xy / uResolution.y;
      uv += shift;
      float noiseVal = 0.0;
      float freq = uNoiseFreq;
      float amp = uNoiseAmp;
      vec2 samplePos = uv * uScale;

      for (float i = 0.0; i < 3.0; i += 1.0) {
        noiseVal += perlin3D(amp, freq, samplePos.x, samplePos.y, t);
        amp *= uOctaveDecay;
        freq *= 2.0;
      }

      float yBand = uv.y * 10.0 - uBandHeight * 10.0;
      return 0.3 * max(exp(uBandSpread * (1.0 - 1.1 * abs(noiseVal + yBand))), 0.0);
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution.xy;
      float t = uSpeed * 0.4 * uTime;
      vec2 shift = (uMouse - 0.5) * uMouseInfluence;
      vec3 col = vec3(0.0);
      col += 0.99 * auroraGlow(t, shift) * cosineGradient(
        uv.x + uTime * uSpeed * 0.2 * uColorSpeed,
        vec3(0.5), vec3(0.5), vec3(1.0), vec3(0.3, 0.20, 0.20)
      ) * uColor1;
      col += 0.99 * auroraGlow(t + uLayerOffset, shift) * cosineGradient(
        uv.x + uTime * uSpeed * 0.1 * uColorSpeed,
        vec3(0.5), vec3(0.5), vec3(2.0, 1.0, 0.0), vec3(0.5, 0.20, 0.25)
      ) * uColor2;
      col *= uBrightness;
      float alpha = clamp(length(col), 0.0, 1.0);
      fragColor = vec4(col, alpha);
    }
  `;

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      host.classList.add("aurora-fallback");
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertexShader = compile(gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compile(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertexShader || !fragmentShader) return;

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    host.classList.add("aurora-fallback");
    return;
  }

  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uniforms = {
    time: gl.getUniformLocation(program, "uTime"),
    resolution: gl.getUniformLocation(program, "uResolution"),
    speed: gl.getUniformLocation(program, "uSpeed"),
    scale: gl.getUniformLocation(program, "uScale"),
    brightness: gl.getUniformLocation(program, "uBrightness"),
    color1: gl.getUniformLocation(program, "uColor1"),
    color2: gl.getUniformLocation(program, "uColor2"),
    noiseFrequency: gl.getUniformLocation(program, "uNoiseFreq"),
    noiseAmplitude: gl.getUniformLocation(program, "uNoiseAmp"),
    bandHeight: gl.getUniformLocation(program, "uBandHeight"),
    bandSpread: gl.getUniformLocation(program, "uBandSpread"),
    octaveDecay: gl.getUniformLocation(program, "uOctaveDecay"),
    layerOffset: gl.getUniformLocation(program, "uLayerOffset"),
    colorSpeed: gl.getUniformLocation(program, "uColorSpeed"),
    mouse: gl.getUniformLocation(program, "uMouse"),
    mouseInfluence: gl.getUniformLocation(program, "uMouseInfluence")
  };

  gl.uniform1f(uniforms.speed, 1.1);
  gl.uniform1f(uniforms.scale, 0.7);
  gl.uniform1f(uniforms.brightness, 2.1);
  gl.uniform3f(uniforms.color1, 6 / 255, 182 / 255, 212 / 255);
  gl.uniform3f(uniforms.color2, 244 / 255, 63 / 255, 94 / 255);
  gl.uniform1f(uniforms.noiseFrequency, 2.5);
  gl.uniform1f(uniforms.noiseAmplitude, 2.0);
  gl.uniform1f(uniforms.bandHeight, 0.65);
  gl.uniform1f(uniforms.bandSpread, 0.3);
  gl.uniform1f(uniforms.octaveDecay, 0.23);
  gl.uniform1f(uniforms.layerOffset, 0.25);
  gl.uniform1f(uniforms.colorSpeed, 1.2);
  gl.uniform1f(uniforms.mouseInfluence, reduceMotion ? 0.0 : 0.25);

  let width = 0;
  let height = 0;
  let frame = 0;
  let pausedAt = 0;
  let startedAt = performance.now();
  let currentMouse = [0.5, 0.5];
  let targetMouse = [0.5, 0.5];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.35);
    const nextWidth = Math.max(1, Math.round(host.clientWidth * dpr));
    const nextHeight = Math.max(1, Math.round(host.clientHeight * dpr));
    if (nextWidth === width && nextHeight === height) return;
    width = nextWidth;
    height = nextHeight;
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
    gl.uniform3f(uniforms.resolution, width, height, width / height);
  }

  function updatePointer(event) {
    targetMouse[0] = event.clientX / Math.max(window.innerWidth, 1);
    targetMouse[1] = 1 - event.clientY / Math.max(window.innerHeight, 1);
  }

  function resetPointer() {
    targetMouse = [0.5, 0.5];
  }

  function render(now) {
    resize();
    currentMouse[0] += (targetMouse[0] - currentMouse[0]) * 0.055;
    currentMouse[1] += (targetMouse[1] - currentMouse[1]) * 0.055;
    gl.useProgram(program);
    gl.uniform1f(uniforms.time, reduceMotion ? 0.0 : (now - startedAt) * 0.001);
    gl.uniform2f(uniforms.mouse, currentMouse[0], currentMouse[1]);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!reduceMotion) frame = window.requestAnimationFrame(render);
  }

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pointermove", updatePointer, { passive: true });
  document.documentElement.addEventListener("mouseleave", resetPointer, { passive: true });
  document.addEventListener("visibilitychange", function () {
    if (reduceMotion) return;
    if (document.hidden) {
      pausedAt = performance.now();
      window.cancelAnimationFrame(frame);
    } else {
      startedAt += performance.now() - pausedAt;
      frame = window.requestAnimationFrame(render);
    }
  });

  render(startedAt);
})();
