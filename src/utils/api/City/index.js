// 首页相关的所有接口
import api from "../../axios";

// 根据城市名称查询城市信息
export function getCityInfo(name) {
  return api.get("/area/info", {
    params: {
      name,
    },
  });
}
// 获取城市列表数据
export function getCityList(level = 1) {
  return api.get("/area/city", {
    params: {
      level,
    },
  });
}
// 获取热门城市
export function getHotCity() {
  return api.get("/area/hot");
}
// 获取城市小区相关信息
export function getCommunity(id, name) {
  return api.get("/area/community", {
    params: {
      id,
      name,
    },
  });
}
// 地图下钻查询房源信息
export function getMapHouse(id) {
  return api.get("/area/map", {
    params: {
      id,
    },
  });
}
