import React from 'react'
import Toggle from 'material-ui/lib/toggle'
import IconButton from 'material-ui/lib/icon-button'
import classnames from 'classnames'

import './ShipGridModeSwitch.less'

const ACTIVE_ICON = 'ShipGridModeSwitch-Icon--active';
const DISABLED_ICON = 'ShipGridModeSwitch-Icon--disabled';
const ICON_BUTTON_STYLES = { height: '60px', width: '60px' }

export default (props) => {
  const {mode, disabled} = props
  const onChange = props.onChange || (() => {})

  return (
    <div className={classnames('ShipGridModeSwitch', {
      'ShipGridModeSwitch--disabled': disabled
    })}>
      <IconButton
        iconClassName={classnames('mi mi-directions-boat', {
          [ACTIVE_ICON]: mode === 'ship',
          [DISABLED_ICON]: disabled
        })}
        tooltipPosition="bottom-center"
        style={ICON_BUTTON_STYLES}
        onClick={() => {onChange('ship')}}
      />
      <div className="ShipGridModeSwitch-Toggle">
        <Toggle
          onToggle={() => {onChange(mode === 'ship' ? 'color' : 'ship')}}
          toggled={mode === 'color'}
          disabled={disabled}
        />
      </div>
      <IconButton
        iconClassName={classnames('mi mi-grid-on', {
          [ACTIVE_ICON]: mode === 'color',
          [DISABLED_ICON]: disabled
        })}
        tooltipPosition="bottom-center"
        style={ICON_BUTTON_STYLES}
        onClick={() => {onChange('color')}}
      />
    </div>
  )
};