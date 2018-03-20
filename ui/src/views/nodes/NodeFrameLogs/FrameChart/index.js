import React from 'react';
import moment from "moment/moment";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label} from 'recharts';
import randomColor from 'randomcolor';

import CustomLegend from './Legend';

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }


  // transform rxInfoSet into object keyed by mac
  transformInfoSetIntoObject(rxInfoSet) {
    return rxInfoSet.reduce((result, set) => {
      result[set.mac] = {
        loRaSNR: set.loRaSNR,
        rssi: set.rssi
      };
      return result;
    }, {});
  }

  renderLine(name, key, options = {}) {
    return <Line
      name={name}
      key={name}
      dataKey={this.state[name] ? '' : key}
      stroke={randomColor({seed: key})}
      type="monotone"
      yAxisId="left"
      strokeWidth={2}
      connectNulls={true}
      {...options}
    />;
  }

  renderLines(macs) {
    return macs.reduce((result, mac) => {
      result.push(this.renderLine(`${mac}.SNR`, `rxInfoSet.${mac}.loRaSNR`));
      result.push(this.renderLine(`${mac}.rssi`, `rxInfoSet.${mac}.rssi`));
      return result;
    }, []);
  }

  handleToggleClick(name) {
    this.setState({
      ...this.state,
      [name]: !this.state[name]
    });
  }

  render() {
    const data = this.props.frames
    // leave only received frames
      .filter(frame => frame.rxInfoSet.length)
      // leave only rxInfoSet, timestamp and fCnt
      .map(frame => ({
        rxInfoSet: this.transformInfoSetIntoObject(frame.rxInfoSet),
        timestamp: moment(frame.createdAt).format("HH:mm DD.MM.YY"),
        fCnt: frame.phyPayload.macPayload.fhdr.fCnt
      }))
      .reverse();

    // get all the macs from the data received
    const macsObject = data.reduce((result, {rxInfoSet}) => {
      Object.keys(rxInfoSet).forEach(mac => {
        result[mac] = true;
      });
      return result;
    }, {});
    const macs = Object.keys(macsObject);

    return (
      <div>
        <ResponsiveContainer width="100%" height={450}>
          <LineChart data={data}>
            <XAxis dataKey="timestamp">
              <Label value="time" offset={0} position="insideBottom"/>
            </XAxis>
            <YAxis yAxisId="left">
              <Label value="rssi, loRaSNR" offset={0} position="insideLeft" angle={-90}/>
            </YAxis>
            <YAxis yAxisId="right" type="number" domain={['dataMin', 'dataMax']} orientation="right">
              <Label value="fCnt" position="insideRight" angle={90}/>
            </YAxis>
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip/>
            <Legend content={CustomLegend} onClick={this.handleToggleClick} state={this.state} />
            { this.renderLines(macs) }
            { this.renderLine('fCnt', 'fCnt', {
              yAxisId: "right",
            }) }
          </LineChart>
        </ResponsiveContainer>
        <div className="helper-block">
          There are <strong>{data.length}</strong> received messages shown on the chart
        </div>
      </div>
    );
  }
};
