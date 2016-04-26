import React, {Component, PropTypes} from 'react'
import classnames from 'classnames'

import './GraphAxis.less'

export default class GraphAxis extends Component {
  render() {
    const className = classnames('GraphAxis', this.props.className);
    return (
      <div className={className}>
        <div className="GraphAxis-AxisA">
          <span className="GraphAxis-AxisA-Label">Increasing amplitude</span>
        </div>
        {this.props.children}
        <div className="GraphAxis-AxisW">
          <span className="GraphAxis-AxisW-Label">Increasing frequency</span>
        </div>
      </div>
    )
  }
}

GraphAxis.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
}
