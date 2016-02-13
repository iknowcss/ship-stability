import React, { Component } from 'react'
import Slider from 'material-ui/lib/slider'
import RaisedButton from 'material-ui/lib/raised-button'

import ShipSimulation from 'src/writeup/ShipSimulation'

export default class ShipForce extends Component {
  constructor () {
    super()
    this.state = ShipForce.initialState
  }

  onForceSliderChange (value) {
    this.setState({ force: value })
  }

  restartShipSimulation () {
    const { force, capsized } = ShipForce.initialState
    this.setState({ force, capsized, active: true })
    this.refs.shipSimulation.reset()
  }

  render () {
    return <div style={{ textAlign: 'center' }}>
      <ShipSimulation
        ref="shipSimulation"
        force={this.state.force}
        play={this.state.active}
        initialV="0.05"
        onCapsize={() => this.setState({ capsized: true })}
      />
      <Slider
        min={-1}
        max={1}
        value={this.state.force}
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
  }
}

ShipForce.initialState = { force: 0, active: false, capsized: false }