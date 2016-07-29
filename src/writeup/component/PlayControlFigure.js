import React, { Component } from 'react'
import isFunction from 'lodash/isFunction'

export default class PlayControlFigure extends Component {
  constructor (initialState) {
    super()
    this.state = initialState
  }

  restart () {
    this.pause()
    if (isFunction(this.onRestart)) {
      this.onRestart()
    }
  }

  play () {
    this.setState({ play: true })
  }

  pause () {
    this.setState({ play: false })
  }
}