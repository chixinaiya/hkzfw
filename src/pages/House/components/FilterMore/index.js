import React, { Component } from "react";

import FilterFooter from "../../../../components/FilterFooter";

import styles from "./index.module.css";

export default class FilterMore extends Component {
  // 设置状态数据
  state = {
    // 当前选中的条件数据
    selected: this.props.value,
  };

  // 处理选中的条件数据
  hanlderSel = (id) => {
    // console.log(id);
    // 获取状态数据
    const { selected } = this.state;
    let newSelected = [...selected];
    // 判断当前在数组中存在=》删除、添加
    let index = newSelected.indexOf(id);
    if (index < 0) {
      // 没有
      newSelected.push(id);
    } else {
      // 存在删除
      newSelected.splice(index, 1);
    }
    // 更新数据和页面
    this.setState({
      selected: newSelected,
    });
  };

  // 渲染标签
  renderFilters(data) {
    // const { selected } = this.state;
    // 高亮类名： styles.tagActive
    return data.map((item) => (
      <span
        onClick={() => this.hanlderSel(item.value)}
        key={item.value}
        className={[
          styles.tag,
          this.state.selected.includes(item.value) ? styles.tagActive : "",
        ].join(" ")}
      >
        {item.label}
      </span>
    ));
  }

  render() {
    // console.log(this.props);
    const {
      onOK,
      onCancle,
      data: { oriented, floor, roomType, characteristic },
    } = this.props;
    // console.log(data);

    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} onClick={onCancle} />
        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>
        {/* 底部按钮 */}
        <FilterFooter
          className={styles.footer}
          onOK={() => onOK(this.state.selected)}
          onCancle={onCancle}
        />
      </div>
    );
  }
}
