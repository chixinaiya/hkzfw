import React, { Component } from "react";

import { SearchBar } from "antd-mobile";

import { getCurCity } from "../../../utils";

import styles from "./index.module.css";
import { getCommunity } from "../../../utils/api/City";

export default class Search extends Component {
  state = {
    // 搜索框的值
    searchTxt: "",
    tipsList: [],
  };

  async componentDidMount() {
    // 获取城市ID
    const { value } = await getCurCity();
    this.cityId = value;
  }

  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state;

    return tipsList.map((item) => (
      <li
        onClick={() => {
          this.props.history.replace({
            pathname: "/rent/add",
            data: { id: item.community, name: item.communityName },
          });
        }}
        key={item.community}
        className={styles.tip}
      >
        {item.communityName}
      </li>
    ));
  };

  // 搜素框受控
  handlerSearch = (v) => {
    let val = v.trim();
    // 处理为空的情况
    if (val.length === 0) {
      return this.setState({
        searchTxt: "",
        tipsList: [],
      });
    }
    this.setState(
      {
        searchTxt: val,
      },
      async () => {
        // 根据关键词搜索小区
        const { status, data } = await getCommunity(this.cityId, val);
        if (status === 200) {
          // 显示搜索结果
          this.setState({
            tipsList: data,
          });
        }
      }
    );
  };

  render() {
    const { history } = this.props;
    const { searchTxt } = this.state;

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          onChange={this.handlerSearch}
          showCancelButton={true}
          onCancel={() => history.replace("/rent/add")}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    );
  }
}
