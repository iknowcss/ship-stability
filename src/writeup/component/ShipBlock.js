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

    const transformString = `rotate(${angle}deg)`
    extend(this.refs.shipBlock.style, {
      transform: transformString,
      WebkitTransform: transformString
    })
  }

  render () {
    let className = 'ShipBlock'
    if (this.props.className) className += ' ' + this.props.className
    return (
      <div ref="shipBlock" className={className}>
        <svg
          className="ShipSimulation-CapsizeLine"
          height="200" width="100"
        >
          <line
            x1="50" y1="0"
            x2="50" y2="200"
            style={{
              stroke: 'rgb(0,0,255)',
              strokeWidth: 1
            }}
            />
        </svg>
      </div>
    )
  }
}