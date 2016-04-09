import React, { Component } from 'react'
import classNames from 'classnames/bind'
import RaisedButton from 'material-ui/lib/raised-button'

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
    return (
      <div className={className}>
        <RaisedButton
          label={this.state.play ? 'Pause' : 'Play'}
          primary={!this.state.play}
          disabled={this.props.disablePlay}
          onClick={() => this.state.play ? this.pause() : this.play()}
          />
        &nbsp;
        <RaisedButton
          label="Reset"
          secondary={this.state.play}
          disabled={!this.state.started}
          onClick={() => this.restart()}
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
