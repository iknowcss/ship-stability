import React, { Component } from 'react'
import Slider from 'material-ui/lib/slider'

export default class ShipForce extends Component {
  onForceChange (value) {
    console.log(value)
  }

  render () {
    return <div>
      <Slider
        ref='asdf'
        min={-1}
        max={1}
        defaultValue={0}
        onChange={(e, v) => this.onForceChange(v)}
      />
    </div>
  }
}
