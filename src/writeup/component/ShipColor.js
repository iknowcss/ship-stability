import React, { Component } from 'react'
import { dhsl2drgb } from 'src/js/util/color'
import { MARLIN_OFFSET, ANGLE_MULTIPLIER } from 'src/writeup/constants'

import './ShipColor.less'
export default class ShipColor extends Component {
  shouldComponentUpdate (nextProps) {
    return nextProps.capsized !== this.props.capsized
  }

  setX (x) {
    if (!this.props.capsized) {
      this.x = x
      this.refs.ship.style.backgroundColor = this.getCurrentColor()
    }
  }

  getCurrentColor () {
    if (this.props.capsized) {
      return 'red'
    }

    const drgb = dhsl2drgb([0, 0, 0.5*this.x + 0.25])
    const rgb = drgb.map(c => Math.round(c*255))
    return `rgb(${rgb.join(',')})`
  }

  render () {
    const { size } = this.props
    let className = 'ShipColor'
    if (this.props.className) className += ' ' + this.props.className

    const style = { width: size, height: size }
    if (this.props.capsized) {
      style.backgroundColor = this.getCurrentColor()
    }

    return (
      <div
        ref="ship"
        className={className}
        style={style}
      ></div>
    )
  }
}

ShipColor.defaultProps = {
  capsized: false
}
