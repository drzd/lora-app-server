import React from 'react';
import classnames from "classnames";

export default ({
  isTable,
  onSwitchChange
}) => (
  <div className="btn-group" role="group">
    <button
      type="button"
      onClick={() => onSwitchChange(true)}
      className={ classnames('btn', 'btn-default', {active: isTable}) }
    >
      Table
    </button>
    <button
      type="button"
      className={ classnames('btn', 'btn-default', {active: !isTable}) }
      onClick={() => onSwitchChange(false)}
    >
      Chart
    </button>
  </div>
);