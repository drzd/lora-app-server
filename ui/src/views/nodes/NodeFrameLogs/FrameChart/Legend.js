import React from 'react';
import PropTypes from 'prop-types';

const Legend = ({ payload, state, onClick }) => (
  <ul style={{padding: 0, margin: 0, listStyle: 'none'}}>
    {
      payload.map(entry => (
        <li
          key={entry.value}
          style={{
            display: 'inline-block',
            marginRight: 5,
            marginLeft: 5,
            fontWeight: 'bold',
            color: entry.color,
            cursor: 'pointer',
            textDecoration: state[entry.value] ? 'line-through' : 'none'
          }}
          onClick={() => onClick(entry.value)}
        >
          {entry.value}
        </li>
      ))
    }
  </ul>
);

Legend.propTypes = {
  payload: PropTypes.array.isRequired,
  onToggleClick: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired
};

export default Legend;