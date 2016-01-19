import first from 'lodash/array/first';

const WebGLDebugUtils = require('src/js/util/webgl-debug');

const FULL_FRAME_POINT_ARRAY = [
  -1.0, -1.0,
  -1.0, 1.0,
  1.0, -1.0,
  1.0, -1.0,
  -1.0, 1.0,
  1.0, 1.0
];

export default class GlslCanvas {
  constructor(canvas, options = {}) {
    if (!window.WebGLRenderingContext) {
      console.error('[GlslCanvas] No WebGLRenderingContext');
      return null;
    }

    this.canvas = canvas;
    this.options = options;

    this.shaders = [];
  }

  /// - Context

  init3DContext() {
    const contextTypes = ['experimental-webgl', 'webgl'];
    let context;
    for (let i = 0; i < contextTypes.length; i++) {
      try {
        context = this.canvas.getContext(contextTypes[i]);
        if (!context) continue;
        console.info('[GlslCanvas] Initialize canvas context:', contextTypes[i]);
        break;
      } catch (e) {}
    }

    if (context) {
      this.gl = context;
    } else {
      this.gl = null;
      console.error('[GlslCanvas] Could not initialize canvas context');
    }
  }

  initContextDebugging() {
    if (this.gl) {
      this.gl = WebGLDebugUtils.makeDebugContext(this.gl, 
        (err, fnName, args) => {
          console.error(`[GlslCanvas] ERROR calling function ${fnName}:`, WebGLDebugUtils.glEnumToString(err));
        },
        (fnName, args) => {
          console.debug(`[GlslCanvas] ${fnName}(${WebGLDebugUtils.glFunctionArgsToString(fnName, args)})`);
        }
      );
    }
  }

  /// - Builder functions

  addVertexShader(source) {
    return this.addShader('VERTEX_SHADER', source);
  }

  addFragmentShader(source) {
    return this.addShader('FRAGMENT_SHADER', source);
  }

  addShader(type, source) {
    this.shaders.push({ type, source });
    return this;
  }

  init() {
    this.init3DContext();
    this.initContextDebugging();
    this.initProgram();
    this.gl.useProgram(this.program);

    return this;
  }

  /// - Attrib logic

  getAttribLocation(attrib) {
    return this.gl.getAttribLocation(this.program, attrib);
  }

  setUniform2f(name, a, b) {
    const location = this.gl.getUniformLocation(this.program, name);
    this.gl.uniform2f(location, a, b);
  }

  /// - Program init and checking

  initProgram() {
    this.program = this.gl.createProgram();
    this.initShaders();
    this.gl.linkProgram(this.program);

    const isLinked = this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS);
    if (!isLinked) {
      console.error('[GlslCanvas] Error in program linking:', this.program);
      this.gl.deleteProgram(this.program);
      this.program = null;
    }
  }

  initShaders() {
    this.shaders.forEach(({ source, type }) => {
      this.gl.attachShader(
        this.program, 
        createShader(this.gl, this.gl[type], source)
      );
    });
  }

  /// - API 

  render(domain) {
    this.setUniform2f('u_domain_width', domain.getDelta(0), domain.getDelta(1));
    this.setUniform2f('u_domain_offset', domain.get(0)[0], domain.get(1)[0]);

    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(FULL_FRAME_POINT_ARRAY),
      this.gl.STATIC_DRAW
    );

    const positionLocation = this.getAttribLocation('a_position');
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
     
    // draw
    this.gl.drawArrays(this.gl.TRIANGLES, 0, FULL_FRAME_POINT_ARRAY.length/2);
  }
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const isCompiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!isCompiled) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}