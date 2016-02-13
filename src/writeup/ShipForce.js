import React, { Component } from 'react'
import Slider from 'material-ui/lib/slider'
import RaisedButton from 'material-ui/lib/raised-button'
import rk4 from 'src/js/util/rk4'

const intervalDefer = window.requestAnimationFrame
const cancelIntervalDefer = window.cancelAnimationFrame

const MARLIN_OFFSET = 5
const ANGLE_MULTIPLIER = 60
const MAX_X = (90 - MARLIN_OFFSET)/ANGLE_MULTIPLIER

import { b, w, a, h } from 'src/js/standard-coefficients'

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
    this.setState({ force, capsized })
    this.refs.shipSimulation.reset()
  }

  render () {
    return <div style={{ textAlign: 'center' }}>
      <ShipSimulation
        ref="shipSimulation"
        force={this.state.force}
        active={this.state.active}
        onCapsize={() => this.setState({ capsized: true })}
      />
      <Slider
        min={-1}
        max={1}
        value={this.state.force}
        onChange={(e, v) => this.onForceSliderChange(v)}
        disabled={!this.state.active}
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

class ShipSimulation extends Component {
  constructor () {
    super()
    this.state = ShipSimulation.initialState
  }

  componentDidMount () {
    this.foo(this.props);
  }

  componentWillReceiveProps (nextProps) {
    this.foo(nextProps)
  }

  onComponentWillUnmount () {
    this.pause()
  }

  foo (nextProps) {
    if (nextProps.active && !this.intervalHandler) {
      this.renderNext()
    } else if (!nextProps.active && this.intervalHandler) {
      this.pause()
    }
  }

  pause () {
    cancelIntervalDefer(this.intervalHandler)
    this.intervalHandler = undefined
  }

  renderNext () {
    this.intervalHandler = intervalDefer(() => {
      this.intervalHandler = undefined
      if (!this.state.capsized) {
        this.step()
        this.renderNext()
      }
    })
  }

  reset () {
    this.setState(ShipSimulation.initialState)
  }

  step () {
    let tY = [ 0, [this.state.x, this.state.v] ]

    var F = [
      (t, Y) => Y[1],
      (t, Y) => -b*Y[1] - Y[0] + Y[0]*Y[0] + this.props.force*.25
    ];

    const [ t, [x, v] ] = rk4(F, tY, h, 100)

    const newState = { x, v }
    if (x > MAX_X) {
      newState.x = MAX_X
      newState.capsized = true
      this.props.onCapsize()
      this.pause()
    }
    this.setState(newState)
  }

  currentAngle () {
    return this.state.x*ANGLE_MULTIPLIER + MARLIN_OFFSET
  }

  render () {
    return (
      <div
        className="ship-force-container"
        style={{ textAlign: 'center' }}
      >
        <div
          style={{
            display: 'inline-block',
            height: '150px',
            width: '100px',
            backgroundColor: 'black',
            transform: `rotate(${this.currentAngle()}deg)`,
            transformOrigin: '50% 70%'
          }}
        ></div>
      </div>
    )
  }
}

ShipSimulation.initialState = {
  capsized: false,
  x: 0,
  v: 0.1
}

ShipSimulation.defaultProps = {
  onPlay: () => {},
  onPause: () => {},
  onCapsize: () => {},
}