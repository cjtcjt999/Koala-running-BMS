import React from 'react'
import {Row,Col} from "antd"
import './index.less'
import Util from '../../utils/utils'
import axios from 'axios'
import { connect } from 'react-redux'
class Header extends React.Component{
    state={
        menuName: ''
    }
    componentDidMount(){
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const menuName = localStorage.getItem("menuName");
        this.setState({
            realName: userInfo && userInfo.realName,
            menuName
        })
        setInterval(()=>{
            let sysTime = Util.formateDate(new Date().getTime());
            this.setState({
                sysTime
            })
        },1000)
        this.getWeatherAPIData();
    }
    
    getWeatherAPIData(){
        let city = 'hangzhou';
        axios.get('https://api.66mz8.com/api/weather.php?location='+encodeURIComponent(city)).then((res)=>{
            if(res.data.code === 200){
                let data = res.data.data[0];
                console.log(data)
                this.setState({
                    weather:data.weather,
                    weatherIcon:data.weather_icon
                })
            }
        })
    }

    handleQuit() {
        localStorage.removeItem("userInfo")
        localStorage.removeItem("menuName")
    }

    render(){
      const menuType = this.props.menuType
        return(
            <div className="header">
                <Row className="header-top">
                  {
                    menuType?
                      <Col span="6"className="logo">
                          <img src="/assets/logo-ant.svg" alt=""/>
                          <span>校园跑腿信息平台</span>
                      </Col>
                      :''
                  }
                    <Col span={menuType?18:24}>
                        <span>欢迎，{this.state.realName}</span>
                        <a href="#" onClick={this.handleQuit}>退出</a>
                    </Col>
                </Row>
                {
                  menuType?'':
                  <Row className="breadcrumb">
                    <Col span="4"className="breadcrumb-title">
                        {this.props.menuName === '首页' ? this.state.menuName : this.props.menuName}
                    </Col>
                    <Col span="20"className="weather">
                        <span className="date">{this.state.sysTime}</span>
                        <span className="weather-detail">
                            {this.state.weather}
                            <img style={{marginLeft:'5px',marginBottom:'5px'}} src={this.state.weatherIcon}/>
                        </span>
                    </Col>
                </Row>
                }
                
            </div>
        );
    }
}
const mapStateToProps = state =>{
    return {
        menuName:state.menuName
    }
}
export default connect(mapStateToProps)(Header);