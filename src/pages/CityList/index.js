import React, { Component } from "react";
import { getCityList, getHotCity } from "../../utils/api/City";
import { getCurCity } from "../../utils";
import { List, AutoSizer } from "react-virtualized";
import "./index.scss";
import { NavBar, Icon } from "antd-mobile";

// 假数据
// const list = Array.from(new Array(100)).map((item, index) => {
//   return { name: index };
// });

class CityList extends Component {
  // 设置状态数据
  state = {
    // 归类的城市数据的索引
    cityIndex: [],
    // 归类的城市数据
    cityList: {},
  };

  componentDidMount() {
    this.getCities();
  }

  // 格式化列表title
  formatLetter = (letter) => {
    switch (letter) {
      case "#":
        return "当前城市";
      case "hot":
        return "热门城市";

      default:
        // 处理成大写
        return letter.toUpperCase();
    }
  };

  // 行渲染方法
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) => {
    // 获取处理完的状态数据
    const { cityList, cityIndex } = this.state;
    // 对象的键
    let letter = cityIndex[index];
    // console.log(index, letter);
    // 对象的值
    let item = cityList[letter];

    return (
      <div key={key} style={style} className="city-item">
        <div className="title">{this.formatLetter(letter)}</div>
        {item.map((item) => (
          <div key={item.value} className="name">
            {item.label}
          </div>
        ))}
      </div>
    );
  };

  // 获取城市列表数据
  getCities = async () => {
    const { status, data } = await getCityList();
    // console.log(status, data);
    if (status === 200) {
      let { cityList, cityIndex } = this.formatCities(data);

      // 加入热门城市数据
      const { status: st, data: hot } = await getHotCity();
      if (st === 200) {
        cityList["hot"] = hot;
        cityIndex.unshift("hot");
      }
      // console.log(cityList, cityIndex);
      // 加入当前城市
      const res = await getCurCity();
      // console.log(res);
      cityList["#"] = [res];
      cityIndex.unshift("#");
      // console.log(cityList, cityIndex);
      // 响应式
      this.setState({
        cityList,
        cityIndex,
      });
    }
  };

  // 按城市首字母归类城市数据
  formatCities = (data) => {
    // 归类的数据
    let cityList = {},
      cityIndex;
    data.forEach((item) => {
      // 获取当前城市首字母
      let first = item.short.slice(0, 1);
      // 排重和归类
      // 判断存不存在当前首字母开头的键
      if (!cityList[first]) {
        // 不存在
        cityList[first] = [item];
      } else {
        // 存在
        cityList[first].push(item);
      }
    });
    // console.log(cityList);
    // 获取归类的首字母数据索引
    cityIndex = Object.keys(cityList).sort();
    // console.log(cityIndex);
    // 遍历列表
    // cityIndex.map((item) => {
    //   console.log(item, cityList[item]);
    // });
    return {
      cityList,
      cityIndex,
    };
  };

  render() {
    return (
      <div className="cityList">
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={() => this.props.history.goBack()}
        >
          地图找房
        </NavBar>
        {/* /城市列表 */}
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={160}
              rowRenderer={this.rowRenderer}
              width={width}
            />
          )}
        </AutoSizer>
      </div>
    );
  }
}
export default CityList;
