import React, { Component } from 'react'
import extend from 'lodash/extend'
import rk4 from 'src/js/util/rk4'
import { b, w, a, h } from 'src/js/standard-coefficients'

const intervalDefer = window.requestAnimationFrame
const cancelIntervalDefer = window.cancelAnimationFrame

const MARLIN_OFFSET = 5
const ANGLE_MULTIPLIER = 60
const MAX_X = (90 - MARLIN_OFFSET)/ANGLE_MULTIPLIER

export default class ShipSimulation extends Component {
  constructor () {
    super()
    this.state = ShipSimulation.initialState
  }

  componentDidMount () {
    this.reset()
    this.setPlayback(this.props.play);
  }

  componentWillReceiveProps (nextProps) {
    this.setPlayback(nextProps.play)
  }

  onComponentWillUnmount () {
    this.pause()
  }

  setPlayback (play) {
    if (play && !this.intervalHandler) {
      this.renderNext()
    } else if (!play && this.intervalHandler) {
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
    this.setState(extend({}, ShipSimulation.initialState, {
      x: this.props.initialX,
      v: this.props.initialV
    }))
  }

  step () {
    let tY = [ 0, [this.state.x, this.state.v] ]

    var F = [
      (t, Y) => Y[1],
      (t, Y) => -b*Y[1] - Y[0] + Y[0]*Y[0] + this.props.force*.25
    ];

    tY = rk4(F, tY, h, 100)
    const x = tY[1][0]
    const v = tY[1][1]

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
            WebkitTransform: `rotate(${this.currentAngle()}deg)`,
            transformOrigin: '50% 70%'
          }}
          ></div>
      </div>
    )
  }
}

ShipSimulation.initialState = {
  capsized: false
}

ShipSimulation.defaultProps = {
  initialX: 0,
  initialV: 0,
  onPlay: () => {},
  onPause: () => {},
  onCapsize: () => {},
}