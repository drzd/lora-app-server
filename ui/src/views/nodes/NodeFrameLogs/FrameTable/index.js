import React from 'react';

import FrameRow from './FrameRow';

export default ({ frames }) => {
  const FrameRows = frames.map((frame, i) => <FrameRow key={new Date().getTime() + i} frame={frame} />);
  return (
    <div>
      <div className="alert alert-warning" role="alert">
        The table below displays the raw and encrypted LoRaWAN frames. Use this data for debugging purposes.
        For application integration, please see the <a href="https://docs.loraserver.io/lora-app-server/integrate/data/">Send / receive data</a> documentation page.
      </div>
      <table className="table">
        <thead>
        <tr>
          <th className="col-md-1">&nbsp;</th>
          <th className="col-md-3">Created at</th>
          <th className="col-md-3">RX / TX parameters</th>
          <th>Frame</th>
        </tr>
        </thead>
        <tbody>
        {FrameRows}
        </tbody>
      </table>
    </div>
  );
};