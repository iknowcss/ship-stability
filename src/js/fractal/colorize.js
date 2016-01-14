const hsv2rgb = require('src/js/util/hsv2rgb');

export const linear = builder(r => r);

export const sqrt = builder(r => Math.sqrt(r));

export const rational = builder(r => 2 - 2/(r + 1));

function builder(scaleFn) {
  return function (hMin, hMax, ratio) {
    const scaled = scaleFn(ratio);
    const hue = hMin + scaled*(hMax - hMin);
    const { r, g, b } = hsv2rgb(hue, 1, 1);
    return `rgb(${r}, ${g}, ${b})`;
  };
}