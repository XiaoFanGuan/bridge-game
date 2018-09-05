import React from 'react';
import { Flex, WhiteSpace, InputItem, Toast, Button, NavBar, Icon, WingBlank } from 'antd-mobile';
import './Login.css'
import 'antd-mobile/dist/antd-mobile.css'; // 这一句是从哪里引入的？
import { createForm } from 'rc-form';
// import { User } from '../Models/Models';
import User from '../OdooRpc/User';

export default class FindPwdPage extends React.Component{
    state = {
        openCodePage:true,
        user:null
    }
    setUser = (num)=>{
        this.setState({
            user:num
        })
    }
    tooglePages = ()=>{
        this.setState({
            openCodePage:!this.state.openCodePage
        })
    }
    render () {
        return(
        this.state.openCodePage ? 
        <CodePage toLoginPage={this.props.toLoginPage} tooglePages={this.tooglePages} setUser={this.setUser} /> 
        :
        <SubmitNewPasswordPage tooglePages={this.tooglePages} toLoginPage={this.props.toLoginPage} user={this.state.user} />
        );
    } 
}

class CodeForm extends React.Component{
    state={
        msg:'获取验证码',   //获取验证码按钮文字
        timer:null        //倒计时
    }
    onSubmit = () => {   //表单提交方法
        this.props.form.validateFields({ force: true }, (error) => {  //输入验证，符合规则才向后后端交数据
            var formData = this.props.form.getFieldsValue();  //表单数据
            if (!error) {
                console.log(formData.phone)
                console.log(formData.code)

                //  注意：此处应该先把手机号和验证码提交到后端做验证
                clearInterval(this.state.timer);    //清除发送验证码的计时器
                this.props.setUser(formData.phone);
                this.props.tooglePages();
            } else {
                Toast.fail('您的输入有误！');
            }
        });
    }
    getCode = () => {   //表单提交方法
        this.props.form.validateFields({ force: true }, (error) => {  //输入验证，符合规则才向后后端交数据
            var formData = this.props.form.getFieldsValue();  //表单数据
            if (!error || !error.phone) {

                //  注意：此处应该吧手机号发送至后端，获取验证码，然后在进行下面的操作
                console.log(formData.phone)
                var t=60;
                this.setState({              //把倒计时放入state的timer,以便在其他函数清除
                    timer:setInterval(()=>{
                        if(t===0){
                            this.setState({msg:'获取验证码'})  
                            t=60;
                            clearInterval(this.state.timer);
                        }else{
                            this.setState({msg:"重发(" + t + ")"})
                            t--; 
                            // console.log(t)
                        }   
                    },1000)     
                })
            } else {
                Toast.fail('手机号输入有误！');
            }
        });
    }
    validateAccount = (rule, value, callback) => {  //手机号输入验证规则
        if (value && value.replace(/\s/g, '').length < 11) {
            callback(new Error('Please enter 11 digits'));
        } else {
            callback();
        }
    }
    validateCode = (rule, value, callback) => {  //手机号输入验证规则
        if (value && value.length !== 4) {
            callback(new Error('请输入4位验证码'));
        } else {
            callback();
        }
    }
    render () {
        const { getFieldProps, getFieldError } = this.props.form;
        return(
        <form className="flex-container">
            <NavBar
                mode="light"
                icon={<Icon type="left" />}
                onLeftClick={this.props.toLoginPage}
                >找回密码
            </NavBar>
            <Flex direction='column'>
                <WhiteSpace size="lg" />
                <Flex align="baseline">
                    <InputItem
                        {...getFieldProps('phone',{
                            rules: [
                                { required: true, message: '手机号尚未填写！' },
                                { validator: this.validateAccount },
                            ],
                        })}
                        clear
                        error={!!getFieldError('phone')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('phone').join('、'));
                        }}
                        type="phone"
                        placeholder="请输入手机号"
                    >手机号</InputItem>
                    <p className='find-p' > | </p>
                    <Button type=""  className='code-btn' onClick={()=>this.getCode(this)}
                        value={this.state.msg} 
                        disabled={this.state.msg==="获取验证码"?false:true}
                        >
                        {this.state.msg}
                    </Button>
                </Flex>
                <WhiteSpace size="lg" />
                <Flex align="baseline">
                    <InputItem
                        {...getFieldProps('code',{
                            rules: [
                                { required: true, message: '验证码不能为空！' },
                                { validator: this.validateCode },
                            ],
                        })}
                        clear
                        error={!!getFieldError('code')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('code').join('、'));
                        }}
                        type="number"
                        placeholder="请输入验证码"
                    >验证码</InputItem>
                    <p style={{margin:'0px 70px'}} > </p>
                </Flex>
                <WhiteSpace size="xl" />
                <WhiteSpace size="xl" />
                <Flex align="baseline">
                    <Button type=""  className='next-btn' onClick={()=>this.onSubmit()} >下一步</Button>
                </Flex>
            </Flex>
        </form>
        );
    }
}
const CodePage = createForm()(CodeForm);

class NewPwdForm extends React.Component{
    success = ()=>{
        this.props.form.validateFields({ force: true }, (error) => {  //输入验证，符合规则才向后后端交数据
            var formData = this.props.form.getFieldsValue();  //表单数据
            if (!error) {
                if (formData.password!==formData.password2){
                    Toast.fail('两次输入的密码不一致！');
                }else{
                    const successCallback = (data)=>{
                        Toast.success('密码修改成功！',1);
                        this.props.tooglePages();
                        this.props.toLoginPage();       //修改成功，返回登录页
                    }
                    const errorCallback =()=>{
                        Toast.fail('修改失败，请稍后重试！',1);
                    }
                    const m = new User(successCallback,errorCallback);
                    m.resetPassword(this.props.user, formData.password );
                }
            } else {
                Toast.fail('您的输入不正确！');
            }
        });
    }
    validatePwd = (rule, value, callback) => {  //密码输入验证规则
        if ( (value && value.length < 6 ) || (value && value.length > 20) ) {
            callback(new Error('密码应在6-20位之间'));
        } else {
            callback();
        }
    }
    render () {
        const { getFieldProps, getFieldError } = this.props.form;
        return(
        <form className="flex-container">
            <NavBar
                mode="light"
                icon={<Icon type="left" />}
                onLeftClick={this.props.tooglePages}
                >找回密码
            </NavBar>
            <Flex direction='column'>
                <WhiteSpace size="lg" />
                <InputItem
                    {...getFieldProps('password',{
                        rules: [
                            { required: true, message: '密码不能为空！' },
                            { validator: this.validatePwd },
                        ],
                    })}
                    clear
                    error={!!getFieldError('password')}
                    onErrorClick={() => {
                        Toast.info(getFieldError('password').join('、'));
                    }}
                    type="password"
                    placeholder="请输入新的登录密码"
                >新密码</InputItem>
                <WhiteSpace size="sm" />
                <InputItem
                    {...getFieldProps('password2',{
                        rules: [
                            { required: true, message: '密码不能为空！' },
                            { validator: this.validatePwd },
                        ],
                    })}
                    clear
                    error={!!getFieldError('password2')}
                    onErrorClick={() => {
                        Toast.info(getFieldError('password2').join('、'));
                    }}
                    type="password"
                    placeholder="请确认新密码"
                >确认新密码</InputItem>
                <WhiteSpace size="sm" />
                <WingBlank size="lg"><p>密码由6-20位英文字母、数字、符号组成</p></WingBlank>
                <WhiteSpace size="xl" />
                <WhiteSpace size="xl" />
                <WhiteSpace size="xl" />
                <Button type=""  className='next-btn' onClick={()=>this.success()} >新密码确认</Button>
            </Flex>
        </form>
        );
    }
}
const SubmitNewPasswordPage = createForm()(NewPwdForm);
