import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import Writeup from 'src/writeup/Writeup'

import 'src/style/base.less'

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
require('react-tap-event-plugin')()

ReactDOM.render(<Writeup/>, document.getElementById('root'))