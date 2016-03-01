import React, { Component } from 'react'
import ShipSimulation from 'src/writeup/component/ShipSimulation'

import './ShipGrid.less'
export default class ShipGrid extends Component {
  reset () {
    for (let i = 0; i < this.shipCount; i++) {
      this.refs[`ship-${i}`].reset()
    }
  }

  render () {
    const forceFactory = p => t => p.a*Math.sin(p.w*t)

    const aDomain = { min: 0, max: 2 }
    const wDomain = { min: 0, max: 2 }

    const { rows: rowCount, cols: colCount } = this.props
    const size = this.props.width/colCount

    aDomain.step = (aDomain.max - aDomain.min)/(rowCount - 1)
    wDomain.step = (wDomain.max - wDomain.min)/(colCount - 1)

    this.shipCount = 0

    const rows = []
    for (let rowIdx = rowCount - 1; rowIdx >= 0; rowIdx--) {
      const cols = []
      for (let colIdx = 0; colIdx < colCount; colIdx++) {
        let params = {
          a: aDomain.min + rowIdx*aDomain.step,
          w: wDomain.min + colIdx*wDomain.step
        }
        cols.push(
          <td key={colIdx}>
            <ShipSimulation
              ref={`ship-${this.shipCount}`}
              size={size}
              play={this.props.play}
              force={forceFactory(params)}
              displayMode={this.props.displayMode}
            />
          </td>
        )
        this.shipCount++
      }
      rows.push(<tr key={rowIdx}>{cols}</tr>)
    }

    let className = 'ShipGrid'
    if (this.props.className) {
      className = `${className} ${this.props.className}`
    }
    return (
      <table className={className}><tbody>{rows}</tbody></table>
    )
  }
}

ShipGrid.defaultProps = {
  play: false,
  displayMode: 'ship'
}
