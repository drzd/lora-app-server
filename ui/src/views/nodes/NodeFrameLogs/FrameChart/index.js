import React from 'react';
import moment from "moment/moment";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label} from 'recharts';
import randomColor from 'randomcolor';

export default class extends React.Component {

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

  renderLines(macs) {
    return macs.reduce((result, mac) => {
      const key1 = `rxInfoSet.${mac}.loRaSNR`, key2 = `rxInfoSet.${mac}.rssi`;
      result.push(<Line connectNulls={true} strokeWidth={2} key={key1} yAxisId="left" type="monotone" dataKey={key1} stroke={randomColor({seed: key1})}/>);
      result.push(<Line connectNulls={true} strokeWidth={2} key={key2} yAxisId="left" type="monotone" dataKey={key2} stroke={randomColor({seed: key2})}/>);
      return result;
    }, []);
  }

  render() {
    const data = this.props.frames
    // leave only received frames
      .filter(frame => frame.rxInfoSet.length)
      // leave only rxInfoSet, timestamp and fCnt
      .map(frame => ({
        rxInfoSet: this.transformInfoSetIntoObject(frame.rxInfoSet),
        timestamp: moment(frame.createdAt).format("hh:mm DD.MM.YY"),
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
              <Label value="timestamp" offset={0} position="insideBottom"/>
            </XAxis>
            <YAxis yAxisId="left">
              <Label value="rssi, loRaSNR" offset={0} position="insideLeft" angle={-90}/>
            </YAxis>
            <YAxis yAxisId="right" type="number" domain={['dataMin', 'dataMax']} orientation="right">
              <Label value="fCnt" position="insideRight" angle={90}/>
            </YAxis>
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip/>
            <Legend/>
            { this.renderLines(macs) }
            <Line yAxisId="right" strokeWidth={2} type="monotone" dataKey="fCnt" stroke="#773377"/>
          </LineChart>
        </ResponsiveContainer>
        <div className="helper-block">
          There are <strong>{data.length}</strong> received messages shown on the chart
        </div>
      </div>
    );
  }
};