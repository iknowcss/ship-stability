import React, { Component } from 'react'
import classNames from 'classnames/bind'
import IconButton from 'material-ui/lib/icon-button'

import './PlayControl.less';

export default class PlayControls extends Component {
  constructor () {
    super()
    this.state = PlayControls.initialState
  }

  play () {
    this.setState({ play: true, started: true })
    this.props.onPlay()
  }

  pause () {
    this.setState({ play: false })
    this.props.onPause()
  }

  restart () {
    this.setState(PlayControls.initialState)
    this.props.onRestart()
  }

  render () {
    const className = classNames('PlayControls', this.props.className)
    const iconButtonStyles = { height: '60px', width: '60px' }
    return (
      <div className={className}>
        <IconButton
          iconClassName={`mi mi-${this.state.play ? 'pause' : 'play-arrow'}`}
          //tooltip={this.state.play ? 'Pause' : 'Play'}
          tooltipPosition="top-center"
          disabled={this.props.disablePlay}
          onClick={() => this.state.play ? this.pause() : this.play()}
          style={iconButtonStyles}
        />
        <IconButton
          iconClassName="mi mi-refresh"
          //tooltip="Reset"
          tooltipPosition="top-center"
          disabled={!this.state.started}
          onClick={() => this.restart()}
          style={iconButtonStyles}
        />
      </div>
    )
  }
}

PlayControls.defaultProps = {
  disablePlay: false,
  onPlay: () => {},
  onPause: () => {},
  onRestart: () => {}
}

PlayControls.initialState = {
  play: false,
  started: false,
  playDisabled: false
}
