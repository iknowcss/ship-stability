import React, { Component } from 'react'
import Markdown from 'react-remarkable'

import content from 'raw!src/writeup/paragraph/content.md'

const MD_OPTIONS = {
  typographer: true,
  breaks: true,
  html: true
}

export default class Writeup extends Component {
  render () {
    return (
      <div>
        <Markdown options={MD_OPTIONS} source={content}></Markdown>
      </div>
    )
  }
}