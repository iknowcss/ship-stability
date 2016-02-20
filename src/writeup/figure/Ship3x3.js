import React, { Component } from 'react'
import Tabs from 'material-ui/lib/tabs/tabs'
import Tab from 'material-ui/lib/tabs/tab'

import ShipGrid from 'src/writeup/component/ShipGrid'
import PlayControl from 'src/writeup/component/PlayControl'

import './Ship3x3.less'
export default class Ship3x3 extends Component {
  constructor () {
    super()
    this.state = Ship3x3.initialState
  }

  restart () {
    this.setState({ play: false })
    this.refs.shipGrid.reset()
  }

  render () {
    return (
      <div className="Ship3x3">
        <Tabs
          ref="modeTabs"
          className="Ship3x3-Mode"
          value={this.state.mode}
          onChange={newMode => this.setState({ displayMode: newMode })}
        >
          <Tab label="Ship" value="ship"/>
          <Tab label="Color" value="color"/>
          <Tab label="Hybrid" value="hybrid"/>
        </Tabs>

        <ShipGrid
          ref="shipGrid"
          play={this.state.play}
          displayMode={this.state.displayMode}
          rows={3}
          cols={3}
        />

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
