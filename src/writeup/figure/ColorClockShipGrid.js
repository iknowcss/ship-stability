import React, { Component } from 'react'

import './ColorClockShipGrid.less'

export default class ColorClockShipGrid extends Component {
  componentDidMount() {
    const interval = Math.PI/500;
    setInterval(() => {
      const newPhase = this.state.phase + interval;
      this.setState({
        phase: newPhase > 2*Math.PI ? newPhase - 2*Math.PI : newPhase
      });
    }, 10);

  }

  constructor () {
    super()
    this.state = ColorClockShipGrid.initialState
  }

  restart () {

  }

  render () {
    const time = 0;

    const x2 = 50 + 50*Math.sin(this.state.phase);
    const y2 = 50 - 50*Math.cos(this.state.phase);

    return (
      <div className="ColorClockShipGrid">
        <div className="ColorClock">
          <img className="ColorClock-Face" src="./color-wheel.png"/>
          <svg className="ColorClock-Hands">
            <line
              x1="50%" y1="50%"
              x2={`${x2}%`} y2={`${y2}%`}
            />
          </svg>
        </div>
      </div>
    )
  }
}

ColorClockShipGrid.initialState = {
  phase: 0
}

ColorClockShipGrid.defaultProps = {
  
}
