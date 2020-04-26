import React from "react";

import { Flex } from "antd-mobile";

import Filter from "./components/Filter";
// 导入样式
import styles from "./index.module.css";
import { getListByFilter } from "../../utils/api/House";
import { getCurCity } from "../../utils";
import { List, AutoSizer } from "react-virtualized";
import HouseItem from "../../components/HouseItem";
import { BASE_URL } from "../../utils/axios";

export default class HouseList extends React.Component {
  state = {
    // 房屋列表数据
    list: [],
  };

  // 渲染列表项方法
  renderHouseItem = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) => {
    // 获取数据=》渲染列表项
    const { list } = this.state;
    // 获取当前列表项数据
    const item = list[index];
    // 处理图片地址和键
    item.src = `${BASE_URL}${item.houseImg}`;
    return <HouseItem {...item} key={key} style={style} />;
  };

  async componentDidMount() {
    let { value } = await getCurCity();
    // console.log(value);
    this.cityId = value;
    // 默认调用一次
    this.getHouseList();
  }

  // 字传父
  // 父组件提供接收数据的方法
  onFilter = (filters) => {
    // 过滤条件数据
    this.filters = filters;
    // 获取列表数据
    // 每次点击确定的时候调用数据
    this.getHouseList();
  };
  // 获取列表数据
  getHouseList = async () => {
    let {
      status,
      data: { list },
    } = await getListByFilter(this.cityId, this.filters, 1, 20);
    // console.log(res);
    if (status === 200) {
      this.setState({
        list,
      });
    }
  };

  render() {
    return (
      <div className={styles.root}>
        {/* 条件筛选栏 */}
        <Filter onFilter={this.onFilter} />
        {/* 筛选结果：列表 */}
        {/* 列表 */}
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              className={styles.houseList}
              rowCount={this.state.list.length}
              rowHeight={130}
              rowRenderer={this.renderHouseItem}
              width={width}
            />
          )}
        </AutoSizer>
      </div>
    );
  }
}
