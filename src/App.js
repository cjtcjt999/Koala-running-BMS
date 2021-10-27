import React from 'react';
import './App.css';
import { message } from 'antd';
import { withRouter } from 'react-router-dom';

class App extends React.Component {
  UNSAFE_componentWillReceiveProps(nextProps) {
    // 判断跳转路由不等于当前路由
    const nextPathname = nextProps.location.pathname;
    if (nextPathname !== this.props.location.pathname && nextPathname.substring(nextPathname.length - 5) !== 'login' && nextPathname.length !== 1) {
      const userInfo = localStorage.getItem("userInfo");
      if (!userInfo) {
        message.error('请先进行登录');
        window.location.href=('/#/login')
      }
    }
  }

  render(){
    return (
      <div>
        {this.props.children}
      </div>
    );
}
}
export default withRouter(App);
