import GlslCanvas from './glsl-canvas';
import Domain from 'src/js/util/domain';

const canvas = document.getElementById('glsl-canvas');

const glslCanvas = new GlslCanvas(canvas)
  .addVertexShader(require('./v-shader.glsl'))
  .addFragmentShader(require('./f-shader.glsl'))
  .init();

// glslCanvas.render(new Domain([0, 2], [0, 0.5]))
glslCanvas.render(new Domain([0.1, 0.5], [0.15, 0.27]))