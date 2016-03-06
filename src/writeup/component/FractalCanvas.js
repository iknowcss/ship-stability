import React, { Component, PropTypes } from 'react'
import GlslCanvas from 'src/js/glsl/glsl-canvas'

export default class FractalCanvas extends Component {
  shouldComponentUpdate () {
    return false
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.play !== this.props.play) {
      if (nextProps.play) {
        this.glslCanvas.play()
      } else {
        this.glslCanvas.pause()
      }
    }
  }

  reset () {
    console.error('not implemented yet')
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
    this.glslCanvas.renderNextStep()
  }

  foo () {
    this.refs.snapshot.setAttribute('src', this.glslCanvas.getImageDataUrl())
  }

  render () {
    let className = 'FractalCanvas'
    if (this.props.className) className += ' ' + this.props.className

    return (
      <div>
        {this.props.pixelate ? <img
          ref="snapshot"
          alt="Fractal snapshot"
          style={{
            imageRendering: 'pixelated',
            width: '256px',
            height: '256px'
          }}
        /> : null}
        <canvas
          className={className}
          ref="canvas"
          style={{
            display: this.props.pixelate ? 'none' : 'block' ,
            width: '256px',
            height: '256px'
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
  pixelate: PropTypes.bool
}
