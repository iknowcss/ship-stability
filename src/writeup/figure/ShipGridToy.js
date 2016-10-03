import React, { Component } from 'react'
import Card from 'material-ui/lib/card/card'

import trackVisibility from 'src/js/component/trackVisibility'
import ShipGridModeSwitch from 'src/writeup/component/ShipGridModeSwitch'
import ShipGrid from 'src/writeup/component/ShipGrid'
import GraphAxis from 'src/writeup/component/GraphAxis'
import PlayControl from 'src/writeup/component/PlayControl'

import './ShipGridToy.less'

export default class ShipGridToy extends Component {
  constructor () {
    super()
    this.state = ShipGridToy.initialState
    this.setDisplayMode = displayMode => this.setState({displayMode})
  }

  restart () {
    this.setState({ play: false })
    this.refs.shipGrid.reset()
  }

  getDisplayOptions () {
    return {
      ship: this.state.displayMode === 'ship',
      capsizeColor: true,
      phaseColor: this.state.displayMode === 'color'
    }
  }

  isPlaying () {
    if (!this.state.play) return false
    if (!this.props.pauseWhenNotVisible) return true
    return this.props.visible
  }

  render () {
    return (
      <div className="ShipGridToy">
        <Card zDepth={2}>
          <ShipGridModeSwitch
            onChange={this.setDisplayMode}
            mode={this.state.displayMode}
          />

          <GraphAxis>
            <ShipGrid
              className="ShipGridToy-Grid"
              ref="shipGrid"
              play={this.isPlaying()}
              display={this.getDisplayOptions()}
              rows={this.props.rows}
              cols={this.props.cols}
              domain={this.props.domain}
            />
          </GraphAxis>

          <PlayControl
            className="ShipGridToy-PlayControl"
            onPlay={() => this.setState({ play: true })}
            onPause={() => this.setState({ play: false })}
            onRestart={() => this.restart()}
          />
        </Card>
      </div>
    )
  }
}

ShipGridToy.defaultProps = {
  rows: 3,
  cols: 3,
  domain: {
    a: { min: 0, max: 2 },
    w: { min: 0, max: 2 }
  }
}

ShipGridToy.initialState = {
  play: false,
  displayMode: 'ship'
}

ShipGridToy.AutoPause = trackVisibility(ShipGridToy)