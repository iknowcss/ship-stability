import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import delay from 'lodash/delay'
import PlayControl from 'src/writeup/component/PlayControl'
import forceFactory from 'src/js/util/forceFactory'
import ShipSimulation from 'src/writeup/component/ShipSimulation'
import trackVisibility from 'src/js/component/trackVisibility'

const AUTO_REPLAY_DELAY = 3000

import './ShipToy.less'
export default class ShipToy extends Component {
  constructor () {
    super()
    this.state = ShipToy.initialState
  }

  restartShipSimulation (active = false) {
    const { capsized } = ShipToy.initialState
    this.refs.shipSimulation.reset()
    this.setState({ capsized, active })
  }

  componentWillUpdate (nextProps, nextState) {
    if (this.state.capsized === false && nextState.capsized === true) {
      this.handleNewCapsize()
    }
  }

  handleNewCapsize () {
    if (this.props.autoReplay && !this.pendingAutoReplay) {
      this.pendingAutoReplay = delay(() => {
        if (this.props.autoReplay) {
          this.restartShipSimulation(true)
        }
        delete this.pendingAutoReplay
      }, AUTO_REPLAY_DELAY)
    }
  }

  isPlaying () {
    if (!this.state.active) return false
    if (!this.props.pauseWhenNotVisible) return true
    return this.props.visible
  }

  render () {
    const {a, w} = this.props.simulationParams

    return (
      <div className="ShipToy">
        <ShipSimulation
          className="ShipToy-ShipSimulation"
          ref="shipSimulation"
          play={this.isPlaying()}
          onCapsize={() => this.setState({capsized: true})}
          display={this.props.display}
          force={forceFactory({a, w})}
          size={150}
        />
      </div>
    )
  }
}

ShipToy.initialState = {
  active: true,
  capsized: false
}

ShipToy.AutoPause = trackVisibility(ShipToy)