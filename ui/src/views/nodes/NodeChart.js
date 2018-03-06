import React, { Component } from "react";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label} from 'recharts';
import moment from 'moment';

import NodeStore from "../../stores/NodeStore";
import Pagination from "../../components/Pagination";

class ChartSettings extends React.Component {

  componentWillReceiveProps(nextProps) {
    this.limitInput.value = nextProps.limit;
    this.offsetInput.value = nextProps.offset;
  }

  onSubmit(e) {
    e.preventDefault();

  }

  render() {
    const { limit, offset } = this.props;

    return (
      <div className="panel-heading">
          <div className="clearfix">
            <div className="btn-group" role="group" aria-label="...">
              <button type="button" className="btn btn-default active">Table</button>
              <button type="button" className="btn btn-default">Chart</button>
            </div>
            <form className="form-inline pull-right" onSubmit={() => this.onSubmit()}>
              <div className="form-group" style={{marginRight: 30}}>
                <label htmlFor="limit-input" style={{marginRight: 10}}>Limit: </label>
                <input type="text" className="form-control" id="limit-input" ref={node => this.limitInput = node} defaultValue="20" style={{width: 50, textAlign: 'center'}}/>
              </div>
              <button type="submit" className="btn btn-primary">OK</button>
            </form>
          </div>
      </div>
    );
  }
}

const SimpleLineChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={450}>
    <LineChart data={data}>
      <XAxis dataKey="timestamp">
        <Label value="timestamp" offset={0} position="insideBottom" />
      </XAxis>
      <YAxis yAxisId="left">
        <Label value="rssi, loRaSNR" offset={0} position="insideLeft" angle={-90}/>
      </YAxis>
      <YAxis yAxisId="right" dataKey="fCnt" type="number" domain={['dataMin', 'dataMax']} orientation="right">
        <Label value="fCnt" position="insideRight" angle={90}/>
      </YAxis>
      <CartesianGrid strokeDasharray="3 3"/>
      <Tooltip/>
      <Legend />
      <Line yAxisId="left" type="monotone" dataKey="loRaSNR" stroke="#8884d8" activeDot={{r: 8}}/>
      <Line yAxisId="left" type="monotone" dataKey="rssi" stroke="#82ca9d" />
      <Line yAxisId="right" type="monotone" dataKey="fCnt" stroke="#773377" />
    </LineChart>
  </ResponsiveContainer>
);

class NodeFrameLogs extends Component {
  constructor() {
    super();

    this.state = {
      frames: [],
      pageSize: 100,
      pageNumber: 1,
      pages: 1,
      offset: 0
    };

    this.updatePage = this.updatePage.bind(this);
  }

  componentDidMount() {
    this.updatePage(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updatePage(nextProps);
  }

  updatePage(props) {
    const page = (props.location.query.page === undefined) ? 1 : props.location.query.page;

    NodeStore.getFrameLogs(this.props.params.devEUI, this.state.pageSize, (page-1) * this.state.pageSize, (totalCount, frames) => {
      this.setState({
        frames: frames.filter(frame => frame.rxInfoSet.length),
        pageNumber: page,
        pages: Math.ceil(totalCount / this.state.pageSize),
      });
      window.scrollTo(0, 0);
    });
  }

  render () {
    if (this.state.frames.length > 0) {

      const data = this.state.frames.map(frame => ({
        loRaSNR: frame.rxInfoSet[0].loRaSNR,
        rssi: frame.rxInfoSet[0].rssi,
        timestamp: moment(frame.createdAt).format("hh:mm DD.MM.YY"),
        fCnt: frame.phyPayload.macPayload.fhdr.fCnt
      })).reverse();



      return (
        <div>
          <div className="panel panel-default">
            <div className="panel-heading">
              <ChartSettings />
            </div>
            <div className="panel-body">
              <SimpleLineChart data={data} />
              <p className="help-block" style={{marginBottom: 0}}>
                There are <strong>{60}</strong> received messages shown on the chart
              </p>
            </div>

            <Pagination pages={this.state.pages} currentPage={this.state.pageNumber} pathname={`/organizations/${this.props.params.organizationID}/applications/${this.props.params.applicationID}/nodes/${this.props.params.devEUI}/chart`} />
          </div>
        </div>
      );
    } else {
      return (
        <div className="panel panel-default">
          <div className="panel-body">
            No frames sent / received yet or LoRa Server has frame logging disabled.
          </div>
        </div>
      );
    }
  }
}

export default NodeFrameLogs;
