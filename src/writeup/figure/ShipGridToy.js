import React, { Component } from 'react'
import Card from 'material-ui/lib/card/card'
import Toggle from 'material-ui/lib/toggle'
import IconButton from 'material-ui/lib/icon-button'
import classnames from 'classnames'

import ShipGrid from 'src/writeup/component/ShipGrid'
import GraphAxis from 'src/writeup/component/GraphAxis'
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

  getDisplayOptions () {
    return {
      ship: this.state.displayMode === 'ship',
      capsizeColor: true,
      phaseColor: this.state.displayMode === 'color'
    }
  }

  render () {
    const iconButtonStyles = { height: '60px', width: '60px' }

    return (
      <div className="ShipGridToy">
        <Card zDepth={2}>
          <div className="ShipGridToy-Mode">
            <IconButton
              iconClassName={classnames('mi mi-directions-boat', { 'ShipGridToy-Mode-Icon--active': this.state.displayMode === 'ship' })}
              tooltipPosition="bottom-center"
              style={iconButtonStyles}
              onClick={() => this.setState({ displayMode: 'ship' })}
            />
            <div className="ShipGridToy-Mode-Toggle">
              <Toggle
                onToggle={() => this.setState({
                  displayMode: this.state.displayMode === 'ship' ? 'color' : 'ship'
                })}
                toggled={this.state.displayMode === 'color'}
              />
            </div>
            <IconButton
              iconClassName={classnames('mi mi-grid-on', { 'ShipGridToy-Mode-Icon--active': this.state.displayMode === 'color' })}
              tooltipPosition="bottom-center"
              style={iconButtonStyles}
              onClick={() => this.setState({ displayMode: 'color' })}
            />
          </div>

          <GraphAxis>
            <ShipGrid
              className="ShipGridToy-Grid"
              ref="shipGrid"
              play={this.state.play}
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
