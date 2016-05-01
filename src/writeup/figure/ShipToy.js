import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import delay from 'lodash/delay'
import PlayControl from 'src/writeup/component/PlayControl'
import isVisible from 'src/js/util/isVisible'
import forceFactory from 'src/js/util/forceFactory'
import ShipSimulation from 'src/writeup/component/ShipSimulation'

const {setInterval, clearInterval} = window

const AUTO_REPLAY_DELAY = 3000
const IS_VISIBLE_INTERVAL = 200

import './ShipToy.less'
export default class ShipToy extends Component {
  constructor () {
    super()
    this.state = ShipToy.initialState
  }

  restartShipSimulation (active = false) {
    const { capsized } = ShipToy.initialState
    this.setState({ capsized, active })
    this.refs.shipSimulation.reset()
  }

  componentDidMount () {
    this.isVisibleInterval = setInterval(() => this.updateVisibility(), IS_VISIBLE_INTERVAL)
    this.updateVisibility();
  }

  componentWillUnmount () {
    clearInterval(this.isVisibleInterval);
  }

  componentWillUpdate (nextProps, nextState) {
    if (this.state.capsized === false && nextState.capsized === true) {
      this.handleNewCapsize()
    }
  }

  updateVisibility () {
    if (this.props.pauseOutOfView) {
      this.setState({
        isVisible: isVisible(this.refs.container)
      })
    } else if (!this.state.isVisible) {
      this.setState({isVisible: true})
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
    if (!this.props.pauseOutOfView) return true
    return this.state.isVisible
  }

  render () {
    const { a, w } = this.props.simulationParams

    return (
      <div className="ShipToy" ref="container">
        <ShipSimulation
          className="ShipToy-ShipSimulation"
          ref="shipSimulation"
          play={this.isPlaying()}
          onCapsize={() => this.setState({ capsized: true })}
          display={this.props.display}
          force={forceFactory({ a, w })}
          size={150}
        />
      </div>
    )
  }
}

ShipToy.initialState = {
  active: true,
  capsized: false,
  isVisible: false
}
