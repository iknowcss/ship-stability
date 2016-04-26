import React, { Component } from 'react'
import Card from 'material-ui/lib/card/card'
import FractalCanvas from 'src/writeup/component/FractalCanvas'
import PlayControl from 'src/writeup/component/PlayControl'
import GraphAxis from 'src/writeup/component/GraphAxis'

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
        <Card zDepth={2}>
          <GraphAxis className="FractalCanvasToy-Graph">
            <FractalCanvas
              ref="fractalCanvas"
              className="FractalCanvasToy-Canvas"
              play={this.state.play}
              domain={this.props.domain}
              scale={this.props.scale}
              pixelate={this.props.pixelate}
              colorize={this.props.colorize}
            />
          </GraphAxis>
          <PlayControl
            onPlay={() => this.setState({ play: true })}
            onPause={() => this.setState({ play: false })}
            onRestart={() => this.restart()}
          />
        </Card>
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
  },
  scale: 8,
  colorize: false
}
