import GlslCanvas, { ShaderMode } from './glsl-canvas';

const canvas = document.getElementById('glsl-canvas');

const glslCanvas = new GlslCanvas(canvas)
  .addVertexShader(require('./v-shader.glsl'))
  .addFragmentShader(require('./f-shader.glsl'))
  .init();

// glslCanvas.setDomain({
//   x: { from: 0.0+.125-.05, to: .5-.125-.05 },
//   y: { from: 0.0+.125, to: .5-.125 }
// });

glslCanvas.setDomain({
  x: { from: 0., to: 1. },
  y: { from: 0., to: 1. }
});

glslCanvas.render();