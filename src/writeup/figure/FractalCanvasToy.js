import React, { Component } from 'react'
import GlslCanvas from 'src/js/glsl/glsl-canvas'

import './FractalCanvasToy.less'
export default class FractalCanvasToy extends Component {
  componentDidMount () {
    this.glslCanvas = new GlslCanvas(this.refs.canvas)
      .addVertexShader(require('raw!src/js/glsl/v-shader.glsl'))
      .addFragmentShader(require('raw!src/js/glsl/f-shader.glsl'))
      .init()

    /// - Default
    this.glslCanvas.setDomain({
      x: { from: 0., to: 2. },
      y: { from: 0., to: 0.5 }
    })

    this.glslCanvas.render()
  }

  render () {
    return (
      <div className="FractalCanvasToy">
        <canvas
          className="FractalCanvasToy-Canvas"
          ref="canvas"
          width="256" height="256"
        />
      </div>
    )
  }
}
