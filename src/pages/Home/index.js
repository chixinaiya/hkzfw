import React,{Component} from 'react'
import {Route, Link} from 'react-router-dom'
import Index from '../Index'
import House from '../House'
import Profile from '../Profile'

class Home extends Component{
 
  render(){
    return(
     <div>
       {/* 配置二级路由 */}
      <Link to='/home'>首页</Link>
      <Link to='/home/house'>找房</Link>
      <Link to='/home/profile'>我的</Link>
      <Route exact path='/home' component={Index}/>
      <Route path='/home/house' component={House}/>
      <Route path='/home/profile' component={Profile}/>
     </div>
    )
  }
}
export default Home
