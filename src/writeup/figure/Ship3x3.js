import React, { Component } from 'react'

import ShipSimulation from 'src/writeup/component/ShipSimulation'

import './Ship3x3.less'
export default class Ship3x3 extends Component {
  render () {
    return (
      <div className="Ship3x3">
        <ShipSimulation/>
      </div>
    )
  }
}
