import React from 'react';
import { Flex, WhiteSpace, InputItem, Toast, Button, NavBar, Icon, WingBlank  } from 'antd-mobile';
import './Login.css'
import 'antd-mobile/dist/antd-mobile.css'; // 这一句是从哪里引入的？
import { createForm } from 'rc-form';
// import { User } from '../Models/Models';
import User from '../OdooRpc/User';

class RsgisterForm extends React.Component{
    onSubmit = () => {   //表单提交方法
        this.props.form.validateFields({ force: true }, (error) => {  //输入验证，符合规则才向后后端交数据
            var formData = this.props.form.getFieldsValue();  //表单数据
                // console.log(formData.nickname)
                // console.log(formData.password2)
            if (!error) {
                if (formData.password!==formData.password2){
                    Toast.fail('两次输入的密码不一致！');
                }else{
                    const successCallback = ()=>{
                        Toast.success('注册成功！',1);
                        this.props.toLoginPage();   //注册成功，返回登录页面
                    }
                    const errorCallback =()=>{
                        Toast.fail('注册失败，请稍后重试！',1);
                    }
                    const m = new User(successCallback,errorCallback);
                    m.register(formData.phone, formData.password, formData.nickname);
                }
            } else {
                Toast.fail('您的输入有误！');
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
    validateNickName = (rule, value, callback) => {  //手机号输入验证规则
        if (value && value.length > 8) {
            callback(new Error('昵称8个字以内'));
        } else {
            callback();
        }
    }
    validatePwd = (rule, value, callback) => {  //密码输入验证规则
        if (value && value.length < 6) {
            callback(new Error('密码至少输入六位'));
        } else {
            callback();
        }
    }

    render () {
        const { getFieldProps, getFieldError } = this.props.form;
        return(
        <form>
            <NavBar
                mode="light"
                icon={<Icon type="left" />}
                onLeftClick={this.props.toLoginPage}
                >注册
            </NavBar>
            <WhiteSpace size="xl" />
            <WhiteSpace size="xl" />
            <Flex direction='column'>
            <InputItem
            {...getFieldProps('nickname',{
                rules: [
                    { required: true, message: '昵称尚未填写！' },
                    { validator: this.validateNickName },
                ],
            })}
            clear
            error={!!getFieldError('nickname')}
            onErrorClick={() => {
                Toast.info(getFieldError('nickname').join('、'));
            }}
            // type="phone"
            placeholder="请输入您的昵称"
        >昵称</InputItem>
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
                placeholder="请输入您的手机号"
            >手机号</InputItem>
            <WhiteSpace size="sm" />
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
                placeholder="请输入您的登录密码"
            >  密码</InputItem>
            <WhiteSpace size="sm" />
            <InputItem
                {...getFieldProps('password2',{
                    rules: [
                        { required: true, message: '确认密码不能为空！' },
                        { validator: this.validatePwd },
                    ],
                })}
                clear
                error={!!getFieldError('password2')}
                onErrorClick={() => {
                    Toast.info(getFieldError('password2').join('、'));
                }}
                type="password"
                placeholder="请确认登录密码"
            >  确认密码</InputItem>
            <WhiteSpace size="sm" />
            <WingBlank size="lg"><p>密码由6-20位英文字母、数字、符号组成</p></WingBlank>
            
            <WhiteSpace size="xl" />
            <WhiteSpace size="xl" />
            <Button type=""  onClick={this.onSubmit} className='register-btn'>注册</Button>
            <WhiteSpace size="lg" />
            <p className='text' >注册即代表您已同意<a>《智赛桥牌隐私政策》</a></p>
            </Flex>
        </form>
        ); 
    } 
}
const RegisterPage = createForm()(RsgisterForm);
export default RegisterPage