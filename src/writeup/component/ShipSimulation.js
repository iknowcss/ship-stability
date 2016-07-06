import React, { Component, PropTypes } from 'react'
import isEqual from 'lodash/isEqual'
import classNames from 'classnames/bind'
import AnimationPool from 'src/js/util/AnimationPool'
import ShipBlock from 'src/writeup/component/ShipBlock'
import ShipColor from 'src/writeup/component/ShipColor'
import { b, w, a, h } from 'src/js/standard-coefficients'
import { MARLIN_OFFSET, ANGLE_MULTIPLIER, MAX_X } from 'src/writeup/constants'

const {rk4Mutate}  = window.rk4

const SIM_SPEED = 10

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
      !isEqual(this.props.display, nextProps.display) ||
      this.state.capsized !== nextState.capsized
    )
  }

  componentDidUpdate () {
    this.updateRoll()
  }

  componentDidMount () {
    this.registerWithAnimationPool(this.props.animationPool)
    this.reset()
    this.setPlayback(this.props.play)
  }

  componentWillReceiveProps (nextProps) {
    this.setPlayback(nextProps.play)
  }

  onComponentWillUnmount () {
    this.pause()
  }

  registerWithAnimationPool(animationPool = new AnimationPool()) {
    this.animationPool = animationPool
    animationPool.register(this)
  }

  setPlayback (play) {
    const flushing = this.animationPool.isFlushing()
    if (play && !flushing) {
      this.renderNext()
    } else if (!play && flushing) {
      this.pause()
    }
  }

  pause () {
    this.animationPool.blockFlush()
  }

  renderNext () {
    if (this.state.capsized) {
      this.animationPool.disableShip(this)
    } else {
      this.animationPool.queue(this)
    }
  }

  reset () {
    this.tY = [ 0, [ this.props.initialX, this.props.initialV ] ]
    this.updateRoll()
    this.setState(ShipSimulation.initialState)
    this.animationPool.reset()
  }

  step () {
    rk4Mutate(this.stepVectorFunction, this.tY, h, SIM_SPEED/(h*100))
    if (this.tY[1][0] > MAX_X) {
      this.tY[1][0] = MAX_X
      this.setState({ capsized: true, capsizeTime: this.tY[0] })
      this.props.onCapsize()
      this.pause()
    }

    return this.tY[1][0]
  }

  updateRoll (x = this.tY[1][0]) {
    if (this.refs.shipColor) {
      this.refs.shipColor.setX(x)
    }
    if (this.refs.shipBlock) {
      this.refs.shipBlock.setX(x)
    }
  }

  render () {
    const { size, display } = this.props

    let shipBlock = null
    let shipColor = null

    if (display.ship) {
      shipBlock = (
        <ShipBlock
          ref="shipBlock"
          className="ShipSimulation-ShipBlock"
          tiltLine={this.props.tiltLine}
        />
      )
    }

    if (display.capsizeColor || display.phaseColor) {
      shipColor = (
        <ShipColor
          ref="shipColor"
          className="ShipSimulation-ShipColor"
          capsized={this.state.capsized}
          capsizeTime={this.state.capsizeTime}
          phaseColor={display.phaseColor}
        />
      )
    }

    const className = classNames('ShipSimulation', this.props.className, {
      'ShipSimulation-ShipMode': display.ship
    })
    
    let dimensions;
    if (size) {
      dimensions = { height: size, width: size }
    } else {
      dimensions = { height: '100%', width: '100%' }
    }

    return (
      <div
        className={className}
        style={dimensions}
      >
        {shipColor}
        {shipBlock}
      </div>
    )
  }
}

ShipSimulation.initialState = {
  capsized: false,
  capsizeTime: -1
}

ShipSimulation.defaultProps = {
  initialX: 0,
  initialV: 0,
  tiltLine: false,
  onPlay: () => {},
  onPause: () => {},
  onCapsize: () => {},
  force: () => 0
}

ShipSimulation.propTypes = {
  animationPool: PropTypes.object,
  display: PropTypes.shape({
    ship: PropTypes.bool,
    capsizeColor: PropTypes.bool,
    phaseColor: PropTypes.bool
  }).isRequired,
  size: PropTypes.number
}