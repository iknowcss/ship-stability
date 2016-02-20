import React, { Component } from 'react'
import Markdown from 'react-remarkable'
import Latex from 'react-latex'

import ShipForce from 'src/writeup/figure/ShipForce'
import Ship3x3 from 'src/writeup/figure/Ship3x3'
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
        <Ship3x3/>
        <hr/>
        {/*<ShipForce/>
        <hr/>*/}
        <Markdown
          options={MD_OPTIONS}
          source={content}
        />
      </div>
    )
  }
}