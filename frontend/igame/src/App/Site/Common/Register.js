// import React from 'react';
// import ReactDOM from 'react-dom';

import { Modal, Toast } from 'antd-mobile';
import { Models } from '../Models/Models';

class SiteRegister {
    // 注册 callback 登录成功后调用外部的 callback 函数
    constructor(callback) {
        //this.hasLogin = false;
        this.callback = callback;
    }
    /**
     * show register window, call handeRegister callback function
     * handeRegister responsible for register and invoking callbacks from outside registration
     */
    register(){
        const prompt = Modal.prompt;
        prompt(
            '注册新用户',
            '请输入注册信息',
            this.handRegister,
            'login-password',
            null,
            ['请输入用户名', '请输入密码'],
            'ios' //android
        );
    }
    //用户名和密由 prompt 调用时提供。

    handRegister = (user,password) => {
        console.log('11...........')
        console.log(`user:${user},password:${password}`)
        const json = {
            'server':'TT',
            'user':user,
            'password':password
        }
        console.log(json)
        const cb = (data)=>{
            console.log('2..........')
            console.log(data)
            // if (data.sid){
            if (data){   
                // session.set_sid(data.sid);       *****这里还需要再做处理*****
                Toast.success('注册成功，您可以登录了！',1);
                this.callback();
            }else{
                Toast.fail('注册失败，请稍后重试！',1);
            }
        }


        const m = Models.create();
        m.query('register',json,cb)

    }



}

export { SiteRegister };

