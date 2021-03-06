import React, { lazy, Suspense } from "react";

import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import Home from "./pages/Home";
// import CityList from "./pages/CityList";
// import Map from "./pages/Map";
// import NotFound from "./pages/NotFound";
// import HouseDetail from "./components/HouseDetail";
// import Login from "../src/pages/Login/index";
// import Rent from "./pages/Rent/index";
// import RentAdd from "./pages/Rent/Add";
// import Search from "./pages/Rent/Search";

// 懒加载写法
const CityList = lazy(() => import("./pages/CityList"));
const Map = lazy(() => import("./pages/Map"));
const NotFound = lazy(() => import("./pages/NotFound"));
const HouseDetail = lazy(() => import("./components/HouseDetail"));
const Login = lazy(() => import("../src/pages/Login/index"));
const Rent = lazy(() => import("./pages/Rent/index"));
const RentAdd = lazy(() => import("./pages/Rent/Add"));
const Search = lazy(() => import("./pages/Rent/Search"));

function App() {
  return (
    <Router>
      <Suspense fallback={<center>加载中...</center>}>
        <div className="app">
          <Switch>
            {/* 路由重定向 */}
            <Redirect exact from="/" to="/home" />
            {/* 一级路由 */}
            <Route path="/home" component={Home} />
            <Route path="/cityList" component={CityList} />
            <Route path="/map" component={Map} />
            {/* 登录路由 */}
            <Route path="/login" component={Login} />
            {/* 发布房源相关路由0 */}
            {/* 房源管理 */}
            <Route path="/rent" exact component={Rent} />
            {/* 添加房源 */}
            <Route path="/rent/add" component={RentAdd} />
            {/* 搜素房源 */}
            <Route path="/rent/search" component={Search} />

            {/* // 配置路由 */}
            <Route path="/detail/:id" component={HouseDetail} />
            {/* 配置404页面 */}
            <Route component={NotFound} />
          </Switch>
        </div>
      </Suspense>
    </Router>
  );
}

export default App;
