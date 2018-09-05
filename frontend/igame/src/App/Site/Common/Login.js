// import React from 'react';
// import ReactDOM from 'react-dom';
//import 'antd-mobile/dist/antd-mobile.css'; // 这一句是从哪里引入的？
//import 'antd/dist/antd.css'; // 这一句是从哪里引入的？
import { Toast, Modal} from 'antd-mobile';
import { Models,session } from '../Models/Models'

class SiteLogin {
    // 注册 callback 登录成功后调用外部的 callback 函数
    constructor(callback) {
        //this.hasLogin = false;
        this.callback = callback; 
    }
    /**
     * show login window, call handeLogin callback function
     * handeLogin responsible for handle logins and invoking callbacks from outside registration
     */
    login() {
        console.log("this2......")
        console.log(this)
        const prompt = Modal.prompt;
        prompt(
            '用户登录',
            '请输入登录信息',
            this.handleLogin,
            'login-password',
            null,
            ['请输入用户名', '请输入密码'],
            'ios' //  android
        );
    }
    // 用户名密码由 prompt 调用时提供。
    
    handleLogin = (login, password) => {
        //alert(test);
        console.log(`login: ${login}, password: ${password}`)
        const json1 = {
            'server':'TT',
            'user': login,  //1174809@qq.com
            'password': password,//09090909
        }
        const cb = (data)=>{
            console.log(data)
            if (data.sid){
                session.set_sid(data.sid)
                Toast.success("登录成功！",1);
                this.callback();
            }else{
                Toast.fail('登录失败，请稍后重试！',1);
            }
        }
        const m = Models.create();
        m.query('login',json1,cb);
    }

}

//export default login;

export { SiteLogin }
