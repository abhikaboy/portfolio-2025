// @ts-nocheck

// Property metadata is only used in Figma Design, so this is a no-op.
function defineProperties(
  _component: unknown,
  _properties: unknown,
): void {}

export default function Effect() { }
export function setup(device, frame) {
    var WGSL_BLUR = `diagnostic(off,derivative_uniformity);
struct BlurUniforms {
  dirAndRadius: vec4f, // .xy = direction, .z = radius (points), .w = render scale
};
struct BlurWeights {
  values: array<f32, 65>,
  normalization: f32,
};
@group(0) @binding(0) var<uniform> u: BlurUniforms;
@group(0) @binding(1) var samp: sampler;
@group(0) @binding(2) var inputTex: texture_2d<f32>;
@group(0) @binding(3) var<storage, read> weights: BlurWeights;

/// Applies the sRGB EOTF (inverse transfer function) to the given single float.
fn srgbToLinearMono(value: f32) -> f32 {
    var result: f32;
    if (value > 0.04045) {
        result = pow((value + 0.055) / 1.055, 2.4);
    } else {
        result = value / 12.92;
    }
    return result;
}

/// Applies the sRGB EOTF (inverse transfer function) to the given vec3.
fn srgbToLinear(rgb: vec3f) -> vec3f {
    return vec3f(srgbToLinearMono(rgb.r), srgbToLinearMono(rgb.g), srgbToLinearMono(rgb.b));
}

/// Applies the sRGB EOTF (inverse transfer function) to the r, g, and b components of the given vec4.
fn srgbToLinearWithAlpha(rgba: vec4f) -> vec4f {
    return vec4f(srgbToLinear(rgba.rgb), rgba.a);
}

/// Applies the sRGB OETF (transfer function) to the given single float.
fn linearToSrgbMono(value: f32) -> f32 {
    var result: f32;
    if (value > 0.0031308) {
        result = 1.055 * pow(value, 0.41666) - 0.055;
    } else {
        result = value * 12.92;
    }
    return result;
}

/// Applies the sRGB OETF (transfer function) to the given vec3.
fn linearToSrgb(rgb: vec3f) -> vec3f {
    return vec3f(linearToSrgbMono(rgb.r), linearToSrgbMono(rgb.g), linearToSrgbMono(rgb.b));
}

/// Applies the sRGB OETF (transfer function) to the r, g, and b components of the given vec4.
fn linearToSrgbWithAlpha(rgba: vec4f) -> vec4f {
    return vec4f(linearToSrgb(rgba.rgb), rgba.a);
}

struct VsIn {
  @location(0) pos: vec2f,
  @location(1) uv: vec2f,
};
struct VsOut {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
};

@vertex fn vs_main(in: VsIn) -> VsOut {
  var out: VsOut;
  out.position = vec4f(in.pos, 0.0, 1.0);
  out.uv = in.uv;
  return out;
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let dir = u.dirAndRadius.xy;
  let radius = u.dirAndRadius.z;
  let dims = vec2f(textureDimensions(inputTex, 0));
  let texel = vec2f(1.0) / dims;

  var sum = vec4f(0.0);
  for (var i = -32; i <= 32; i = i + 1) {
    let fi = f32(i);
    let w = weights.values[u32(i + 32)];
    let offset = dir * texel * fi * (radius / 32.0) * u.dirAndRadius.w;
    let sampleUv = clamp(uv + offset, vec2f(0.0), vec2f(1.0));
    sum = sum + srgbToLinearWithAlpha(textureSample(inputTex, samp, sampleUv)) * w;
  }
  return linearToSrgbWithAlpha(sum / max(weights.normalization, 0.0001));
}
`;
    var WGSL_HALFTONE = `diagnostic(off,derivative_uniformity);

const HALFTONE_TYPE_DOT: u32 = 0u;
const HALFTONE_TYPE_EUCLIDEAN: u32 = 1u;
const COLOR_MODE_CMYK: u32 = 0u;
const COLOR_MODE_RGB: u32 = 1u;
const COLOR_MODE_BW_LIGHT: u32 = 2u;
const COLOR_MODE_BW_DARK: u32 = 3u;
const TAU: f32 = 6.28318530718;
const INV_PI: f32 = 0.3183098862;

// Uniforms layout (64 bytes):
// [0] dotSize, dotScale, softness, rotation
// [1] centerX, centerY, clipToAlpha, halftoneType
// [2] colorMode, dimW, dimH, unused
// [3] unused x4
struct HalftoneUniforms {
  params0: vec4f,
  params1: vec4f,
  params2: vec4f,
  params3: vec4f,
};
@group(0) @binding(0) var<uniform> u: HalftoneUniforms;
@group(0) @binding(1) var samp: sampler;
@group(0) @binding(2) var inputTex: texture_2d<f32>;
@group(0) @binding(3) var blurredTex: texture_2d<f32>;

struct VsIn {
  @location(0) pos: vec2f,
  @location(1) uv: vec2f,
};
struct VsOut {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
};

@vertex fn vs_main(in: VsIn) -> VsOut {
  var out: VsOut;
  out.position = vec4f(in.pos, 0.0, 1.0);
  out.uv = in.uv;
  return out;
}

fn rot(t: f32) -> mat2x2f {
  let c = cos(t);
  let s = sin(t);
  return mat2x2f(c, -s, s, c);
}

fn localPosToGrid(p: vec2f, theta: f32, center: vec2f, dotSize: f32) -> vec2f {
  var gridPos = p - center;
  gridPos = rot(theta) * gridPos;
  gridPos = gridPos * (1.0 / dotSize);
  return gridPos;
}

fn gridToLocalPos(p: vec2f, theta: f32, center: vec2f, dotSize: f32) -> vec2f {
  var localPos = p * dotSize;
  localPos = rot(-theta) * localPos;
  localPos = localPos + center;
  return localPos;
}

fn rgbToCmyk(rgb: vec3f) -> vec4f {
  let k = 1.0 - max(rgb.r, max(rgb.g, rgb.b));
  if (k >= 1.0) {
    return vec4f(0.0, 0.0, 0.0, 1.0);
  }
  let inv1k = 1.0 / (1.0 - k);
  let c = (1.0 - rgb.r - k) * inv1k;
  let m = (1.0 - rgb.g - k) * inv1k;
  let y = (1.0 - rgb.b - k) * inv1k;
  return vec4f(c, m, y, k);
}

fn cmykToRgb(cmyk: vec4f) -> vec3f {
  let r = (1.0 - cmyk.x) * (1.0 - cmyk.w);
  let g = (1.0 - cmyk.y) * (1.0 - cmyk.w);
  let b = (1.0 - cmyk.z) * (1.0 - cmyk.w);
  return vec3f(r, g, b);
}

fn getHalftoneDotRadiusForLuma(luma: f32) -> f32 {
  if (luma <= 0.0) {
    return 0.0;
  }
  var rad = sqrt(luma * INV_PI);
  if (rad >= 0.5) {
    rad = (1.414 - pow(max(0.001, 1.0 - luma) / 1.673, 1.0 / 2.33)) * 0.5;
  }
  return rad;
}

fn getHalftoneEuclidean(val: f32, localPos: vec2f, theta: f32, center: vec2f, dotSize: f32, softness: f32) -> f32 {
  let gridPos = localPosToGrid(localPos, theta, center, dotSize);
  let grid = 0.5 - 0.25 * (cos(gridPos.x * TAU) + cos(gridPos.y * TAU));
  return smoothstep(val * (1.0 + softness), val * (1.0 - softness) - 0.001, grid);
}

/// Applies the sRGB EOTF (inverse transfer function) to the given single float.
fn srgbToLinearMono(value: f32) -> f32 {
    var result: f32;
    if (value > 0.04045) {
        result = pow((value + 0.055) / 1.055, 2.4);
    } else {
        result = value / 12.92;
    }
    return result;
}

/// Applies the sRGB EOTF (inverse transfer function) to the given vec3.
fn srgbToLinear(rgb: vec3f) -> vec3f {
    return vec3f(srgbToLinearMono(rgb.r), srgbToLinearMono(rgb.g), srgbToLinearMono(rgb.b));
}

/// Applies the sRGB EOTF (inverse transfer function) to the r, g, and b components of the given vec4.
fn srgbToLinearWithAlpha(rgba: vec4f) -> vec4f {
    return vec4f(srgbToLinear(rgba.rgb), rgba.a);
}

// Sample a premultiplied-alpha sRGB texture, returning premultiplied sRGB.
fn tex2DPremultipliedSrgb(tex: texture_2d<f32>, s: sampler, uv: vec2f) -> vec4f {
  return textureSampleLevel(tex, s, uv, 0.0);
}

// Sample a premultiplied-alpha sRGB texture, converting RGB to linear.
// Returns premultiplied linear.
fn tex2DPremultipliedLinear(tex: texture_2d<f32>, s: sampler, uv: vec2f) -> vec4f {
  return srgbToLinearWithAlpha(tex2DPremultipliedSrgb(tex, s, uv));
}

// Sample a premultiplied-alpha sRGB texture, un-premultiplying on read.
// Returns straight-alpha sRGB.
fn tex2DStraightAlphaSrgb(tex: texture_2d<f32>, s: sampler, uv: vec2f) -> vec4f {
  let c = tex2DPremultipliedSrgb(tex, s, uv);
  if (c.a > 0.0001) {
    return vec4f(c.rgb / c.a, c.a);
  }
  return vec4f(0.0);
}

// Sample a premultiplied-alpha sRGB texture, un-premultiplying and converting RGB to linear.
// Returns straight-alpha linear.
fn tex2DStraightAlphaLinear(tex: texture_2d<f32>, s: sampler, uv: vec2f) -> vec4f {
  let c = tex2DPremultipliedSrgb(tex, s, uv);
  if (c.a > 0.0001) {
    return srgbToLinearWithAlpha(vec4f(c.rgb / c.a, c.a));
  }
  return vec4f(0.0);
}

fn getDotRGB(gridPos: vec2f, dotCenter: vec2f, theta: f32, offset: vec2f, center: vec2f, dotSize: f32, dotScale: f32, softness: f32, dims: vec2f) -> vec3f {
  let p = gridToLocalPos(dotCenter + offset, theta, center, dotSize);
  let rgba = tex2DPremultipliedLinear(blurredTex, samp, clamp(p / dims, vec2f(0.0), vec2f(1.0)));
  let rgb = rgba.xyz;
  let rad = vec3f(
    getHalftoneDotRadiusForLuma(rgb.r),
    getHalftoneDotRadiusForLuma(rgb.g),
    getHalftoneDotRadiusForLuma(rgb.b)
  ) * dotScale;
  let d = length(gridPos - (dotCenter + offset));
  let dot0 = smoothstep(rad.x * (1.0 + softness), rad.x * (1.0 - softness) - 0.001, d);
  let dot1 = smoothstep(rad.y * (1.0 + softness), rad.y * (1.0 - softness) - 0.001, d);
  let dot2 = smoothstep(rad.z * (1.0 + softness), rad.z * (1.0 - softness) - 0.001, d);
  return vec3f(dot0, dot1, dot2);
}

fn getHalftoneRGB(localPos: vec2f, theta: f32, center: vec2f, dotSize: f32, dotScale: f32, softness: f32, dims: vec2f) -> vec3f {
  let gridPos = localPosToGrid(localPos, theta, center, dotSize);
  let dotCenters = floor(gridPos + 0.5);
  var d = getDotRGB(gridPos, dotCenters, theta, vec2f(0.0, 0.0), center, dotSize, dotScale, softness, dims);
  d = d + getDotRGB(gridPos, dotCenters, theta, vec2f(1.0, 0.0), center, dotSize, dotScale, softness, dims);
  d = d + getDotRGB(gridPos, dotCenters, theta, vec2f(-1.0, 0.0), center, dotSize, dotScale, softness, dims);
  d = d + getDotRGB(gridPos, dotCenters, theta, vec2f(0.0, 1.0), center, dotSize, dotScale, softness, dims);
  d = d + getDotRGB(gridPos, dotCenters, theta, vec2f(0.0, -1.0), center, dotSize, dotScale, softness, dims);
  d = d + getDotRGB(gridPos, dotCenters, theta, vec2f(1.0, 1.0), center, dotSize, dotScale, softness, dims);
  d = d + getDotRGB(gridPos, dotCenters, theta, vec2f(-1.0, 1.0), center, dotSize, dotScale, softness, dims);
  d = d + getDotRGB(gridPos, dotCenters, theta, vec2f(-1.0, -1.0), center, dotSize, dotScale, softness, dims);
  d = d + getDotRGB(gridPos, dotCenters, theta, vec2f(1.0, -1.0), center, dotSize, dotScale, softness, dims);
  return min(vec3f(1.0), d);
}

fn lumaSrgb(srgb: vec3f) -> f32 {
    return 0.299 * srgb.r + 0.587 * srgb.g + 0.114 * srgb.b;
}

fn getDotBW(gridPos: vec2f, dotCenter: vec2f, theta: f32, offset: vec2f,
            center: vec2f, dotSize: f32, dotScale: f32, softness: f32,
            dims: vec2f, invertLuma: bool) -> f32 {
    let p = gridToLocalPos(dotCenter + offset, theta, center, dotSize);
    let rgba = tex2DStraightAlphaSrgb(blurredTex, samp, clamp(p / dims, vec2f(0.0), vec2f(1.0)));
    var luma = srgbToLinearMono(lumaSrgb(rgba.xyz));
    if (invertLuma) { luma = 1.0 - luma; }
    luma  *= rgba.a;
    let rad = getHalftoneDotRadiusForLuma(luma) * dotScale;
    let d = length(gridPos - (dotCenter + offset));
    return smoothstep(rad * (1.0 + softness), rad * (1.0 - softness) - 0.001, d);
}

fn getHalftoneBW(localPos: vec2f, theta: f32, center: vec2f, dotSize: f32,
                 dotScale: f32, softness: f32, dims: vec2f, invertLuma: bool) -> f32 {
    let gridPos = localPosToGrid(localPos, theta, center, dotSize);
    let dotCenters = floor(gridPos + 0.5);
    var d = getDotBW(gridPos, dotCenters, theta, vec2f( 0.0,  0.0), center, dotSize, dotScale, softness, dims, invertLuma);
    d = d + getDotBW(gridPos, dotCenters, theta, vec2f( 1.0,  0.0), center, dotSize, dotScale, softness, dims, invertLuma);
    d = d + getDotBW(gridPos, dotCenters, theta, vec2f(-1.0,  0.0), center, dotSize, dotScale, softness, dims, invertLuma);
    d = d + getDotBW(gridPos, dotCenters, theta, vec2f( 0.0,  1.0), center, dotSize, dotScale, softness, dims, invertLuma);
    d = d + getDotBW(gridPos, dotCenters, theta, vec2f( 0.0, -1.0), center, dotSize, dotScale, softness, dims, invertLuma);
    d = d + getDotBW(gridPos, dotCenters, theta, vec2f( 1.0,  1.0), center, dotSize, dotScale, softness, dims, invertLuma);
    d = d + getDotBW(gridPos, dotCenters, theta, vec2f(-1.0,  1.0), center, dotSize, dotScale, softness, dims, invertLuma);
    d = d + getDotBW(gridPos, dotCenters, theta, vec2f(-1.0, -1.0), center, dotSize, dotScale, softness, dims, invertLuma);
    d = d + getDotBW(gridPos, dotCenters, theta, vec2f( 1.0, -1.0), center, dotSize, dotScale, softness, dims, invertLuma);
    return min(1.0, d);
}

fn getDotCMYK(gridPos: vec2f, dotCenter: vec2f, theta: f32, offset: vec2f, center: vec2f, dotSize: f32, dotScale: f32, softness: f32, dims: vec2f) -> vec4f {
  let p = gridToLocalPos(dotCenter + offset, theta, center, dotSize);
  let rgba = tex2DStraightAlphaLinear(blurredTex, samp, clamp(p / dims, vec2f(0.0), vec2f(1.0)));
  let cmyk = mix(vec4f(0.0), rgbToCmyk(rgba.xyz), rgba.a);
  var radii = vec4f(
    getHalftoneDotRadiusForLuma(cmyk.x),
    getHalftoneDotRadiusForLuma(cmyk.y),
    getHalftoneDotRadiusForLuma(cmyk.z),
    getHalftoneDotRadiusForLuma(cmyk.w)
  ) * dotScale;
  let d = length(gridPos - (dotCenter + offset));
  let dot0 = smoothstep(radii.x * (1.0 + softness), radii.x * (1.0 - softness) - 0.001, d);
  let dot1 = smoothstep(radii.y * (1.0 + softness), radii.y * (1.0 - softness) - 0.001, d);
  let dot2 = smoothstep(radii.z * (1.0 + softness), radii.z * (1.0 - softness) - 0.001, d);
  let dot3 = smoothstep(radii.w * (1.0 + softness), radii.w * (1.0 - softness) - 0.001, d);
  return vec4f(dot0, dot1, dot2, dot3);
}

fn getHalftoneCMYK(localPos: vec2f, theta: f32, center: vec2f, dotSize: f32, dotScale: f32, softness: f32, dims: vec2f) -> vec4f {
  let gridPos = localPosToGrid(localPos, theta, center, dotSize);
  let dotCenters = floor(gridPos + 0.5);
  var d = getDotCMYK(gridPos, dotCenters, theta, vec2f(0.0, 0.0), center, dotSize, dotScale, softness, dims);
  d = d + getDotCMYK(gridPos, dotCenters, theta, vec2f(1.0, 0.0), center, dotSize, dotScale, softness, dims);
  d = d + getDotCMYK(gridPos, dotCenters, theta, vec2f(-1.0, 0.0), center, dotSize, dotScale, softness, dims);
  d = d + getDotCMYK(gridPos, dotCenters, theta, vec2f(0.0, 1.0), center, dotSize, dotScale, softness, dims);
  d = d + getDotCMYK(gridPos, dotCenters, theta, vec2f(0.0, -1.0), center, dotSize, dotScale, softness, dims);
  d = d + getDotCMYK(gridPos, dotCenters, theta, vec2f(1.0, 1.0), center, dotSize, dotScale, softness, dims);
  d = d + getDotCMYK(gridPos, dotCenters, theta, vec2f(-1.0, 1.0), center, dotSize, dotScale, softness, dims);
  d = d + getDotCMYK(gridPos, dotCenters, theta, vec2f(-1.0, -1.0), center, dotSize, dotScale, softness, dims);
  d = d + getDotCMYK(gridPos, dotCenters, theta, vec2f(1.0, -1.0), center, dotSize, dotScale, softness, dims);
  return min(vec4f(1.0), d);
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let dotSize = u.params0.x;
  let dotScale = u.params0.y;
  let softness = u.params0.z;
  let rotation = u.params0.w; // in radians

  let centerX = u.params1.x;
  let centerY = u.params1.y;
  let clipToAlpha = u.params1.z > 0.5;
  let halftoneType = u32(u.params1.w + 0.5);

  let colorMode = u32(u.params2.x + 0.5);
  let dimW = u.params2.y;
  let dimH = u.params2.z;

  let dims = vec2f(dimW, dimH);
  let center = vec2f(centerX, centerY);
  // localPos is pixel space
  let localPos = uv * dims;

  // Sample original input as straight-alpha linear.
  let inputLinear = tex2DStraightAlphaLinear(inputTex, samp, uv);

  var color = vec3f(0.0);

  if (halftoneType == HALFTONE_TYPE_DOT) {
    if (colorMode == COLOR_MODE_CMYK) {
      var cmyk = vec4f(0.0);
      cmyk.x = getHalftoneCMYK(localPos, rotation + radians(15.0), center, dotSize, dotScale, softness, dims).x;
      cmyk.y = getHalftoneCMYK(localPos, rotation + radians(75.0), center, dotSize, dotScale, softness, dims).y;
      cmyk.z = getHalftoneCMYK(localPos, rotation + radians(0.0),  center, dotSize, dotScale, softness, dims).z;
      cmyk.w = getHalftoneCMYK(localPos, rotation + radians(45.0), center, dotSize, dotScale, softness, dims).w;
      color = cmykToRgb(cmyk);
    } else if (colorMode == COLOR_MODE_RGB) {
      color.x = getHalftoneRGB(localPos, rotation + radians(15.0), center, dotSize, dotScale, softness, dims).x;
      color.y = getHalftoneRGB(localPos, rotation + radians(75.0), center, dotSize, dotScale, softness, dims).y;
      color.z = getHalftoneRGB(localPos, rotation + radians(0.0),  center, dotSize, dotScale, softness, dims).z;
    } else if (colorMode == COLOR_MODE_BW_LIGHT) {
      let dotFill = getHalftoneBW(localPos, rotation + radians(45.0), center, dotSize, dotScale, softness, dims, true);
      color = vec3f(1.0 - dotFill);
    } else if (colorMode == COLOR_MODE_BW_DARK) {
      let dotFill = getHalftoneBW(localPos, rotation + radians(45.0), center, dotSize, dotScale, softness, dims, false);
      color = vec3f(dotFill);
    }
  } else {
    // EUCLIDEAN
    let averagedLinear = tex2DStraightAlphaLinear(blurredTex, samp, clamp(localPos / dims, vec2f(0.0), vec2f(1.0)));
    if (colorMode == COLOR_MODE_CMYK) {
      var cmyk = rgbToCmyk(mix(vec3f(1.0), averagedLinear.xyz, inputLinear.w)) * dotScale;
      cmyk.x = getHalftoneEuclidean(cmyk.x, localPos, rotation + radians(15.0), center, dotSize, softness);
      cmyk.y = getHalftoneEuclidean(cmyk.y, localPos, rotation + radians(75.0), center, dotSize, softness);
      cmyk.z = getHalftoneEuclidean(cmyk.z, localPos, rotation + radians(0.0),  center, dotSize, softness);
      cmyk.w = getHalftoneEuclidean(cmyk.w, localPos, rotation + radians(45.0), center, dotSize, softness);
      color = cmykToRgb(cmyk);
    } else if (colorMode == COLOR_MODE_RGB) {
      let rgbPremult = averagedLinear.xyz * inputLinear.a * dotScale;
      color.x = getHalftoneEuclidean(rgbPremult.x, localPos, rotation + radians(15.0), center, dotSize, softness);
      color.y = getHalftoneEuclidean(rgbPremult.y, localPos, rotation + radians(75.0), center, dotSize, softness);
      color.z = getHalftoneEuclidean(rgbPremult.z, localPos, rotation + radians(0.0),  center, dotSize, softness);
    } else if (colorMode == COLOR_MODE_BW_LIGHT) {
      let blurredStraight = tex2DStraightAlphaSrgb(blurredTex, samp, clamp(localPos / dims, vec2f(0.0), vec2f(1.0)));
      let luma = clamp(srgbToLinearMono(lumaSrgb(blurredStraight.xyz)) * inputLinear.a * dotScale, 0.0, 1.0);
      let inkCoverage = 1.0 - luma;
      let dotFill = getHalftoneEuclidean(inkCoverage, localPos, rotation + radians(45.0), center, dotSize, softness);
      color = vec3f(1.0 - dotFill);
    } else if (colorMode == COLOR_MODE_BW_DARK) {
      let blurredStraight = tex2DStraightAlphaSrgb(blurredTex, samp, clamp(localPos / dims, vec2f(0.0), vec2f(1.0)));
      let luma = clamp(srgbToLinearMono(lumaSrgb(blurredStraight.xyz)) * inputLinear.a * dotScale, 0.0, 1.0);
      let dotFill = getHalftoneEuclidean(luma, localPos, rotation + radians(45.0), center, dotSize, softness);
      color = vec3f(dotFill);
    }
  }

  let alphaVal = select(inputLinear.a, 1.0, !clipToAlpha);
  return vec4f(color * alphaVal, alphaVal);
}
`;
    var vertexBuffers = [{
            arrayStride: 16,
            attributes: [
                { shaderLocation: 0, format: 'float32x2', offset: 0 },
                { shaderLocation: 1, format: 'float32x2', offset: 8 },
            ],
        }];
    frame.state.blurModule = device.createShaderModule({ code: WGSL_BLUR });
    frame.state.halftoneModule = device.createShaderModule({ code: WGSL_HALFTONE });
    frame.state.vertexBuffers = vertexBuffers;
    frame.state.quad = device.createBuffer({
        size: 6 * 4 * 4,
        usage: GPUBufferUsage.VERTEX,
        mappedAtCreation: true,
    });
    new Float32Array(frame.state.quad.getMappedRange()).set([
        -1, -1, 0, 1,
        1, -1, 1, 1,
        -1, 1, 0, 0,
        -1, 1, 0, 0,
        1, -1, 1, 1,
        1, 1, 1, 0,
    ]);
    frame.state.quad.unmap();
    frame.state.uniformBlurH = device.createBuffer({
        size: 16,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    frame.state.uniformBlurV = device.createBuffer({
        size: 16,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    frame.state.uniformHalftone = device.createBuffer({
        size: 64,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    frame.state.blurWeights = device.createBuffer({
        size: 66 * 4,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    frame.state.blurWeightsRadius = null;
    frame.state.sampler = device.createSampler({
        magFilter: 'linear',
        minFilter: 'linear',
        addressModeU: 'clamp-to-edge',
        addressModeV: 'clamp-to-edge',
    });
    frame.state.blurPipelineFormat = null;
    frame.state.halftonePipelineFormat = null;
    frame.state.blurA = null;
    frame.state.blurB = null;
    frame.state.bufW = 0;
    frame.state.bufH = 0;
}
export function render(device, frame) {
    var p = frame.params;
    var dotSize = Number(p.dotSize) || 20;
    var dotScale = p.dotScale != null ? Number(p.dotScale) : 1.0;
    var softness = p.softness != null ? Number(p.softness) : 0.1;
    var rotationDeg = Number(p.rotation) || 0;
    var rotationRad = rotationDeg * Math.PI / 180.0;
    var centerXPct = (p.centerPos && p.centerPos.x != null) ? Number(p.centerPos.x) : 50;
    var centerYPct = (p.centerPos && p.centerPos.y != null) ? Number(p.centerPos.y) : 50;
    var clipToAlpha = p.clipToAlpha ? 1.0 : 0.0;
    var halftoneType = Number(p.halftoneType) || 0;
    var colorMode = Number(p.colorMode) || 0;
    if (frame.input == null) {
        return;
    }
    var inputTex = frame.input;
    var texW = inputTex.physicalWidth ?? inputTex.width;
    var texH = inputTex.physicalHeight ?? inputTex.height;
    // Use canvas bounds so coords are in design units, not clamped texture pixels
    var w = (frame.output.physicalWidth ?? frame.output.width) / frame.renderScale;
    var h = (frame.output.physicalHeight ?? frame.output.height) / frame.renderScale;
    var centerX = centerXPct / 100.0 * w;
    var centerY = centerYPct / 100.0 * h;
    // Keep blur weights in points; convert sample offsets to pixels in WGSL.
    var blurRadius = dotSize * (texW / frame.renderScale) / w;
    var blurRadiusF32 = new Float32Array([blurRadius])[0];
    if (frame.state.blurWeightsRadius !== blurRadiusF32) {
        var weightData = new Float32Array(66);
        var sigma = Math.max(Math.fround(blurRadiusF32 / 2.0), 0.5);
        var twoSigmaSq = Math.fround(Math.fround(2.0 * sigma) * sigma);
        var weightSum = 0.0;
        for (var weightIndex = 0; weightIndex < 65; weightIndex += 1) {
            var tap = weightIndex - 32;
            var tapSquared = Math.fround(tap * tap);
            var exponent = Math.fround(-tapSquared / twoSigmaSq);
            var weight = Math.fround(Math.exp(exponent));
            weightData[weightIndex] = weight;
            weightSum = Math.fround(weightSum + weight);
        }
        weightData[65] = weightSum;
        device.queue.writeBuffer(frame.state.blurWeights, 0, weightData);
        frame.state.blurWeightsRadius = blurRadiusF32;
    }
    if (frame.state.blurPipelineFormat !== 'rgba8unorm') {
        frame.state.blurPipeline = device.createRenderPipeline({
            layout: 'auto',
            vertex: { module: frame.state.blurModule, entryPoint: 'vs_main', buffers: frame.state.vertexBuffers },
            fragment: { module: frame.state.blurModule, entryPoint: 'fs_main', targets: [{ format: 'rgba8unorm' }] },
            primitive: { topology: 'triangle-list' },
        });
        frame.state.blurPipelineFormat = 'rgba8unorm';
    }
    if (frame.state.halftonePipelineFormat !== frame.output.format) {
        frame.state.halftonePipeline = device.createRenderPipeline({
            layout: 'auto',
            vertex: { module: frame.state.halftoneModule, entryPoint: 'vs_main', buffers: frame.state.vertexBuffers },
            fragment: { module: frame.state.halftoneModule, entryPoint: 'fs_main', targets: [{ format: frame.output.format }] },
            primitive: { topology: 'triangle-list' },
        });
        frame.state.halftonePipelineFormat = frame.output.format;
    }
    if (frame.state.blurA == null || frame.state.bufW !== texW || frame.state.bufH !== texH) {
        if (frame.state.blurA != null) {
            frame.state.blurA.destroy();
        }
        if (frame.state.blurB != null) {
            frame.state.blurB.destroy();
        }
        var texDesc = {
            size: [texW, texH, 1],
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT,
        };
        frame.state.blurA = device.createTexture(texDesc);
        frame.state.blurB = device.createTexture(texDesc);
        frame.state.bufW = texW;
        frame.state.bufH = texH;
    }
    device.queue.writeBuffer(frame.state.uniformBlurH, 0, new Float32Array([1, 0, blurRadiusF32, frame.renderScale]));
    device.queue.writeBuffer(frame.state.uniformBlurV, 0, new Float32Array([0, 1, blurRadiusF32, frame.renderScale]));
    device.queue.writeBuffer(frame.state.uniformHalftone, 0, new Float32Array([
        dotSize, dotScale, softness, rotationRad,
        centerX, centerY, clipToAlpha, halftoneType,
        colorMode, w, h, 0,
        0, 0, 0, 0,
    ]));
    var bindBlurH = device.createBindGroup({
        layout: frame.state.blurPipeline.getBindGroupLayout(0),
        entries: [
            { binding: 0, resource: { buffer: frame.state.uniformBlurH } },
            { binding: 1, resource: frame.state.sampler },
            { binding: 2, resource: inputTex.createView() },
            { binding: 3, resource: { buffer: frame.state.blurWeights } },
        ],
    });
    var bindBlurV = device.createBindGroup({
        layout: frame.state.blurPipeline.getBindGroupLayout(0),
        entries: [
            { binding: 0, resource: { buffer: frame.state.uniformBlurV } },
            { binding: 1, resource: frame.state.sampler },
            { binding: 2, resource: frame.state.blurA.createView() },
            { binding: 3, resource: { buffer: frame.state.blurWeights } },
        ],
    });
    var bindHalftone = device.createBindGroup({
        layout: frame.state.halftonePipeline.getBindGroupLayout(0),
        entries: [
            { binding: 0, resource: { buffer: frame.state.uniformHalftone } },
            { binding: 1, resource: frame.state.sampler },
            { binding: 2, resource: inputTex.createView() },
            { binding: 3, resource: frame.state.blurB.createView() },
        ],
    });
    var encoder = device.createCommandEncoder();
    var p1 = encoder.beginRenderPass({
        colorAttachments: [{
                view: frame.state.blurA.createView(),
                loadOp: 'clear',
                clearValue: { r: 0, g: 0, b: 0, a: 0 },
                storeOp: 'store',
            }],
    });
    p1.setPipeline(frame.state.blurPipeline);
    p1.setBindGroup(0, bindBlurH);
    p1.setVertexBuffer(0, frame.state.quad);
    p1.draw(6);
    p1.end();
    var p2 = encoder.beginRenderPass({
        colorAttachments: [{
                view: frame.state.blurB.createView(),
                loadOp: 'clear',
                clearValue: { r: 0, g: 0, b: 0, a: 0 },
                storeOp: 'store',
            }],
    });
    p2.setPipeline(frame.state.blurPipeline);
    p2.setBindGroup(0, bindBlurV);
    p2.setVertexBuffer(0, frame.state.quad);
    p2.draw(6);
    p2.end();
    var p3 = encoder.beginRenderPass({
        colorAttachments: [{
                view: frame.output.createView(),
                loadOp: 'clear',
                clearValue: { r: 0, g: 0, b: 0, a: 0 },
                storeOp: 'store',
            }],
    });
    p3.setPipeline(frame.state.halftonePipeline);
    p3.setBindGroup(0, bindHalftone);
    p3.setVertexBuffer(0, frame.state.quad);
    p3.draw(6);
    p3.end();
    device.queue.submit([encoder.finish()]);
}
defineProperties(Effect, {
    halftoneType: {
        type: "number",
        label: "Pattern",
        defaultValue: 0,
        control: "select",
        options: [
            { value: 0, label: "Dot" },
            { value: 1, label: "Blended" },
        ],
    },
    colorMode: {
        type: "number",
        label: "Color mode",
        defaultValue: 0,
        control: "select",
        options: [
            { value: 0, label: "CMYK" },
            { value: 1, label: "RGB" },
            { value: 2, label: "BW light" },
            { value: 3, label: "BW dark" },
        ],
    },
    dotSize: {
        type: "number",
        label: "Dot size",
        defaultValue: 20,
        control: "slider",
        min: 4,
        max: 120,
        step: 0.5,
    },
    dotScale: {
        type: "number",
        label: "Dot scale",
        defaultValue: 1.0,
        control: "slider",
        min: 0.0,
        max: 2.0,
        step: 0.01,
    },
    softness: {
        type: "number",
        label: "Softness",
        defaultValue: 0.0,
        control: "slider",
        min: 0.0,
        max: 1.0,
        step: 0.01,
    },
    rotation: {
        type: "number",
        label: "Rotation",
        defaultValue: 0,
        control: "slider",
        min: -180,
        max: 180,
        step: 0.5,
    },
    centerPos: {
        type: "point",
        label: "Center",
        defaultValue: { x: 50, y: 50 },
        control: "point",
        mode: "canvas_and_ui",
        unit: "%",
    },
    clipToAlpha: {
        type: "boolean",
        label: "Clip to alpha",
        defaultValue: false,
    },
});

export const manifest = {
  "name": "Halftone",
  "version": 3,
  "isAnimated": false,
  "usesMouse": false,
  "renderScaleAware": true
}
