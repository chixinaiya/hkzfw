import React, { Component } from "react";
import { getCityList, getHotCity } from "../../utils/api/City";

class CityList extends Component {
  componentDidMount() {
    this.getCities();
  }
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
      console.log(cityList, cityIndex);
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
    return <div>CityList</div>;
  }
}
export default CityList;
