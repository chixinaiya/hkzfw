import React, { Component } from "react";
import "./index.scss";
import { NavBar, Icon } from "antd-mobile";

class Map extends Component {
  componentDidMount() {
    // 调用初始化
    this.initMap();
  }

  // 初始化地图
  initMap = () => {
    const { BMap } = window;
    // console.log(BMap);

    // 1.创建地图实例
    const map = new BMap.Map("container");

    // 2.地图定位的经纬度位置设置
    let point = new BMap.Point(116.404, 39.915);

    // 3.设置地图的位置和缩放级别
    map.centerAndZoom(point, 15);
  };

  render() {
    return (
      <div className="mapBox">
        {/* 地图导航栏 */}
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={() => this.props.history.goBack()}
        >
          地图找房
        </NavBar>
        {/* 地图 */}
        <div id="container"></div>
      </div>
    );
  }
}
export default Map;
