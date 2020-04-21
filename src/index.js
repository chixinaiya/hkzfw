import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// 组件库的样式
// import 'antd-mobile/dist/antd-mobile.css'
// 字体图标库的样式
import './assets/fonts/iconfont.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <App />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
