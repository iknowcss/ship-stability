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
      [{ a: .99, w: 0.4 }, { a: .99, w: 0.8 }, { a: .99, w: 1.2 }],
      [{ a: .66, w: 0.4 }, { a: .66, w: 0.8 }, { a: .66, w: 1.2 }],
      [{ a: .33, w: 0.4 }, { a: .33, w: 0.8 }, { a: .33, w: 1.2 }]
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
