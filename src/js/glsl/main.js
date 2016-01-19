import GlslCanvas from './glsl-canvas';
import Domain from 'src/js/util/domain';
import merge from 'lodash/object/merge';

const theButton = document.getElementById('glsl-button');
const canvas = document.getElementById('glsl-canvas');
const storage = document.getElementById('glsl-storage');
const time = document.getElementById('glsl-time');

const glslCanvas = new GlslCanvas(canvas)
  .addVertexShader(require('./v-shader.glsl'))
  .addFragmentShader(require('./f-shader.glsl'))
  .init();

// glslCanvas.render(new Domain([0, 2], [0, 0.5]))

theButton.addEventListener('click', () => {
  time.textContent = '';
  // var start = window.performance.now();

  var x = { min: 0.1, max: 0.5 }; x.size = x.max - x.min;
  var y = { min: 0.15, max: 0.27 }; y.size = y.max - y.min;

  var xi = 0;
  var yi = 0;

  var foo = 5;

  function doThing() {
    glslCanvas.render(new Domain(
      [x.min + xi*x.size/foo, x.min + (xi + 1)*x.size/foo],
      [y.min + yi*y.size/foo, y.min + (yi + 1)*y.size/foo]
    ));

    var img = document.createElement('img');
    img.setAttribute('src', canvas.toDataURL());
    img.setAttribute('width', 4*canvas.width);
    img.setAttribute('height', 4*canvas.height);
    merge(img.style, {
      position: 'absolute',
      top: canvas.height * 4*(foo-yi) + 'px',
      left: canvas.width * 4*xi + 'px'
    });
    storage.appendChild(img);

    xi++;
    if (xi >= foo) {
      xi = 0;
      yi++;
      storage.appendChild(document.createElement('br'));
    }
    if (yi < foo) {
      requestAnimationFrame(doThing);  
    } else {
      // time.textContent = (window.performance.now() - start).toFixed(2) + 'ms';
    }
  }

  requestAnimationFrame(doThing);
});
