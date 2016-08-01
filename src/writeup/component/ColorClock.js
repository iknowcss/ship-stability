import React, { Component } from 'react'
import classnames from 'classnames'
import { dhsl2drgb, colorVec2Str } from 'src/js/util/color'

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

    const cycle = phase/(2*Math.PI)
    this.refs.clockSwatch.setAttribute('fill', colorVec2Str(dhsl2drgb([cycle, 1, 0.5])))
  }


  render() {
    const className = classnames('ColorClock', this.props.className)
    return (
      <div className={className}>
        <img className="ColorClock-Face" src="./color-wheel.png"/>
        <svg className="ColorClock-Hands">
          <line
            ref="clockHand"
            x1="50%" y1="50%"
            x2="50%" y2="0%"
          />
          <circle
            ref="clockSwatch"
            cx="50" cy="50" r="20"
          />
        </svg>
      </div>
    )
  }
}
