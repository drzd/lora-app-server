import React from "react";

export default class extends React.Component {
  onSubmit = (e) => {
    e.preventDefault();
    this.props.updatePageSize(this.limitInput.value);
  };

  render() {
    const { pageSize } = this.props;
    return (
      <form className="form-inline" onSubmit={this.onSubmit}>
        <div className="form-group" style={{marginRight: 10}}>
          <label htmlFor="limit-input" style={{marginRight: 10}}>Limit: </label>
          <input type="text" className="form-control" id="limit-input" ref={node => this.limitInput = node} defaultValue={pageSize} style={{width: 50, textAlign: 'center'}} />
        </div>
        <button type="submit" className="btn btn-primary">OK</button>
      </form>
    );
  }
};