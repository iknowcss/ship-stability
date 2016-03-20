import React, { Component } from 'react'
import ShipBlock from 'src/writeup/component/ShipBlock'
import ShipColor from 'src/writeup/component/ShipColor'
import { rk4Mutate } from 'src/js/util/rk4'
import { b, w, a, h } from 'src/js/standard-coefficients'
import { MARLIN_OFFSET, ANGLE_MULTIPLIER, MAX_X } from 'src/writeup/constants'

const intervalDefer = window.requestAnimationFrame
const cancelIntervalDefer = window.cancelAnimationFrame

const VALID_DISPLAY_MODES = ['ship', 'color', 'hybrid']

import './ShipSimulation.less'
export default class ShipSimulation extends Component {
  constructor () {
    super()
    this.state = ShipSimulation.initialState

    this.stepVectorFunction = [
      (t, Y) => Y[1],
      (t, Y) => -b*Y[1] - Y[0] + Y[0]*Y[0] + this.props.force(t)
    ];
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      this.props.displayMode !== nextProps.displayMode ||
      this.state.capsized !== nextState.capsized
    )
  }

  componentDidUpdate (prevProps) {
    this.updateRoll()
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
    rk4Mutate(this.stepVectorFunction, this.tY, h, 20)
    if (this.tY[1][0] > MAX_X) {
      this.tY[1][0] = MAX_X
      this.setState({ capsized: true, capsizeTime: this.tY[0] })
      this.props.onCapsize()
      this.pause()
    }

    this.updateRoll()
  }

  updateRoll () {
    const x = this.tY[1][0]
    if (this.refs.shipColor) {
      this.refs.shipColor.setX(x)
    }
    if (this.refs.shipBlock) {
      this.refs.shipBlock.setX(x)
    }
  }

  renderCapsizeLine () {
    const { size } = this.props
    return (
      <svg
        className="ShipSimulation-CapsizeLine"
        height={size} width={size}
        style={{
          transform: `rotate(${ANGLE_MULTIPLIER + MARLIN_OFFSET}deg) translate3d(0, -10%, 0)` }}
        >
        <line
          x1={size/2} y1="0"
          x2={size/2} y2={size}
          style={{
            stroke: 'rgb(255,0,0)',
            strokeWidth: 1
          }}
        />
      </svg>
    )
  }

  getTrueDisplayMode () {
    if (this.props.displayMode) {
      const lower = this.props.displayMode.toLowerCase()
      if (VALID_DISPLAY_MODES.indexOf(lower) >= 0) {
        return lower
      }
    }
    return 'ship'
  }

  render () {
    const { size } = this.props

    let shipBlock = null
    let capsizeLine = null
    let shipColor = null
    const displayMode = this.getTrueDisplayMode()

    if (displayMode === 'ship' || displayMode === 'hybrid') {
      shipBlock = (
        <ShipBlock
          ref="shipBlock"
          className="ShipSimulation-ShipBlock"
          size={this.props.size}
          tiltLine={this.props.tiltLine}
          />
      )
      if (this.props.capsizeLine) {
        capsizeLine = this.renderCapsizeLine()
      }
    }

    if (displayMode === 'color' || displayMode === 'hybrid') {
      shipColor = (
        <ShipColor
          ref="shipColor"
          className="ShipSimulation-ShipColor"
          capsized={this.state.capsized}
          capsizeTime={this.state.capsizeTime}
          size={this.props.size}
          phaseColor={this.props.phaseColor}
        />
      )
    }

    return (
      <div
        className="ShipSimulation"
        style={{ height: size, width: size }}
      >
        {shipColor}
        {shipBlock}
        {capsizeLine}
      </div>
    )
  }
}

ShipSimulation.initialState = {
  capsized: false,
  capsizeTime: -1
}

ShipSimulation.defaultProps = {
  displayMode: 'ship',
  initialX: 0,
  initialV: 0,
  capsizeLine: false,
  tiltLine: false,
  size: 200,
  onPlay: () => {},
  onPause: () => {},
  onCapsize: () => {},
  force: () => 0
}
