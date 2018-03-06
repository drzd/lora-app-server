import React, {Component} from "react";
import moment from "moment/moment";
import JSONTree from "react-json-tree";

export default class extends Component {
  render() {
    const theme = {
      scheme: 'google',
      author: 'seth wright (http://sethawright.com)',
      base00: '#1d1f21',
      base01: '#282a2e',
      base02: '#373b41',
      base03: '#969896',
      base04: '#b4b7b4',
      base05: '#c5c8c6',
      base06: '#e0e0e0',
      base07: '#ffffff',
      base08: '#CC342B',
      base09: '#F96A38',
      base0A: '#FBA922',
      base0B: '#198844',
      base0C: '#3971ED',
      base0D: '#3971ED',
      base0E: '#A36AC7',
      base0F: '#3971ED',
    }

    const data = {
      phyPayload: this.props.frame.phyPayload,
    };

    let rxtx = {};
    let dir = "";

    if (typeof(this.props.frame.txInfo) !== "undefined" && this.props.frame.txInfo !== null) {
      rxtx["txInfo"] = this.props.frame.txInfo;
      dir = "down";
    } else {
      rxtx["rxInfoSet"] = this.props.frame.rxInfoSet;
      dir = "up";
    }

    const createdAt = moment(this.props.frame.createdAt).format("LLLL");
    const treeStyle = {
      paddingTop: '0',
      paddingBottom: '0',
    };

    return(
      <tr>
        <td>
          <span className={`glyphicon glyphicon-arrow-${dir}`} aria-hidden="true"></span>
        </td>
        <td>{createdAt}</td>
        <td style={treeStyle}>
          <JSONTree data={rxtx} theme={theme} hideRoot={true} />
        </td>
        <td style={treeStyle}>
          <JSONTree data={data} theme={theme} hideRoot={true} />
        </td>
      </tr>
    );
  }
}