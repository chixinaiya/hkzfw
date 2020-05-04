// 封装axios
// 1.创建一个axios实例
// 2.给axios添加拦截器
import axios from "axios";
import { Toast } from "antd-mobile";
import { getToken } from ".";

// const BASE_URL = "https://api-haoke-dev.itheima.net";

const BASE_URL = "https://api-haoke-web.itheima.net";
// 1.创建一个axios实例
const myAxios = axios.create({
  baseURL: BASE_URL,
});
// Add a request interceptor
// 请求拦截器
myAxios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    // 加载动画效果 0是只要不手动停止就一直加载
    Toast.loading("加载中...", 0);
    // 统一加token
    // 给哪些接口加？
    // 白名单=》定义不要加token的接口
    const { url, headers } = config;
    const whiteName = ["/user/login", "/user/registered"];
    // 用户相关的接口需要加（排除白名单）
    if (url.startsWith("/user") && !whiteName.includes(url)) {
      headers.authorization = getToken();
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
// 响应拦截器
myAxios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // 请求成功关闭
    Toast.hide();
    // 设计一个新的简化的数据结构然后返回
    let _res = {
      status: response.data.status,
      data: response.data.body,
      description: response.data.description,
    };

    return _res;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
export default myAxios;
export { BASE_URL };
