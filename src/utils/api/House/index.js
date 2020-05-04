import api from "../../axios";

// 房源相关的所有接口
// 获取过滤器数据
export function getFilters(id) {
  return api.get("/houses/condition", {
    params: {
      id,
    },
  });
}
// 根据筛选器条件或取房源列表
export function getListByFilter(cityId, filters, start, end) {
  return api.get("/houses", {
    params: {
      cityId,
      // 组装的过滤器数据解构出来
      ...filters,
      // 分页
      start,
      end,
    },
  });
}
// 根据房源id获取房源信息
export function getDetailById(id) {
  return api.get(`/houses/${id}`);
}
// 上传图片
export function uploadImgs(fd) {
  return api.post(`/houses/image`, fd);
}
