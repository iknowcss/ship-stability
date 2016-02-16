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
    const { size } = this.props
    let className = 'ShipBlock'
    if (this.props.className) className += ' ' + this.props.className
    return (
      <div
        ref="shipBlock"
        className={className}
        style={{ width: size, height: size }}
      >
        <svg style={{ width: size, height: size }}>
          <rect
            x={size/4} y={size*0.25}
            width={size/2} height={size*.75}
          />
          {this.props.tiltLine ? (
            <line
              x1={size/2} y1="0"
              x2={size/2} y2={size}
              style={{
                stroke: 'rgb(0,0,255)',
                strokeWidth: 1
              }}
            />
          ) : null}
        </svg>
      </div>
    )
  }
}

ShipBlock.defaultProps = {
  tiltLine: false
}
