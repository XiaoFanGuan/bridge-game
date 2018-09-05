import React from 'react';
import LoginPage from './Login';
import RegisterPage from './Register';
import FindPwdPage from './FindPwd';
export default class User extends React.Component{
    state = {
        page:'login'
    }
    toLoginPage = ()=>{
        this.setState({
            page:'login'
        });
    }
    toRegisterpage = ()=>{
        this.setState({
            page:'register'
        })
    }
    toFindPwdpage = ()=>{
        this.setState({
            page:'findpwd'
        })
    }
    render() {
        switch (this.state.page) {
            case 'login':
                return <LoginPage toggleLoginState={this.props.toggleLoginState} goHome={this.props.goHome} toRegisterpage={this.toRegisterpage} toFindPwdpage={this.toFindPwdpage} />
            case 'register':
                return <RegisterPage toLoginPage={this.toLoginPage} />
            case 'findpwd':
                return <FindPwdPage toLoginPage={this.toLoginPage} />
            default:
                break;
        }
        
    }
}