import React, { Component } from 'react'
import Tabs from 'material-ui/lib/tabs/tabs'
import Tab from 'material-ui/lib/tabs/tab'

import ShipGrid from 'src/writeup/component/ShipGrid'
import PlayControl from 'src/writeup/component/PlayControl'

import './ShipGridToy.less'
export default class ShipGridToy extends Component {
  constructor () {
    super()
    this.state = ShipGridToy.initialState
  }

  restart () {
    this.setState({ play: false })
    this.refs.shipGrid.reset()
  }

  render () {
    return (
      <div className="ShipGridToy">
        <Tabs
          ref="modeTabs"
          className="ShipGridToy-Mode"
          value={this.state.mode}
          onChange={newMode => this.setState({ displayMode: newMode })}
        >
          <Tab label="Ship" value="ship"/>
          <Tab label="Color" value="color"/>
          <Tab label="Hybrid" value="hybrid"/>
        </Tabs>

        <div className="ShipGridToy-Graph">
          <ShipGrid
            className="ShipGridToy-Graph-Grid"
            ref="shipGrid"
            play={this.state.play}
            displayMode={this.state.displayMode}
            width={300}
            rows={this.props.rows}
            cols={this.props.cols}
          />
          <div className="ShipGridToy-Graph-AxisW">
            <span className="ShipGridToy-Graph-AxisW-Label-High">High frequency</span>
            <span className="ShipGridToy-Graph-AxisW-Label-Low">Low frequency</span>
          </div>
          <div className="ShipGridToy-Graph-AxisA">
            <span className="ShipGridToy-Graph-AxisA-Label-Low">Low amplitude</span>
            <span className="ShipGridToy-Graph-AxisA-Label-High">High amplitude</span>
          </div>
        </div>

        <PlayControl
          onPlay={() => this.setState({ play: true })}
          onPause={() => this.setState({ play: false })}
          onRestart={() => this.restart()}
        />
      </div>
    )
  }
}

ShipGridToy.defaultProps = {
  rows: 3,
  cols: 3
}

ShipGridToy.initialState = {
  play: false,
  displayMode: 'ship'
}
