import React, { Component } from "react";
import { Carousel, Flex } from "antd-mobile";
import { BASE_URL } from "../../utils/axios";
import { getSwiper } from "../../utils/api/Home";
import "./index.css";
import Navs from "../../utils/navConfig";

class Index extends Component {
  state = {
    // 轮播图的数据
    swiper: [],
    // 设置轮播图的默认高度
    imgHeight: 176,
    // 是否自动播放
    isPlay: false,
  };

  componentDidMount() {
    this.getSwiper();
  }
  // 获取轮播图数据
  getSwiper = async () => {
    const { status, data } = await getSwiper();
    // console.log(status, data);
    if (status === 200) {
      // res.data.body.forEach((item) => {
      //   item.imgSrc = `http://api-haoke-dev.itheima.net${item.imgSrc}`;
      // });
      this.setState(
        {
          swiper: data,
        },
        () => {
          // 确保swiper有数据
          this.setState({
            isPlay: true,
          });
        }
      );
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

  render() {
    return (
      <div className="index">
        {/* 轮播图 */}

        {this.renderSwiper()}

        {/* 栏目导航 */}

        {this.renderNavs()}
      </div>
    );
  }
}
export default Index;
