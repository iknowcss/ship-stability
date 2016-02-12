import GlslCanvas, { ShaderMode } from './glsl-canvas';

const canvas = document.getElementById('glsl-canvas');

const glslCanvas = new GlslCanvas(canvas)
  .addVertexShader(require('./v-shader.glsl'))
  .addFragmentShader(require('./f-shader.glsl'))
  .init();


/// - Default
glslCanvas.setDomain({
  x: { from: 0., to: 2. },
  y: { from: 0., to: 0.5 }
});

/// - Fingers
// glslCanvas.setDomain({
//   x: { from: 0.0+.125-.05, to: .5-.125-.05 },
//   y: { from: 0.0+.125, to: .5-.125 }
// });

/// - Rings of Saturn
// glslCanvas.setDomain({
//   x: { from: 1.5, to: 1.9 },
//   y: { from: 0.3, to: 0.6 }
// });

glslCanvas.render();