import React, { Component } from 'react'

import ShipSimulation from 'src/writeup/component/ShipSimulation'
import PlayControl from 'src/writeup/component/PlayControl'

import './Ship3x3.less'
export default class Ship3x3 extends Component {
  constructor () {
    super()
    this.state = Ship3x3.initialState
  }

  restart () {
    this.setState(Ship3x3.initialState)
    for (let i = 0; i < this.shipCount; i++) {
      this.refs[`ship-${i}`].reset()
    }
  }

  render () {
    const size = 100
    const play = this.state.play
    const forceParams = [
      [{ a: .40, w: .8 }, { a: .40, w: 0.9 }, { a: .40, w: 1.0 }],
      [{ a: .30, w: .8 }, { a: .30, w: 0.9 }, { a: .30, w: 1.0 }],
      [{ a: .20, w: .8 }, { a: .20, w: 0.9 }, { a: .20, w: 1.0 }]
    ]
    const forceFactory = p => t => p.a*Math.sin(p.w*t)

    this.shipCount = 0
    return (
      <div className="Ship3x3">
        <table className="Ship3x3-Table"><tbody>
          {forceParams.map((row, i) => (
            <tr key={i}>
              {row.map((params, j) => (
                <td key={j}>
                  <ShipSimulation
                    ref={`ship-${this.shipCount++}`}
                    size={size}
                    play={this.state.play}
                    force={forceFactory(params)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody></table>

        <PlayControl
          onPlay={() => this.setState({ play: true })}
          onPause={() => this.setState({ play: false })}
          onRestart={() => this.restart()}
        />
      </div>
    )
  }
}

Ship3x3.initialState = {
  play: false
}
