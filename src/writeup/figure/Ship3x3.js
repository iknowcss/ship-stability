import React, { Component } from 'react'
import Tabs from 'material-ui/lib/tabs/tabs'
import Tab from 'material-ui/lib/tabs/tab'

import ShipSimulation from 'src/writeup/component/ShipSimulation'
import PlayControl from 'src/writeup/component/PlayControl'

import './Ship3x3.less'
export default class Ship3x3 extends Component {
  constructor () {
    super()
    this.state = Ship3x3.initialState
  }

  restart () {
    this.setState({ play: false })
    for (let i = 0; i < this.shipCount; i++) {
      this.refs[`ship-${i}`].reset()
    }
  }

  render () {
    const forceFactory = p => t => p.a*Math.sin(p.w*t)

    const aDomain = { min: .2, max: .4 }
    const wDomain = { min: .8, max: 1.0 }

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
              play={this.state.play}
              force={forceFactory(params)}
              displayMode={this.state.displayMode}
            />
          </td>
        )
        this.shipCount++
      }
      rows.push(<tr key={rowIdx}>{cols}</tr>)
    }

    return (
      <div className="Ship3x3">
        <Tabs
          ref="modeTabs"
          className="Ship3x3-Mode"
          value={this.state.mode}
          onChange={newMode => this.setState({ displayMode: newMode })}
        >
          <Tab label="Ship Mode" value="ship"/>
          <Tab label="Color Mode" value="color"/>
        </Tabs>

        <table className="Ship3x3-Table"><tbody>
          {rows}
        </tbody></table>

        <PlayControl
          onPlay={() => this.setState({ play: true })}
          onPause={() => this.setState({ play: false })}
          onRestart={() => this.restart()}
        />
      </div>
    )
  }
}

Ship3x3.defaultProps = {
  width: 300,
  rows: 3,
  cols: 3
}

Ship3x3.initialState = {
  play: false,
  displayMode: 'ship'
}
