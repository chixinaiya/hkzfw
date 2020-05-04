// 用户相关接口

import api from "../../axios";
// import { getToken } from "../..";

// 登录

export function login(data) {
  return api.post("/user/login", data);
}

// 获取当前登录人的信息
export function getUserData() {
  return api.get("/user");
}
// 退出接口
export function logout() {
  return api.post("/user/logout");
}

// 根据房源id检查房源是否收藏过
export function checkHouseFav(id) {
  return api.get(`/user/favorites/${id}`);
}
// 添加收藏
export function addFav(id) {
  return api.post(`/user/favorites/${id}`);
}
// 删除收藏
export function delFav(id) {
  return api.delete(`/user/favorites/${id}`);
}
// 获取已发布房源
export const getUserHouses = () => {
  return api.get("/user/houses");
};
// 发布房源
export const pubHouse = (data) => {
  return api.post("/user/houses", data);
};
