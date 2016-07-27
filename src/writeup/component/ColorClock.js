import React, { Component } from 'react'

import './ColorClock.less'

export default class ColorClock extends Component {
  shouldComponentUpdate () {
    return false
  }

  setPhase(phase) {
    const x2 = 50*(1 + Math.sin(phase))
    const y2 = 50*(1 - Math.cos(phase))
    this.refs.clockHand.setAttribute('x2', x2)
    this.refs.clockHand.setAttribute('y2', y2)
  }


  render() {
    return (
      <div className="ColorClock">
        <img className="ColorClock-Face" src="./color-wheel.png"/>
        <svg className="ColorClock-Hands">
          <line
            ref="clockHand"
            x1="50%" y1="50%"
            x2="50%" y2="0%"
          />
        </svg>
      </div>
    )
  }
}
