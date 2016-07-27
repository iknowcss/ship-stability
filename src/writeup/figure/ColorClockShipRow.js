import React, { Component, PropTypes } from 'react'
import forceFactory from 'src/js/util/forceFactory'
import AnimationPool from 'src/js/util/AnimationPool'
import ColorClock from 'src/writeup/component/ColorClock'
import ShipSimulation from 'src/writeup/component/ShipSimulation'

import './ColorClockShipRow.less'

export default class ColorClockShipGrid extends Component {
  constructor () {
    super()
    this.state = ColorClockShipGrid.initialState
  }

  componentWillMount() {
    this.animationPool = new AnimationPool()
    this.animationPool.on('flush', () => this.handleAnimationFlush());
    this.foo = 0;
  }

  componentDidMount() {
  }

  handleAnimationFlush() {
    this.refs.colorClock.setPhase((++this.foo)/100);
  }

  reset () {
    // for (let i = 0; i < this.shipCount; i++) {
    //   this.refs[`ship-${i}`].reset()
    // }
  }

  restart () {

  }

  render () {
    const params = {
      a: this.props.domain.a,
      w: this.props.domain.w.min
    }

    const ships = [
      (
        <ShipSimulation
          animationPool={this.animationPool}
          ref={`ship-${0}`}
          play={this.props.play}
          force={forceFactory(params)}
          display={this.props.display}
        />
      )
    ];

    return (
      <div className="ColorClockShipGrid">
        <ColorClock
          ref="colorClock"
        />
        <div>
          {ships.map((ship, i) => (
            <div
              key={i}
              style={{
                width: 50,
                height: 50
              }}
            >
              {ship}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

ColorClockShipGrid.propTypes = {
  play: PropTypes.bool,
  display: PropTypes.object,
  domain: PropTypes.shape({
    a: PropTypes.number.isRequired,
    w: PropTypes.shape({
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired
    }).isRequired
  }).isRequired
}

ColorClockShipGrid.defaultProps = {
  play: true,
  display: {
    ship: true,
    capsizeColor: true,
    phaseColor: false
  }
}
