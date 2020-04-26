import React, { Component } from "react";

import { PickerView } from "antd-mobile";

import FilterFooter from "../../../../components/FilterFooter";

export default class FilterPicker extends Component {
  state = {
    // picker当前选中的数据
    value: this.props.value,
  };
  render() {
    const { data, cols } = this.props;
    return (
      <>
        {/* 选择器组件： */}
        <PickerView
          value={this.state.value}
          data={data}
          onChange={(v) => {
            this.setState({
              value: v,
            });
          }}
          cols={cols}
        />

        {/* 底部按钮 */}
        <FilterFooter
          onOK={() => {
            this.props.onOK(this.state.value);
          }}
          onCancle={this.props.onCancle}
        />
      </>
    );
  }
}
