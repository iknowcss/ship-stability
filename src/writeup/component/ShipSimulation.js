import React, { Component } from 'react'
import ShipBlock from 'src/writeup/component/ShipBlock'
import { rk4Mutate } from 'src/js/util/rk4'
import { b, w, a, h } from 'src/js/standard-coefficients'
import { MARLIN_OFFSET, ANGLE_MULTIPLIER, MAX_X } from 'src/writeup/constants'

const intervalDefer = window.requestAnimationFrame
const cancelIntervalDefer = window.cancelAnimationFrame

import './ShipSimulation.less'
export default class ShipSimulation extends Component {
  constructor () {
    super()
    this.state = ShipSimulation.initialState

    this.stepVectorFunction = [
      (t, Y) => Y[1],
      (t, Y) => -b*Y[1] - Y[0] + Y[0]*Y[0] + this.props.force(t)*.25
    ];
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
    this.tY = [ 0, [ this.props.initialX, this.props.initialV ] ]
    this.updateRoll()
    this.setState(ShipSimulation.initialState)
  }

  step () {
    rk4Mutate(this.stepVectorFunction, this.tY, h, 100)
    if (this.tY[1][0] > MAX_X) {
      this.tY[1][0] = MAX_X
      this.setState({ capsized: true })
      this.props.onCapsize()
      this.pause()
    }

    this.updateRoll()
  }

  updateRoll () {
    this.refs.shipBlock.setX(this.tY[1][0])
  }

  render () {
    return (
      <div className="ShipSimulation">
        <ShipBlock
          ref="shipBlock"
          className="ShipSimulation-ShipBlock"
        />
        <svg
          className="ShipSimulation-CapsizeLine"
          height="200" width="100"
          style={{ transform: `rotate(${ANGLE_MULTIPLIER + MARLIN_OFFSET}deg)` }}
        >
          <line
            x1="50" y1="0"
            x2="50" y2="200"
            style={{
              stroke: 'rgb(255,0,0)',
              strokeWidth: 1
            }}
          />
        </svg>
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
  force: () => 0
}
