import React, { Component } from 'react'
import FractalCanvas from 'src/writeup/component/FractalCanvas'
import PlayControl from 'src/writeup/component/PlayControl'

import './FractalCanvasToy.less'
export default class FractalCanvasToy extends Component {
  constructor () {
    super()
    this.state = FractalCanvasToy.initialState
  }

  restart () {
    this.setState({ play: false })
    this.refs.fractalCanvas.reset()
  }

  render () {
    return (
      <div className="FractalCanvasToy">
        <FractalCanvas
          ref="fractalCanvas"
          play={this.state.play}
          className="FractalCanvasToy-Canvas"
          domain={this.props.domain}
        />
        <PlayControl
          onPlay={() => this.setState({ play: true })}
          onPause={() => this.setState({ play: false })}
          onRestart={() => this.restart()}
        />
      </div>
    )
  }
}

FractalCanvasToy.initialState = {
  play: false
}


FractalCanvasToy.defaultProps = {
  domain: {
    a: { min: 0, max: 2 },
    w: { min: 0, max: 2 }
  }
}
