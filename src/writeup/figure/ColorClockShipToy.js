import React, { PropTypes } from 'react'
import Card from 'material-ui/lib/card/card'
import ColorClockShipRow from 'src/writeup/component/ColorClockShipRow'
import PlayControl from 'src/writeup/component/PlayControl'
import PlayControlFigure from 'src/writeup/component/PlayControlFigure'

import './ColorClockShipToy.less'

export default class ColorClockShipToy extends PlayControlFigure {
  constructor () {
    super(ColorClockShipToy.initialState)
  }

  onRestart () {
    this.refs.colorClockShipRow.reset()
  }
  
  render () {
    return (
      <div className="ColorClockShipToy">
        <Card zDepth={2}>
          <ColorClockShipRow
            ref="colorClockShipRow"
            play={this.state.play}
            testPoints={this.props.testPoints}  
          />
          <PlayControl
            className="ColorClockShipToy-PlayControl"
            onPlay={() => this.play()}
            onPause={() => this.pause()}
            onRestart={() => this.restart()}
          />
        </Card>
      </div>
    )
  }
}

ColorClockShipToy.propTypes = {
  testPoints: PropTypes.array.isRequired
}

ColorClockShipToy.initialState = {
  play: false
}