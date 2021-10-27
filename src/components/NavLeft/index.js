import React from 'react'
import MenuConfig from './../../config/menuConfig'
import { Menu } from 'antd'
import { connect } from 'react-redux'
import { switchMenu } from './../../redux/action'
import './index.less'
import { Link } from 'react-router-dom'
const { SubMenu } = Menu;

class NavLeft extends React.Component{
    state = {
        currentKey:''
    }
    componentWillMount(){
        const menuTreeNode = this.renderMenu(MenuConfig);
        let currentKey = window.location.hash.replace(/#|\?.*$/g,'')
        this.setState({
            currentKey,
            menuTreeNode
        })
    }
    handleClick = (item) =>{
        const { dispatch } = this.props;
        localStorage.setItem("menuName", item.item.props.title)
        dispatch(switchMenu(item.item.props.title))
        this.setState({
            currentKey:item.key
        })
    }
    //菜单渲染
    renderMenu = (data)=>{
        return data.map((item)=>{
            if(item.children){//如果有子节点再递归一次直到没有子节点
                return(
                    <SubMenu icon={item.icon} title={item.title} key={item.key}>
                        {this.renderMenu(item.children)}
                    </SubMenu>
                )
            }
            return  <Menu.Item icon={item.icon} title={item.title} key={item.key}>
                <Link to={item.key}>{item.title}</Link>
            </Menu.Item>
        })
    }
    render(){
     
        return(
            <div>
                <div className="logo">
                    <img src="/assets/logo.png" alt=""/>
                    <h1>考拉跑腿管理平台</h1>
                </div>
                <Menu 
                theme="dark"
                mode="inline" 
                selectedKeys={this.state.currentKey}
                onClick={this.handleClick}
                >
                    {this.state.menuTreeNode}
                </Menu>
            </div>
        );
    }
}
export default connect()(NavLeft)