import React, { Component, PropTypes } from 'react'
import forceFactory from 'src/js/util/forceFactory'
import AnimationPool from 'src/js/util/AnimationPool'
import ShipSimulation from 'src/writeup/component/ShipSimulation'

import './ShipGrid.less'
export default class ShipGrid extends Component {
  componentWillMount() {
    this.animationPool = new AnimationPool()
  }

  componentDidMount() {
    const {rows, cols} = this.props
    this.animationPool.completeRegistration()
  }

  reset () {
    this.animationPool.resetRegisteredShips()
    this.animationPool.reset()
  }

  render () {
    const { a: aDomain, w: wDomain } = this.props.domain
    const { rows: rowCount, cols: colCount } = this.props
    const scalePerc = `${(100/colCount).toFixed(2)}%`

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
          <td key={colIdx} width={scalePerc} height={scalePerc}>
            <ShipSimulation
              animationPool={this.animationPool}
              ref={`ship-${this.shipCount}`}
              play={this.props.play}
              force={forceFactory(params)}
              display={this.props.display}
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
  display: {
    ship: true,
    capsizeColor: true,
    phaseColor: false
  }
}

ShipGrid.propTypes = {
  play: PropTypes.bool,
  display: PropTypes.object,
  domain: PropTypes.shape({
    a: PropTypes.shape({
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired
    }).isRequired,
    w: PropTypes.shape({
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired
    }).isRequired
  }).isRequired
}
