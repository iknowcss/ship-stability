import first from 'lodash/array/first';

export default class GlslCanvas {
  constructor(canvas, options = {}) {
    if (!window.WebGLRenderingContext) {
      console.error('[GlslCanvas] No WebGLRenderingContext');
      return null;
    }

    this.canvas = canvas;
    this.options = options;
    this.attribLocations = [];
    this.attribs = [];
  }

  /// - Context

  init3DContext() {
    // Refactor this later
    try {
      this.gl = this.canvas.getContext('experimental-webgl');
    } catch (e) {
      try {
        this.gl = this.canvas.getContext('webgl');
      } catch (e2) {
        console.error('[GlslCanvas] Could not initialize canvas context');
        return;
      }
    }
  }

  /// - Builder functions

  withVertexShader(vShader) {
    this.vShader = vShader;
    return this;
  }

  withFragmentShader(fShader) {
    this.fShader = fShader;
    return this;
  }

  withAttribLocations(attribLocations) {
    this.attribLocations = attribLocations;
    return this;
  }

  withAttribs(attribs) {
    this.attribs = attribs;
    return this;
  }

  init() {
    this.init3DContext();
    this.initProgram();
    return this;
  }

  /// - Program

  initProgram() {
    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, createShader(this.gl, this.gl.VERTEX_SHADER, this.vShader));
    this.gl.attachShader(this.program, createShader(this.gl, this.gl.FRAGMENT_SHADER, this.fShader));

    this.attribs.forEach((attrib, i) => {
      const attribLocation = this.attribLocations[i];
      if (attribLocation) {
        this.gl.bindAttribLocation(this.program, attribLocation, attrib);
      } else {
        console.error('[GlslCanvas] No attrib location at index:', i);
      }
    });

    this.gl.linkProgram(this.program);
    const isLinked = this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS);
    if (!isLinked) {
      console.error('[GlslCanvas] Error in program linking:', this.program);
      this.gl.deleteProgram(this.program);
      this.program = null;
    }
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