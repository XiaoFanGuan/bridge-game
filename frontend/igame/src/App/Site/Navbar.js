import React from 'react';
import { NavBar } from 'antd-mobile';
import { Icon } from 'antd';
// import { SiteLogin} from './Common/Login';
// import { session } from './Models/Models'
// import { SiteRegister } from './Common/Register';
//import Menu from './Menu'

class Navbar extends React.Component {
    
    // state={
    //     hasLogin:this.props.zt
    // }
    // constructor(){
    //     super();
    //     if(session.get_sid()) this.state.hasLogin = true;
    // }
    // handleLogout = () => {
    //     session.destroy();
    //     this.props.toggleHasLogin();
    //     // this.setState({hasLogin:false})
    // }
    // handleLogin = () => {
    //     const login = new SiteLogin( this.props.toggleHasLogin );  // 注册进来一个 callback 函数，下面登录后会调用这个回调函数。
    //     login.login();
    //     //console.log('login1111:'+JSON.stringify(l))
    // }
    // handleRegister = ()=>{
    //     // const register = new SiteRegister( ()=>this.setState({hasLogin:true}) ); //注册进来一个 callback ，注册成功后调用
    //     const register = new SiteRegister( ()=>{console.log('这是一个回调 ^_^ ')} ); //     *******这里还要在做处理********
    //     register.register();
    // }
    // rightContent(){
    //     console.log('haslogin2.............')
    //     // console.log(this.state.hasLogin)
    //     return this.props.hasLogin ? 
    //     // return this.state.hasLogin ? 
    //         <span key="2" style={{ fontSize: '12px' }}><Icon onClick={this.handleLogout} type="logout" style={{ margin: '5px' }} />退出</span> :
    //     [
    //         <span key="1" style={{ fontSize: '12px' }}><Icon onClick={this.handleLogin} type="login" style={{ margin: '5px' }} />登录</span>,
    //         <span key="3" style={{ fontSize: '12px' }}><Icon onClick={this.handleRegister} type="logout" style={{ margin: '5px' }} />注册</span>
    //     ]
    // }
    render() {
        return (
                <NavBar
                    //style={{ backgroundImage: 'url()' }}
                    mode="dark"
                    icon={<Icon type="bars" style={{ fontSize: '24px' }} />}
                    onLeftClick={this.props.toggleMenuBar}
                    // rightContent={this.rightContent()}
                >智赛桥牌</NavBar>
        );
    }
}

export default Navbar;