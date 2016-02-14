import React, { Component } from 'react'
import throttle from 'lodash/throttle'
import rk4 from 'src/js/util/rk4'
import { b, w, a, h } from 'src/js/standard-coefficients'

const intervalDefer = window.requestAnimationFrame
const cancelIntervalDefer = window.cancelAnimationFrame

const MARLIN_OFFSET = 5
const ANGLE_MULTIPLIER = 60
const MAX_X = (90 - MARLIN_OFFSET)/ANGLE_MULTIPLIER

import 'src/writeup/ShipSimulation.less'

export default class ShipSimulation extends Component {
  constructor () {
    super()
    this.state = ShipSimulation.initialState
  }

  shouldComponentUpdate () {
    // Maybe check to see that the initial X and V are different
    return false
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
    this.x = this.props.initialX
    this.v = this.props.initialV
    this.updateRoll()
    this.setState(ShipSimulation.initialState)
  }

  step () {
    let tY = [ 0, [this.x, this.v] ]

    var F = [
      (t, Y) => Y[1],
      (t, Y) => -b*Y[1] - Y[0] + Y[0]*Y[0] + this.props.force*.25
    ];

    tY = rk4(F, tY, h, 100)
    let x = tY[1][0]
    let v = tY[1][1]

    if (x > MAX_X) {
      x = MAX_X
      this.setState({ capsized: true })
      this.props.onCapsize()
      this.pause()
    }

    this.x = x
    this.v = v

    this.updateRoll()
  }

  updateRoll () {
    const currentAngle = this.x*ANGLE_MULTIPLIER + MARLIN_OFFSET
    this.refs.shipBlock.style.transform =
      this.refs.shipBlock.style.WebkitTransform = `rotate(${currentAngle}deg)`
  }

  render () {
    console.log('ShipSim render')
    return (
      <div className="ShipSimulation">
        <div
          className="ShipSimulation-ShipBlock"
          ref="shipBlock"
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