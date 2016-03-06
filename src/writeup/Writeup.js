import React, { Component } from 'react'
import Markdown from 'react-remarkable'
import Latex from 'react-latex'

import ShipForce from 'src/writeup/figure/ShipForce'
import ShipGridToy from 'src/writeup/figure/ShipGridToy'
import FractalCanvasToy from 'src/writeup/figure/FractalCanvasToy'
import content from 'raw!src/writeup/paragraph/content.md'

const MD_OPTIONS = {
  typographer: true,
  breaks: true,
  html: true
}

export default class Writeup extends Component {
  render () {
    const domain = {
      a: { min: .05, max: .1 },
      w: { min: .8, max: 1.0 }
    }

    return (
      <div>
        <ShipGridToy
          cols={5}
          rows={5}
          domain={domain}
        />
        <FractalCanvasToy
          domain={domain}
          scale={3}
          pixelate={true}
          />
        <FractalCanvasToy
          domain={domain}
          scale={5}
          pixelate={true}
          />
        <FractalCanvasToy
          domain={domain}
          scale={9}
          />
        {/*
        <ShipGridToy cols={3} rows={3}/>
        <hr/>
        <ShipGridToy cols={5} rows={5}/>
        <hr/>
        <ShipForce/>
        <hr/>
        */}
        <Markdown
          options={MD_OPTIONS}
          source={content}
        />
      </div>
    )
  }
}