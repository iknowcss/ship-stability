import React, { Component } from 'react'
import Slider from 'material-ui/lib/slider'
import RaisedButton from 'material-ui/lib/raised-button'

import ShipSimulation from 'src/writeup/ShipSimulation'

import 'src/writeup/ShipForce.less'
export default class ShipForce extends Component {
  constructor () {
    super()
    this.state = ShipForce.initialState
    this.force = 0
  }

  onForceSliderChange (value) {
    this.force = value
  }

  restartShipSimulation () {
    const { capsized } = ShipForce.initialState
    this.setState({ capsized, active: true })
    this.force = 0
    this.refs.slider.setValue(0)
    this.refs.shipSimulation.reset()
  }

  render () {
    return (
      <div className="ShipForce">
        <ShipSimulation
          ref="shipSimulation"
          play={this.state.active}
          initialV="0.1"
          force={() => this.force}
          onCapsize={() => this.setState({ capsized: true })}
        />
        <Slider
          ref="slider"
          className="ShipForce-Slider"
          min={-1}
          max={1}
          defaultValue={0}
          onChange={(e, v) => this.onForceSliderChange(v)}
          disabled={!this.state.active}
          onTouchStart={e => e.preventDefault()}
        />
        <div>
          <RaisedButton
            label={this.state.active ? 'Pause' : 'Play'}
            primary={!this.state.active}
            disabled={this.state.capsized}
            onClick={() => this.setState({ active: !this.state.active })}
          />
          &nbsp;
          <RaisedButton
            label="Restart"
            secondary={this.state.active}
            disabled={!this.state.active}
            onClick={() => this.restartShipSimulation()}
          />
        </div>
      </div>
    )
  }
}

ShipForce.initialState = {
  active: false,
  capsized: false
}