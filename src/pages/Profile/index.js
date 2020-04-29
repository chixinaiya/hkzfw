import React, { Component } from "react";

import { Link } from "react-router-dom";
import { Grid, Button, Modal, Toast } from "antd-mobile";

import { BASE_URL } from "../../utils/axios";

import styles from "./index.module.css";

import { isAuth, delToken } from "../../utils/index";
import { getUserData, logout } from "../../utils/api/user";

// 菜单数据
const menus = [
  { id: 1, name: "我的收藏", iconfont: "icon-coll", to: "/favorate" },
  { id: 2, name: "我的出租", iconfont: "icon-ind", to: "/rent" },
  { id: 3, name: "看房记录", iconfont: "icon-record" },
  {
    id: 4,
    name: "成为房主",
    iconfont: "icon-identity",
  },
  { id: 5, name: "个人资料", iconfont: "icon-myinfo" },
  { id: 6, name: "联系我们", iconfont: "icon-cust" },
];

// 默认头像
const DEFAULT_AVATAR = BASE_URL + "/img/profile/avatar.png";

export default class Profile extends Component {
  // 设置状态数据
  state = {
    isLogin: isAuth(),
    userInfo: {},
  };

  componentDidMount() {
    this.getUserInfo();
  }

  // 判断用户是否登录=》登录=》调用接口获取用户信息
  getUserInfo = async () => {
    const { isLogin, userInfo } = this.state;
    // 判断是否登录
    if (isLogin) {
      let { status, data } = await getUserData();
      // console.log(status, data);

      if (status === 200) {
        // 当前登录人的图片地址
        if (data.avatar) {
          // console.log(data.avatar);

          data.avatar = `${BASE_URL}${data.avatar}`;
        }
        this.setState({
          userInfo: data,
        });
      }
    } else {
      // 没登录
    }
  };

  // 退出
  logout = () => {
    // 给用户一个提示框，确认是否退出
    Modal.alert("提示", "您确定要退出登录吗???", [
      { text: "取消" },
      {
        text: "确定",
        onPress: async () => {
          // 退出逻辑=》退出接口
          let { status, description } = await logout();
          if (status === 200) {
            // 后端退出成功了
            // console.log(description, 2);
            Toast.info(description, 2);
            // 本地token删除
            delToken();
            // 跳到登录
            // this.props.history.push('/login')
            // 当前页面
            this.setState({
              isLogin: false,
              userInfo: {},
            });
          }
        },
      },
    ]);
  };

  render() {
    const { history } = this.props;
    const { userInfo, isLogin } = this.state;

    return (
      <div className={styles.root}>
        {/* 个人信息 */}
        <div className={styles.title}>
          <img
            className={styles.bg}
            src={BASE_URL + "/img/profile/bg.png"}
            alt="背景图"
          />
          <div className={styles.info}>
            <div className={styles.myIcon}>
              <img
                className={styles.avatar}
                src={userInfo.avatar || DEFAULT_AVATAR}
                alt="icon"
              />
            </div>
            <div className={styles.user}>
              {/* 登录前显示 */}
              <div className={styles.name}>{userInfo.nickname ?? "游客"}</div>
              {/* 登录后展示： */}
              {isLogin && (
                <>
                  <div className={styles.auth}>
                    <span onClick={this.logout}>退出</span>
                  </div>
                  <div
                    className={styles.edit}
                    onClick={() => history.push("/rent/add")}
                  >
                    发布房源
                    <span className={styles.arrow}>
                      <i className="iconfont icon-arrow" />
                    </span>
                  </div>
                </>
              )}

              {/* 未登录展示： */}
              {!isLogin ? (
                <div className={styles.edit}>
                  <Button
                    type="primary"
                    size="small"
                    inline
                    onClick={() => history.push("/login")}
                  >
                    去登录
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* 九宫格菜单 */}
        <Grid
          data={menus}
          columnNum={3}
          hasLine={false}
          renderItem={(item) =>
            item.to ? (
              <Link to={item.to}>
                <div className={styles.menuItem}>
                  <i className={`iconfont ${item.iconfont}`} />
                  <span>{item.name}</span>
                </div>
              </Link>
            ) : (
              <div className={styles.menuItem}>
                <i className={`iconfont ${item.iconfont}`} />
                <span>{item.name}</span>
              </div>
            )
          }
        />

        {/* 加入我们 */}
        <div className={styles.ad}>
          <img src={BASE_URL + "/img/profile/join.png"} alt="" />
        </div>
      </div>
    );
  }
}
