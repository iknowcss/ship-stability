import React, { Component } from 'react'
import Tabs from 'material-ui/lib/tabs/tabs'
import Tab from 'material-ui/lib/tabs/tab'
import Card from 'material-ui/lib/card/card'
import Toggle from 'material-ui/lib/toggle'
import IconButton from 'material-ui/lib/icon-button'
import classnames from 'classnames'

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
              tooltip="Ship"
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
              iconClassName={classnames('mi mi-palette', { 'ShipGridToy-Mode-Icon--active': this.state.displayMode === 'color' })}
              tooltip="Color"
              tooltipPosition="bottom-center"
              style={iconButtonStyles}
              onClick={() => this.setState({ displayMode: 'color' })}
            />
          </div>

          <div className="ShipGridToy-Graph">
            <div className="ShipGridToy-Graph-AxisA">
              <span className="ShipGridToy-Graph-AxisA-Label">Increasing amplitude</span>
            </div>
            <ShipGrid
              className="ShipGridToy-Graph-Grid"
              ref="shipGrid"
              play={this.state.play}
              display={this.getDisplayOptions()}
              width={300}
              rows={this.props.rows}
              cols={this.props.cols}
              domain={this.props.domain}
            />
            <div className="ShipGridToy-Graph-AxisW">
              <span className="ShipGridToy-Graph-AxisW-Label">Increasing frequency</span>
            </div>
          </div>

          <PlayControl
            className="ShipGridToy-PlayControl"
            onPlay={() => this.setState({ play: true })}
            onPause={() => this.setState({ play: false })}
            onRestart={() => this.restart()}
          />
        </Card>

        {/*<Tabs
          ref="modeTabs"
          className="ShipGridToy-Mode"
          value={this.state.mode}
          onChange={newMode => this.setState({ displayMode: newMode })}
          >
          <Tab label="Ship" value="ship"/>
          <Tab label="Color" value="color"/>
        </Tabs>*/}
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
