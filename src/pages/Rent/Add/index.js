import React, { Component } from "react";

import {
  Flex,
  List,
  InputItem,
  Picker,
  ImagePicker,
  TextareaItem,
  Modal,
  NavBar,
  Icon,
  Toast,
} from "antd-mobile";

import HousePackage from "../../../components/HousePackage";

import styles from "./index.module.css";
import { uploadImgs } from "../../../utils/api/House";
import { pubHouse } from "../../../utils/api/user";

const alert = Modal.alert;

// 房屋类型
const roomTypeData = [
  { label: "一室", value: "ROOM|d4a692e4-a177-37fd" },
  { label: "二室", value: "ROOM|d1a00384-5801-d5cd" },
  { label: "三室", value: "ROOM|20903ae0-c7bc-f2e2" },
  { label: "四室", value: "ROOM|ce2a5daa-811d-2f49" },
  { label: "四室+", value: "ROOM|2731c38c-5b19-ff7f" },
];

// 朝向：
const orientedData = [
  { label: "东", value: "ORIEN|141b98bf-1ad0-11e3" },
  { label: "西", value: "ORIEN|103fb3aa-e8b4-de0e" },
  { label: "南", value: "ORIEN|61e99445-e95e-7f37" },
  { label: "北", value: "ORIEN|caa6f80b-b764-c2df" },
  { label: "东南", value: "ORIEN|dfb1b36b-e0d1-0977" },
  { label: "东北", value: "ORIEN|67ac2205-7e0f-c057" },
  { label: "西南", value: "ORIEN|2354e89e-3918-9cef" },
  { label: "西北", value: "ORIEN|80795f1a-e32f-feb9" },
];

// 楼层
const floorData = [
  { label: "高楼层", value: "FLOOR|1" },
  { label: "中楼层", value: "FLOOR|2" },
  { label: "低楼层", value: "FLOOR|3" },
];

export default class RentAdd extends Component {
  constructor(props) {
    super(props);
    // 小区赋值
    const { data = {} } = this.props.location;
    let community = {
      id: "",
      name: "",
    };
    // if (data) {
    community = {
      id: data.id,
      name: data.name,
      // };
    };
    this.state = {
      // 临时图片地址
      tempSlides: [],

      // 小区的名称和id
      community: community,
      // 价格
      price: "",
      // 面积
      size: "",
      // 房屋类型
      roomType: "",
      // 楼层
      floor: "",
      // 朝向：
      oriented: "",
      // 房屋标题
      title: "",
      // 房屋图片
      houseImg: "",
      // 房屋配套：
      supporting: "",
      // 房屋描述
      description: "",
    };
  }

  // 取消编辑，返回上一页
  onCancel = () => {
    alert("提示", "放弃发布房源?", [
      {
        text: "放弃",
        onPress: async () => this.props.history.go(-1),
      },
      {
        text: "继续编辑",
      },
    ]);
  };

  // 处理输入选择相关的组件（双向数据绑定、受控组件）
  handlerInput = (val, name) => {
    this.setState({
      [name]: val,
    });
  };

  // 发布房源
  addHouse = async () => {
    // 先上传图片
    // 获取本地图片基本信息
    const {
      tempSlides,
      title,
      description,
      oriented,
      price,
      roomType,
      size,
      floor,
      community,
    } = this.state;
    // 获取房屋配套数据
    let supporting = this.supporting;
    // 边界处理（验证）
    if (!title || !size || !price || tempSlides.length === 0) {
      return Toast.fail("请输入房源基本信息！");
    }
    // 服务器存储的图片地址
    let serverImgs;
    if (tempSlides.length) {
      // 上传到服务器=》获取服务器的图片存储路径
      // 处理本地图片数据
      let fd = new FormData();
      tempSlides.forEach((item) => fd.append("file", item.file));
      let { status, data } = await uploadImgs(fd);
      if (status === 200) {
        serverImgs = data.join("|");
      }

      // 处理表单其他数据
      let postData = {
        community: community.id,
        price,
        size,
        roomType,
        floor,
        oriented,
        description,
        houseImg: serverImgs,
        supporting,
        title,
      };
      // 调用接口发布房源
      let res = await pubHouse(postData);
      if (res.status === 200) {
        Toast.success("发布成功！", 1, () => {
          // 跳转到房源管理
          this.props.history.push("/rent");
        });
      } else {
        // token失效的情况。发布房源传递的数据不对
        Toast.fail("发布失败！");
      }
    }
  };

  render() {
    const Item = List.Item;
    const { history } = this.props;
    const {
      community,
      price,
      size,
      roomType,
      floor,
      oriented,
      description,
      tempSlides,
      title,
    } = this.state;

    return (
      <div className={styles.root}>
        <NavBar
          className={styles.navHeader}
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={this.onCancel}
        >
          发布房源
        </NavBar>
        <List
          className={styles.header}
          renderHeader={() => "基本信息"}
          data-role="rent-list"
        >
          {/* 选择所在小区 */}
          <Item
            extra={community.name || "请选择小区名称"}
            arrow="horizontal"
            onClick={() => history.replace("/rent/search")}
          >
            小区名称
          </Item>
          <InputItem
            placeholder="请输入租金/月"
            extra="￥/月"
            type="number"
            onChange={(v) => {
              this.handlerInput(v, "price");
            }}
            value={price}
          >
            租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金
          </InputItem>
          <InputItem
            placeholder="请输入建筑面积"
            extra="㎡"
            type="number"
            onChange={(v) => {
              this.handlerInput(v, "size");
            }}
            value={size}
          >
            建筑面积
          </InputItem>
          <Picker
            data={roomTypeData}
            onChange={(v) => {
              this.handlerInput(v[0], "roomType");
            }}
            value={[roomType]}
            cols={1}
          >
            <Item arrow="horizontal">
              户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型
            </Item>
          </Picker>

          <Picker
            data={floorData}
            onChange={(v) => {
              this.handlerInput(v[0], "floor");
            }}
            value={[floor]}
            cols={1}
          >
            <Item arrow="horizontal">所在楼层</Item>
          </Picker>
          <Picker
            data={orientedData}
            onChange={(v) => {
              this.handlerInput(v[0], "oriented");
            }}
            value={[oriented]}
            cols={1}
          >
            <Item arrow="horizontal">
              朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向
            </Item>
          </Picker>
        </List>

        <List
          className={styles.title}
          renderHeader={() => "房屋标题"}
          data-role="rent-list"
        >
          <InputItem
            placeholder="请输入标题（例如：整租 小区名 2室 5000元）"
            onChange={(v) => {
              this.handlerInput(v, "title");
            }}
            value={title}
          />
        </List>

        <List
          className={styles.pics}
          renderHeader={() => "房屋图像"}
          data-role="rent-list"
        >
          <ImagePicker
            files={tempSlides}
            multiple={true}
            onChange={(files) => {
              this.setState({
                tempSlides: files,
              });
            }}
            className={styles.imgpicker}
          />
        </List>

        <List
          className={styles.supporting}
          renderHeader={() => "房屋配置"}
          data-role="rent-list"
        >
          <HousePackage
            select
            onSelect={(val) => {
              // console.log(val);
              this.supporting = val.join("|");
              // console.log(this.supporting);
            }}
          />
        </List>

        <List
          className={styles.desc}
          renderHeader={() => "房屋描述"}
          data-role="rent-list"
        >
          <TextareaItem
            rows={5}
            placeholder="请输入房屋描述信息"
            autoHeight
            onChange={(v) => {
              this.handlerInput(v, "description");
            }}
            value={description}
          />
        </List>

        <Flex className={styles.bottom}>
          <Flex.Item className={styles.cancel} onClick={this.onCancel}>
            取消
          </Flex.Item>
          <Flex.Item className={styles.confirm} onClick={this.addHouse}>
            提交
          </Flex.Item>
        </Flex>
      </div>
    );
  }
}
