import React, { Component, lazy } from "react";
import { Route } from "react-router-dom";
import { TabBar } from "antd-mobile";

import "./index.css";

import TabBarConfig from "../../utils/tabBarConfig";
import Index from "../Index";
// import House from "../House";
import Profile from "../Profile";
const House = lazy(() => import("../House"));
class Home extends Component {
  state = {
    // 选中状态
    selectedTab: this.props.location.pathname,
    // 是否全局显示
    // fullScreen: true,
  };
  componentDidMount() {
    this.listenRouter();
  }

  // 监听路由变化
  listenRouter = () => {
    // 监听路由变化
    this.unlisten = this.props.history.listen((location) => {
      if (location.pathname !== this.state.selectedTab) {
        this.setState({
          selectedTab: location.pathname,
        });
      }
    });
  };

  // 组件销毁
  componentWillUnmount() {
    // 销毁监听路由
    this.unlisten();
  }

  // 封装tabBar组件
  renderTabBar = () => {
    // console.log(this.props.location.pathname);

    return (
      <TabBar
        unselectedTintColor="#949494"
        tintColor="#33A3F4"
        barTintColor="white"
      >
        {TabBarConfig.map((item) => (
          <TabBar.Item
            title={item.title}
            key={item.path}
            icon={<i className={`iconfont ${item.icon}`} />}
            selectedIcon={<i className={`iconfont ${item.icon}`} />}
            selected={this.state.selectedTab === item.path}
            onPress={() => {
              this.setState({
                selectedTab: item.path,
              });
              this.props.history.push(item.path);
            }}
          ></TabBar.Item>
        ))}
      </TabBar>
    );
  };

  render() {
    return (
      <div className="home">
        {/* 配置二级路由 */}

        <Route exact path="/home" component={Index} />
        <Route path="/home/house" component={House} />
        <Route path="/home/profile" component={Profile} />

        <div className="tabBar">{this.renderTabBar()}</div>
      </div>
    );
  }
}
export default Home;
