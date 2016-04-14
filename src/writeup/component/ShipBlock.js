import React, { Component } from 'react'
import extend from 'lodash/extend'
import { MARLIN_OFFSET, ANGLE_MULTIPLIER } from 'src/writeup/constants'

import './ShipBlock.less'
export default class ShipBlock extends Component {
  shouldComponentUpdate () {
    return false
  }

  setX (x) {
    let angle = x*ANGLE_MULTIPLIER + MARLIN_OFFSET
    if (angle > 90) {
      angle = 90
    } else if (angle < -90) {
      angle = -90
    }

    const transformString = `rotate(${angle}deg) translate3d(0, -10%, 0)`
    extend(this.refs.shipBlock.style, {
      transform: transformString,
      WebkitTransform: transformString
    })
  }

  render () {
    const size = 10;

    let className = 'ShipBlock'
    if (this.props.className) className += ' ' + this.props.className
    return (
      <div
        ref="shipBlock"
        className={className}
      >
        <svg className="ShipBlock-Svg">
          <rect
            x="30%" y="40%"
            width="40%" height="60%"
          />
        </svg>
      </div>
    )
  }
}

