import React, { Component } from 'react'
import { MARLIN_OFFSET, ANGLE_MULTIPLIER } from 'src/writeup/constants'

import './ShipBlock.less'

const IS_WEBKIT = 'WebkitAppearance' in document.documentElement.style
const TRANSFORM_STYLE_PROP = IS_WEBKIT ? 'WebkitTransform' : 'transform'

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

    this.refs.shipBlock.style[TRANSFORM_STYLE_PROP] = `rotate(${angle}deg) translate3d(0, -10%, 0)`
  }

  render () {
    let className = 'ShipBlock'
    if (this.props.className) className += ' ' + this.props.className
    return (
      <div
        ref="shipBlock"
        className={className}
      >
        <div className="ShipBlock-ImgFrame">
          <img src="./dist/ship.png"/>
        </div>
      </div>
    )
  }
}

