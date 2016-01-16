import GlslCanvas from './glsl-canvas';

const canvas = document.getElementById('glsl-canvas');

const vShader = require('raw!./v-shader.glsl');
console.log(vShader);

const glslCanvas = new GlslCanvas(canvas)
  .withVertexShader(vShader)
  .withFragmentShader(require('raw!./f-shader.glsl'))
  .init();