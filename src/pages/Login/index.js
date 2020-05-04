import React, { Component } from "react";
import { Flex, WingBlank, WhiteSpace, NavBar, Toast } from "antd-mobile";

import { Link } from "react-router-dom";

import styles from "./index.module.css";
import { login } from "../../utils/api/user";
import { setLocal, ZFW_TOKEN } from "../../utils";
import { withFormik } from "formik";
import * as yup from "yup";

// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/;
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/;

class Login extends Component {
  // 设置状态数据
  // state = {
  //   username: "",
  //   password: "",
  // };

  // 受控组件（双向数据绑定）
  // handlerChange = (e) => {
  //   // console.log(e.target);

  //   // 更新状态数据
  //   this.setState({
  //     [e.target.name]: e.target.value,
  //   });
  // };

  // 登录
  login = async (e) => {
    // 阻止默认事件
    e.preventDefault();
  };

  render() {
    const {
      values,
      touched,
      errors,
      handleChange,
      handleBlur,
      handleSubmit,
    } = this.props;
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavBar mode="light">账号登录</NavBar>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <form onSubmit={handleSubmit}>
            <div className={styles.formItem}>
              <input
                className={styles.input}
                name="username"
                value={values.username}
                onChange={handleChange}
                placeholder="请输入账号"
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {errors.username && (
              <div className={styles.error}>{errors.username}</div>
            )}
            <div className={styles.formItem}>
              <input
                className={styles.input}
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                placeholder="请输入密码"
              />
            </div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {errors.password && (
              <div className={styles.error}>{errors.password}</div>
            )}
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    );
  }
}

const NewLogin = withFormik({
  // 设置了状态数据
  mapPropsToValues: () => ({ username: "", password: "" }),

  // Custom sync validation
  // validate: values => {
  //   const errors = {};

  //   if (!values.name) {
  //     errors.name = 'Required';
  //   }

  //   return errors;
  // },

  // 校验：对象
  validationSchema: yup.object().shape({
    username: yup
      .string()
      .required("用户名必填！")
      .matches(REG_UNAME, "长度为5到8位，只能出现数字、字母、下划线"),
    password: yup
      .string()
      .required("密码必填！")
      .matches(REG_PWD, "长度为5到12位，只能出现数字、字母、下划线"),
  }),

  handleSubmit: async (values, { props: { history, location } }) => {
    // 获取用户名和密码
    const { username, password } = values;
    //  console.log(username, password);
    const { status, data, description } = await login({ username, password });
    console.log(status, data, description);

    if (status === 200) {
      Toast.success(description, 2);
      // 存储token
      setLocal(ZFW_TOKEN, data.token);
      // 跳转页面
      // 判断是否有回跳地址
      // if(location.data && location.data.backUrl) {
      if (location.data?.backUrl) {
        // 相当于上边的写法
        history.push(location.data.backUrl);
      } else {
        history.push("/home/profile");
      }
    } else {
      Toast.fail(description, 2);
    }
  },

  displayName: "BasicForm",
})(Login);
export default NewLogin;
