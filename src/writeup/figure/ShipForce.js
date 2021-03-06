import React, { Component } from 'react'
import defer from 'lodash/defer'
import Slider from 'material-ui/lib/slider'
import PlayControl from 'src/writeup/component/PlayControl'

import ShipSimulation from 'src/writeup/component/ShipSimulation'

import './ShipForce.less'
export default class ShipForce extends Component {
  constructor () {
    super()
    this.state = ShipForce.initialState
  }

  onForceSliderChange (x) {
    // Must wait until after onChange completes before setting state
    defer(() => {
      this.setState({ x: x + 0.001 })
      this.refs.shipSimulation.reset()
    })
  }

  restartShipSimulation () {
    const { capsized } = ShipForce.initialState
    this.setState({ capsized, active: false })
    this.refs.shipSimulation.reset()
  }

  render () {
    return (
      <div className="ShipForce">
        <ShipSimulation
          ref="shipSimulation"
          capsizeLine={true}
          tiltLine={true}
          play={this.state.active}
          initialX={this.state.x}
          onCapsize={() => this.setState({ capsized: true })}
        />
        <div className="ShipForce-InitialTilt">
          <Slider
            className="ShipForce-Slider"
            ref="slider"
            min={-1.5}
            max={1.5}
            defaultValue={ShipForce.initialState.x}
            onChange={(e, x) => this.onForceSliderChange(x)}
            disabled={this.state.active}
            onTouchStart={e => e.preventDefault()}
            style={{ marginBottom: 0, marginTop: 0 }}
          />
          <div>Initial Tilt</div>
        </div>
        <PlayControl
          disablePlay={this.state.capsized}
          onPlay={() => this.setState({ active: true })}
          onPause={() => this.setState({ active: false })}
          onRestart={() => this.restartShipSimulation()}
        />
      </div>
    )
  }
}

ShipForce.initialState = {
  active: false,
  capsized: false,
  x: -0.54
}
