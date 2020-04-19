import React from 'react';

import {BrowserRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom'

import Home from './pages/Home'
import CityList from './pages/CityList'
import Map from './pages/Map'
import NotFound from './pages/NotFound'
function App() {
  return (
    <Router>
      <div className='app'>
      <Link to='/home'>首页</Link>
      <Link to='/cityList'>城市列表</Link>
      <Link to='/map'>地图找房</Link>
      <Switch>
        {/* 路由重定向 */}
        <Redirect exact from='/' to='/home'/>
        {/* 一级路由 */}
      <Route path='/home' component={Home}/>
      <Route path='/cityList' component={CityList}/>
      <Route path='/map' component={Map}/>
      {/* 配置404页面 */}
      <Route component={NotFound}/>
      </Switch>
      </div>
    </Router>
  );
}

export default App;
