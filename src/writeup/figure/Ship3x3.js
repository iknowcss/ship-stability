import React, { Component } from 'react'

import ShipSimulation from 'src/writeup/component/ShipSimulation'

import './Ship3x3.less'
export default class Ship3x3 extends Component {
  constructor () {
    super()
    this.state = { play: false }
    setTimeout(() => {
      this.setState({ play: true })
    }, 200)
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

    return (
      <table className="Ship3x3"><tbody>
        {forceParams.map((row, i) => {
          return <tr key={i}>
            {row.map((params, j) => {
              return <td key={j}>
                <ShipSimulation {...{size, play, force: forceFactory(params)}}/>
              </td>
            })}
          </tr>
        })}
      </tbody></table>
    )
  }
}
