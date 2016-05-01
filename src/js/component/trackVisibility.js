import React, {Component} from 'react'
import isVisible from 'src/js/util/isVisible'

const {setInterval, clearInterval} = window
const TEST_INTERVAL = 200

export default Child => class extends Component {
  constructor () {
    super()
    this.state = {visible: false}
  }
  
  componentDidMount () {
    this.testInterval = setInterval(() => this.updateVisibility(), TEST_INTERVAL)
    this.updateVisibility();
  }

  componentWillUnmount () {
    clearInterval(this.testInterval);
  }

  updateVisibility () {
    let newVisability = isVisible(this.refs.container)
    if (this.state.visible !== newVisability) {
      this.setState({visible: newVisability})
    }
  }
  
  render () {
    const props = this.props
    return (
      <div ref="container">
        <Child {...props} pauseWhenNotVisible visible={this.state.visible}/>
      </div>
    )
  }
}
