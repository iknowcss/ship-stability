import GlslCanvas from './glsl-canvas';
import Domain from 'src/js/util/domain';

const canvas = document.getElementById('glsl-canvas');
const storage = document.getElementById('glsl-storage');
const time = document.getElementById('glsl-time');

const glslCanvas = new GlslCanvas(canvas)
  .addVertexShader(require('./v-shader.glsl'))
  .addFragmentShader(require('./f-shader.glsl'))
  .init();

// glslCanvas.render(new Domain([0, 2], [0, 0.5]))

canvas.addEventListener('click', () => {
  time.textContent = '';
  var start = window.performance.now();

  var x = { min: 0.1, max: 0.5 }; x.size = x.max - x.min;
  var y = { min: 0.15, max: 0.27 }; y.size = y.max - y.min;

  var xi = 0;
  var yi = 0;

  var foo = 10;

  function doThing() {
    glslCanvas.render(new Domain(
      [x.min + xi*x.size/foo, x.min + (xi + 1)*x.size/foo],
      [y.min + yi*y.size/foo, y.min + (yi + 1)*y.size/foo]
    ));

    var img = document.createElement('img');
    img.setAttribute('src', canvas.toDataURL());
    img.setAttribute('width', canvas.width/2);
    img.setAttribute('height', canvas.height/2);
    Object.assign(img.style, {
      position: 'absolute',
      top: canvas.height * (foo-yi)/2 + 'px',
      left: canvas.width * xi/2 + 'px'
    });
    storage.appendChild(img);

    xi++;
    if (xi >= foo) {
      xi = 0;
      yi++;
      storage.appendChild(document.createElement('br'));
    }
    if (yi < foo) {
      // setTimeout(function () {
        requestAnimationFrame(doThing);  
      // }, 100);
    } else {
      time.textContent = (window.performance.now() - start).toFixed(2) + 'ms';
    }
  }

  requestAnimationFrame(doThing);
});
