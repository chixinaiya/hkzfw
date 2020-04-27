import React from "react";

import { Toast } from "antd-mobile";

import Filter from "./components/Filter";
// 导入样式
import styles from "./index.module.css";
import { getListByFilter } from "../../utils/api/House";
import { getCurCity } from "../../utils";
import { List, AutoSizer, InfiniteLoader } from "react-virtualized";
import HouseItem from "../../components/HouseItem";
import { BASE_URL } from "../../utils/axios";
import NoHouse from "../../components/NoHouse";

export default class HouseList extends React.Component {
  state = {
    // 房屋列表数据
    list: [],
    // 列表数据的总条数
    count: 0,
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
    // 数据item没有的时候
    if (!item) {
      return (
        <div style={style} key={key}>
          <p className={styles.loading}></p>
        </div>
      );
    }
    // 处理图片地址和键
    item.src = `${BASE_URL}${item.houseImg}`;
    return (
      <HouseItem
        {...item}
        key={key}
        onClick={() => {
          this.props.history.push("/detail/" + item.houseCode);
        }}
        style={style}
      />
    );
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
      data: { list, count },
    } = await getListByFilter(this.cityId, this.filters, 1, 20);
    // 有数据提示
    if (count !== 0) {
      Toast.success(`获取到${count}条房源数据`);
    }
    // console.log(res);
    if (status === 200) {
      this.setState({
        list,
        count,
      });
    }
  };

  // 判断列表中的每一行是否加载完成
  isRowLoaded = ({ index }) => {
    // console.log('rowloaded:', index);
    const { list } = this.state;
    return !!list[index];
  };

  // 下拉加载更多时触发：加载下一页数据
  loadMoreRows = ({ startIndex, stopIndex }) => {
    // console.log( startIndex, stopIndex);
    // 调用封装的api(返回一个Promise对象)
    return getListByFilter(
      this.cityId,
      this.filters,
      startIndex,
      stopIndex
    ).then((res) => {
      // console.log(startIndex, stopIndex, res);
      // 刷新视图
      this.setState({
        list: [...this.state.list, ...res.data.list],
      });
    });
  };
  // 渲染列表
  renderList = () => {
    const { count } = this.state;
    return count > 0 ? (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        // 远程数据总条数
        rowCount={this.state.count}
      >
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer>
            {({ height, width }) => (
              <List
                className={styles.houseList}
                height={height}
                rowCount={this.state.count}
                rowHeight={130}
                rowRenderer={this.renderHouseItem}
                onRowsRendered={onRowsRendered}
                ref={registerChild}
                width={width}
              />
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
    ) : (
      <NoHouse>暂无房源数据</NoHouse>
    );
  };
  render() {
    return (
      <div className={styles.root}>
        {/* 条件筛选栏 */}
        <Filter onFilter={this.onFilter} />
        {/* 筛选结果：列表 */}
        {/* 列表 */}
        {this.renderList()}
      </div>
    );
  }
}
