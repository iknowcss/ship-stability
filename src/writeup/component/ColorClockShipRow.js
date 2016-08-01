import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import { dhsl2drgb, colorVec2Str } from 'src/js/util/color'
import forceFactory from 'src/js/util/forceFactory'
import AnimationPool from 'src/js/util/AnimationPool'
import ColorClock from 'src/writeup/component/ColorClock'
import ShipSimulation from 'src/writeup/component/ShipSimulation'
import { h as HJ } from 'src/js/standard-coefficients'

import './ColorClockShipRow.less'

const FSTEPS_PER_FIT = 200
const FITS_PER_COLOR_CYCLE = 1000
const HF = Math.pow(2, -11)
const JSTEPS_PER_COLOR_CYCLE = FSTEPS_PER_FIT*FITS_PER_COLOR_CYCLE*HF/HJ

export default class ColorClockShipRow extends Component {
  componentWillMount() {
    this.animationPool = new AnimationPool()
    this.animationPool.on('flush', () => this.handleAnimationFlush())
  }

  componentDidMount() {
    this.animationPool.completeRegistration()
    this.reset()
  }

  getCycle() {
    return ((this.iterations + 1)*2/JSTEPS_PER_COLOR_CYCLE)%1
  }

  handleAnimationFlush() {
    this.iterations++
    this.updateClock()
  }

  updateClock() {
    const cycle = this.getCycle()
    const phase = cycle*2*Math.PI
    this.refs.colorClock.setPhase(phase)
    this.refs.currentTimeSwatch.style.backgroundColor = colorVec2Str(dhsl2drgb([cycle, 1, 0.5]))
  }

  reset () {
    this.animationPool.resetRegisteredShips()
    this.animationPool.reset()
    this.iterations = 0
    this.updateClock()
  }

  render () {
    const display = {
      ship: true,
      capsizeColor: true,
      phaseColor: false,
      capsizeTimeColor: true
    }

    const ships = this.props.testPoints.map(({a, w}, i) => (
      <ShipSimulation
        animationPool={this.animationPool}
        ref={`ship-${i}`}
        play={this.props.play}
        force={forceFactory({a, w})}
        display={display}
      />
    ))

    const className = classnames('ColorClockShipRow', this.props.className)

    return (
      <div className={className}>
        <div className="ColorClockShipRow-ColorClockContainer">
          <ColorClock
            className="ColorClockShipRow-ColorClock"
            ref="colorClock"
          />
          <div className="ColorClockShipRow-SwatchContainer">
            
            <div
              className="ColorClockShipRow-Swatch"
              ref="currentTimeSwatch"
            ></div>
          </div>
        </div>
        <div className="ColorClockShipRow-ShipsContainer">

          {ships.map((ship, i) => (
            <div className="ColorClockShipRow-SimulationContainer" key={i}>
              {ship}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

ColorClockShipRow.propTypes = {
  play: PropTypes.bool,
  testPoints: PropTypes.array.isRequired
}

ColorClockShipRow.defaultProps = {
  play: false
}
