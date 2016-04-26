import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import GlslCanvas from 'src/js/glsl/glsl-canvas'

import './FractalCanvas.less'
export default class FractalCanvas extends Component {
  shouldComponentUpdate () {
    return false
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.color !== this.props.color) {
      this.glslCanvas.setColorize(nextProps.color)
    }

    if (nextProps.play !== this.props.play) {
      if (nextProps.play) {
        this.glslCanvas.play()
      } else {
        this.glslCanvas.pause()
      }
    }
  }

  reset () {
    this.glslCanvas.pause()
    this.glslCanvas.reset()
    this.glslCanvas.clearTextures()
    this.glslCanvas.renderNextStep()
  }

  componentDidMount () {
    this.glslCanvas = new GlslCanvas(this.refs.canvas, {
      scale: this.props.scale
    })
      .addVertexShader(require('raw!src/js/glsl/v-shader.glsl'))
      .addFragmentShader(require('raw!src/js/glsl/f-shader.glsl'))
      .init()

    if (this.props.pixelate) {
      this.glslCanvas.onRender(() => this.foo())
    }

    const {
      w: { min: xFrom, max: xTo },
      a: { min: yFrom, max: yTo }
    } = this.props.domain
    const domain = {
      x: { from: xFrom, to: xTo },
      y: { from: yFrom, to: yTo }
    }
    this.glslCanvas.setDomain(domain)
    this.glslCanvas.setColorize(this.props.colorize)
    this.glslCanvas.renderNextStep()
  }

  foo () {
    this.refs.snapshot.setAttribute('src', this.glslCanvas.getImageDataUrl())
  }

  render () {
    let className = classnames('FractalCanvas', this.props.className)

    return (
      <div className={className}>
        {this.props.pixelate ? <img
          ref="snapshot"
          alt="Fractal snapshot"
          className="FractalCanvas-Img"
        /> : null}
        <canvas
          ref="canvas"
          className="FractalCanvas-Canvas"
          style={{
            display: this.props.pixelate ? 'none' : 'block'
          }}
        />
      </div>
    )
  }
}

FractalCanvas.propTypes = {
  domain: PropTypes.shape({
    a: PropTypes.shape({
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired
    }).isRequired,
    w: PropTypes.shape({
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired
    }).isRequired
  }).isRequired,
  scale: PropTypes.number.isRequired,
  pixelate: PropTypes.bool,
  colorize: PropTypes.bool
}
