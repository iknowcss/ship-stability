import GlslCanvas from './glsl-canvas';

const canvas = document.getElementById('glsl-canvas');

const glslCanvas = new GlslCanvas(canvas)
  .addVertexShader(require('./v-shader.glsl'))
  .addFragmentShader(require('./f-shader.glsl'))
  .init();