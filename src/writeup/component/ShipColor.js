import React, { Component } from 'react'
import classnames from 'classnames'
import { dhsl2drgb, colorVec2Str } from 'src/js/util/color'
import { MARLIN_OFFSET, ANGLE_MULTIPLIER } from 'src/writeup/constants'
import './ShipColor.less'

const PINK_COLOR = '#ff4081';
const TRANSPARENT_COLOR = 'rgba(255, 255, 255, 0.01)'; // iPhone doesn't like when this is fully transparent

export default class ShipColor extends Component {
  shouldComponentUpdate (nextProps) {
    return (
      nextProps.capsized !== this.props.capsized ||
      nextProps.phaseColor !== this.props.phaseColor ||
      nextProps.capsizeTimeColor !== this.props.capsizeTimeColor
    )
  }

  setX (x) {
    if (!this.props.capsized) {
      this.x = x
      this.refs.ship.style.backgroundColor = this.getCurrentColor()
    }
  }

  getCurrentColor () {
    if (this.props.capsized) {
      if (this.props.capsizeTimeColor) {
        const cycles = this.props.capsizeTime/(200*1000*Math.pow(2, -11));
        const drgb = dhsl2drgb([cycles%1, 1, 0.5])
        return colorVec2Str(drgb)
      }
      return PINK_COLOR
    }

    if (this.props.phaseColor) {
      const drgb = dhsl2drgb([0, 0, 0.5 * this.x + 0.25])
      return colorVec2Str(drgb)
    }

    return TRANSPARENT_COLOR
  }

  render () {
    let className = classnames('ShipColor', this.props.className);

    const style = {
      width: '100%',
      height: '100%',
      backgroundColor: this.getCurrentColor()
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
  capsized: false,
  phaseColor: true,
  capsizeTimeColor: false,
  capsizeTime: 0
}
