import React, { Component } from "react";
import { Carousel, Flex, Grid, WingBlank, SearchBar } from "antd-mobile";
import { BASE_URL } from "../../utils/axios";
import { getSwiper, getGroups, getNews } from "../../utils/api/Home";
import "./index.scss";
import Navs from "../../utils/navConfig";
import { getCityInfo } from "../../utils/api/City";

class Index extends Component {
  state = {
    // 头部搜素的关键字
    keyword: "",
    // 轮播图的数据
    swiper: [],
    // 设置轮播图的默认高度
    imgHeight: 176,
    // 是否自动播放
    isPlay: false,
    // 租房小组的数据
    groups: [],
    // 资讯列表数据
    news: [],
    // 当前城市
    curCity: {
      label: "--",
      value: "",
    },
  };

  componentDidMount() {
    this.getAllDatas();
    this.getCurCity();
  }

  // 根据百度地图获取当前定位城市
  getCurCity = () => {
    let myCity = new window.BMap.LocalCity();
    myCity.get(async (result) => {
      // 调用接口获取城市详细信息
      const { status, data } = await getCityInfo(result.name);
      console.log(status, data);

      if (status === 200) {
        this.setState({
          curCity: data,
        });
      }
    });
  };

  // 获取首页所有接口的数据
  getAllDatas = async () => {
    // const p1 = Promise.resolve(1); // 返回的promise对象 === new Promise
    // const p2 = Promise.resolve([{ a: 1, b: 2 }]);
    try {
      let [swiper, groups, news] = await Promise.all([
        getSwiper(),
        getGroups(),
        getNews(),
      ]);
      // console.log(swiper, groups, news);
      if (
        swiper.status === 200 &&
        groups.status === 200 &&
        news.status === 200
      ) {
        this.setState(
          {
            swiper: swiper.data,
            groups: groups.data,
            news: news.data,
          },
          () => {
            this.setState({
              isPlay: true,
            });
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 封装渲染轮播图
  renderSwiper = () => {
    return (
      <Carousel
        // 自动切换
        autoplay={this.state.isPlay}
        // 是否循环播放
        infinite
      >
        {this.state.swiper.map((val) => (
          <a
            key={val.id}
            href="http://www.alipay.com"
            style={{
              display: "inline-block",
              width: "100%",
              height: this.state.imgHeight,
            }}
          >
            <img
              src={`${BASE_URL}${val.imgSrc}`}
              alt=""
              style={{ width: "100%", verticalAlign: "top" }}
              onLoad={() => {
                // fire window resize event to change height
                window.dispatchEvent(new Event("resize"));
                this.setState({ imgHeight: "auto" });
              }}
            />
          </a>
        ))}
      </Carousel>
    );
  };

  // 封装渲染栏目导航
  renderNavs = () => {
    return (
      <Flex className="nav">
        {Navs.map((item) => (
          <Flex.Item
            onClick={() => {
              this.props.history.push(item.path);
            }}
            key={item.id}
          >
            <img src={item.img} alt="" />
            <p>{item.name}</p>
          </Flex.Item>
        ))}
      </Flex>
    );
  };

  // 渲染最新资讯
  renderNews() {
    return this.state.news.map((item) => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img className="img" src={`${BASE_URL}${item.imgSrc}`} alt="" />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ));
  }

  //渲染租房小组
  renderGroups = () => {
    return (
      <>
        <Flex className="group-title" justify="between">
          <h3>租房小组</h3>
          <span>更多</span>
        </Flex>

        {/* 宫格布局 */}
        <Grid
          data={this.state.groups}
          // 列数
          columnNum={2}
          // 是否有边框
          hasLine={false}
          // 每个盒子是否固定为正方形
          square={false}
          renderItem={(item) => (
            // item结构
            <Flex className="grid-item" justify="between">
              <div className="desc">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
              <img src={`${BASE_URL}${item.imgSrc}`} alt="" />
            </Flex>
          )}
        />
      </>
    );
  };

  // 渲染顶部导航
  renderTopNav = () => {
    const { push } = this.props.history;
    return (
      <Flex justify="around" className="topNav">
        <div className="searchBox">
          <div
            className="city"
            onClick={() => {
              push("/cityList");
            }}
          >
            {this.state.curCity.label}
            <i className="iconfont icon-arrow" />
          </div>
          <SearchBar
            // 受控组件
            value={this.state.keyword}
            onChange={(v) => this.setState({ keyword: v })}
            placeholder="请输入小区或地址"
          />
        </div>
        <div
          className="map"
          onClick={() => {
            push("/map");
          }}
        >
          <i key="0" className="iconfont icon-map" />
        </div>
      </Flex>
    );
  };

  render() {
    return (
      <div className="index">
        {/* 头部导航 */}
        {this.renderTopNav()}

        {/* 轮播图 */}
        {this.renderSwiper()}

        {/* 栏目导航 */}
        {this.renderNavs()}

        {/* 租房小组 */}
        <div className="group">{this.renderGroups()}</div>

        {/* 最新资讯 */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
      </div>
    );
  }
}
export default Index;
