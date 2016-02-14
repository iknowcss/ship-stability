import React, { Component } from 'react'
import extend from 'lodash/extend'
import { MARLIN_OFFSET, ANGLE_MULTIPLIER } from 'src/writeup/constants'

import 'src/writeup/ShipBlock.less'
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

    const transformString = `rotate(${angle}deg)`
    extend(this.refs.shipBlock.style, {
      transform: transformString,
      WebkitTransform: transformString
    })
  }

  render () {
    return <div ref="shipBlock" className="ShipBlock"></div>
  }
}