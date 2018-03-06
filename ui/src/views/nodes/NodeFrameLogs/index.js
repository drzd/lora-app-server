import React, { Component } from "react";

import Switch from './Switch';
import Limit from './Limit';
import FrameChart from './FrameChart';
import FrameTable from './FrameTable';
import NodeStore from "../../../stores/NodeStore";
import Pagination from "../../../components/Pagination";

class NodeFrameLogs extends Component {
  constructor() {
    super();

    this.state = {
      frames: [],
      pageSize: 20,
      pageNumber: 1,
      pages: 1,
      isTable: true
    };

    this.updatePage = this.updatePage.bind(this);
    this.updatePageSize = this.updatePageSize.bind(this);
    this.onSwitchChange = this.onSwitchChange.bind(this);
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
        frames: frames,
        pageNumber: page,
        pages: Math.ceil(totalCount / this.state.pageSize),
      });
      window.scrollTo(0, 0);
    });
  }

  updatePageSize(pageSize) {
    this.setState({
      pageSize
    }, () => {
      this.props.history.push({
        ...this.props.location,
        query: Object.assign({}, this.props.location.query, {page: 1})
      });
    });
  }

  onSwitchChange(isTable) {
    this.setState({
      isTable
    });
  }

  render () {
    if (this.state.frames.length > 0) {
      return (
        <div className="panel panel-default">
          <div className="panel-heading clearfix">
            <Switch
              isTable={this.state.isTable}
              onSwitchChange={this.onSwitchChange}
            />
            <div className="pull-right">
              <Limit pageSize={this.state.pageSize} updatePageSize={this.updatePageSize} />
            </div>
          </div>
          <div className="panel-body">
            {this.state.isTable ?
              <FrameTable frames={this.state.frames} /> :
              <FrameChart frames={this.state.frames} />
            }
          </div>
          <Pagination pages={this.state.pages} currentPage={this.state.pageNumber} pathname={`/organizations/${this.props.params.organizationID}/applications/${this.props.params.applicationID}/nodes/${this.props.params.devEUI}/frames`} />
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
