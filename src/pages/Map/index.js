import React, { Component } from "react";
import styles from "./index.module.css";
import { NavBar, Icon } from "antd-mobile";
import { getCurCity } from "../../utils";

import { getMapHouse } from "../../utils/api/City/index";
import { getListByFilter } from "../../utils/api/House";
import HouseItem from "../../components/HouseItem";
import { BASE_URL } from "../../utils/axios";

class Map extends Component {
  state = {
    // 点击小区的房源列表数据
    list: [],
    // 控制列表是否显示
    isShowList: false,
  };
  componentDidMount() {
    // 调用初始化地图
    this.initMap();
  }

  // 初始化地图
  initMap = async () => {
    this.BMap = window.BMap;
    // console.log(BMap);

    // 1.创建地图实例
    this.map = new this.BMap.Map("container");

    // 2.地图定位的经纬度位置设置
    // let point = new BMap.Point(116.404, 39.915);

    // 3.设置地图的位置和缩放级别
    // map.centerAndZoom(point, 15);

    // 获取到当前城市定位的信息
    let { value, label } = await getCurCity();
    // console.log(value, label);

    // 创建地址解析器实例
    let myGeo = new this.BMap.Geocoder();
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(
      null,
      async (point) => {
        if (point) {
          this.map.centerAndZoom(point, 11);
          // map.addOverlay(new BMap.Marker(point));
          // 添加控件=》平移缩放控件
          this.map.addControl(new this.BMap.NavigationControl());
          // 比例尺
          this.map.addControl(new this.BMap.ScaleControl());
          // 默认调用一次=》渲染覆盖物=》第一层区的覆盖物
          this.renderOverlay(value);
        }
      },
      label
    );

    // 地图开始移动的时候触发
    this.map.addEventListener("movestart", () => {
      // 判断列表是否显示
      if (this.state.isShowList) {
        this.setState({
          isShowList: false,
        });
      }
    });
  };

  // 渲染覆盖物
  renderOverlay = async (id) => {
    // 根据不同的id获取地图需要的数据
    // 调用后台接口
    let { status, data } = await getMapHouse(id);

    // 获取一下当前地图的缩放级别 =》获取渲染覆盖物的形状和下一层缩级别
    const { rect, nextZoom } = this.getTypeAndZoom();

    if (status === 200) {
      data.forEach((item) => {
        // 根据形状创建不同的覆盖物
        if (rect === "circle") {
          // 创建圆形覆盖物=》渲染前两层
          this.createCircle(item, nextZoom);
        } else {
          // 创建方形覆盖物=》第三层小区
          this.createRect(item);
        }
      });
    }
  };

  // 圆形覆盖物
  createCircle = (item, nextZoom) => {
    // 遍历渲染当前城市所有区的覆盖物到地图上
    const {
      coord: { longitude, latitude },
      label: lab,
      count,
      value: val,
    } = item;
    // 转换经纬度
    const ipoint = new this.BMap.Point(longitude, latitude);

    // 文本覆盖物
    const opts = {
      position: ipoint, // 指定文本标注所在的地理位置
      offset: new this.BMap.Size(0, 0), //设置文本偏移量
    };
    const label = new this.BMap.Label(null, opts); // 创建文本标注对象
    // 使用html创建覆盖物
    label.setContent(
      `
    <div class="${styles.bubble}">
    <p class="${styles.bubbleName}">${lab}</p>
    <p>${count}套</p>
    </div>
    `
    );
    label.setStyle({
      background: "transparent",
      border: 0,
    });
    // 添加点击事件
    label.addEventListener("click", () => {
      // console.log(val);
      this.map.centerAndZoom(ipoint, nextZoom);
      this.renderOverlay(val);
      // 清除上一层覆盖物
      setTimeout(() => {
        this.map.clearOverlays();
      });
    });
    this.map.addOverlay(label);
  };

  // 方形覆盖物
  createRect = (item) => {
    // 遍历渲染当前城市所有区的覆盖物到地图上
    const {
      coord: { longitude, latitude },
      label: lab,
      count,
      value: val,
    } = item;
    // 转换经纬度
    const ipoint = new this.BMap.Point(longitude, latitude);

    // 文本覆盖物
    const opts = {
      position: ipoint, // 指定文本标注所在的地理位置
      offset: new this.BMap.Size(-50, -28), //设置文本偏移量
    };
    const label = new this.BMap.Label(null, opts); // 创建文本标注对象
    // 使用html创建覆盖物
    label.setContent(
      `
        <div class="${styles.rect}">
        <span class="${styles.housename}">${lab}</span>
        <span class="${styles.housenum}">${count}</span>
        <i class="${styles.arrow}"></i>
      </div>
      `
    );
    label.setStyle({
      background: "transparent",
      border: 0,
    });
    // 添加点击事件
    label.addEventListener("click", (e) => {
      // console.log(val);
      // 获取当前小区的房源列表
      this.getHouseListById(val);
      // 移动覆盖物到中心点
      this.moveToCenter(e);
      // this.map.centerAndZoom(ipoint, nextZoom);
      // this.renderOverlay(val);
      // // 清除上一层覆盖物
      // setTimeout(() => {
      //   this.map.clearOverlays();
      // });
    });
    this.map.addOverlay(label);
  };

  // 点击某个小区=》移动它到中心位置
  moveToCenter = (e) => {
    // 计算中心点位置  终点
    let zx = window.innerWidth / 2,
      zy = (window.innerHeight - 330) / 2;

    // 当前点击覆盖物的坐标点   起点

    let { clientX, clientY } = e.changedTouches[0];
    // 计算当前点击覆盖物=》移动到中心点坐标
    //中心点 = 终点 - 起点
    this.map.panBy(zx - clientX, zy - clientY);
  };

  // 根据小区id获取当前小区的房源列表数据
  getHouseListById = async (id) => {
    let {
      status,
      data: { list },
    } = await getListByFilter(id);
    if (status === 200) {
      this.setState({
        list,
        isShowList: true,
      });
    }
  };

  // 渲染小区下房屋列表
  renderHouseList = () => {
    return (
      <div
        className={[
          styles.houseList,
          this.state.isShowList ? styles.show : "",
        ].join(" ")}
      >
        <div className={styles.titleWrap}>
          <h1 className={styles.listTitle}>房屋列表</h1>
          <a className={styles.titleMore} href="/home/house">
            更多房源
          </a>
        </div>

        <div className={styles.houseItems}>
          {/* 房屋结构 */}
          {this.state.list.map((item) => (
            <HouseItem
              onClick={() =>
                this.props.history.push(`/detail/${item.houseCode}`)
              }
              key={item.houseCode}
              src={BASE_URL + item.houseImg}
              title={item.title}
              desc={item.desc}
              tags={item.tags}
              price={item.price}
            />
          ))}
        </div>
      </div>
    );
  };

  // 获取当前的覆盖物形状和下一层缩放级别
  getTypeAndZoom = () => {
    let rect, nextZoom;
    // 获取当前地图的缩放级别
    const currZoom = this.map.getZoom();
    // 默认第一层：zoom=11
    if (currZoom >= 10 && currZoom < 12) {
      rect = "circle";
      nextZoom = 13;
    } else if (currZoom >= 12 && currZoom < 14) {
      rect = "circle";
      nextZoom = 15;
    } else if (currZoom >= 14 && currZoom < 16) {
      rect = "rect";
    }
    return {
      rect,
      nextZoom,
    };
  };

  render() {
    return (
      <div className={styles.mapBox}>
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

        {this.renderHouseList()}
      </div>
    );
  }
}
export default Map;
