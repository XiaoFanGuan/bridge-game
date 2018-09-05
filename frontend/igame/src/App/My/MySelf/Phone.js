import React from 'react';
import { NavBar, Icon, InputItem, Flex, Toast, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import My from '../../OdooRpc/My';
class CodeForm extends React.Component {
    state = {
        msg: '获取验证码',   //获取验证码按钮文字
        timer: null        //倒计时
    }
    onSubmit = () => {   //表单提交方法
        this.props.form.validateFields({ force: true }, (error) => {  //输入验证，符合规则才向后后端交数据
            var formData = this.props.form.getFieldsValue();  //表单数据
            console.log(formData, 'zzzzzzzzzzzzzzzzzzz')
            if (!error) {
                console.log(formData.phone)
                console.log(formData.code)
                const m = new My((data) => this.success2(data), () => console.log('没有发送'));
                m.bind_phone(formData.phone, formData.code);
                //  注意：此处应该先把手机号和验证码提交到后端做验证
                clearInterval(this.state.timer);    //清除发送验证码的计时器
                this.props.setUser(formData.phone, formData.code1);
                this.props.tooglePages();
            } else {
                Toast.fail('您的输入有误！');
            }
        });
    }
    success2 = (data) => {
        Toast.fail('修改成功！');
        this.props.loginOut();
        this.props.toMine();
    }
    error = (data) => {
        Toast.fail('修改失败');
    }
    onSubmitNumber = () => {   //表单提交方法

        this.props.form.validateFields({ force: true }, (error) => {  //输入验证，符合规则才向后后端交数据
            var formData = this.props.form.getFieldsValue();  //表单数据
            if (!error) {

                // const m = new My(((result) =>this.success(result), () => console.log('没有发送')));
                const m = new My((data) => this.success2(data), (data) => this.error(data));
                m.bind_phone(formData.phone, formData.code);
            } else {
                Toast.fail('您的输入有误！');
            }
        });
    }
    success = (data) => {
        if (data) {
            Toast.fail(' 修改成功');
        } else {
            Toast.fail('验证码错误或账号错误')
        }

    }
    getCode = () => {   //表单提交方法
        this.props.form.validateFields({ force: true }, (error) => {  //输入验证，符合规则才向后后端交数据
            var formData = this.props.form.getFieldsValue();  //表单数据
            if (!error || !error.phone) {
                const m = new My((data) => this.setState({ data: data }), () => console.log('没有发送'));
                m.sms_verification(formData.phone.replace(/\s+/g, ""))
                //  注意：此处应该吧手机号发送至后端，获取验证码，然后在进行下面的操作
                var t = 60;
                this.setState({              //把倒计时放入state的timer,以便在其他函数清除
                    timer: setInterval(() => {
                        if (t === 0) {
                            this.setState({ msg: '获取验证码' })
                            t = 60;
                            clearInterval(this.state.timer);
                        } else {
                            this.setState({ msg: "重发(" + t + ")" })
                            t--;
                            // console.log(t)
                        }
                    }, 1000)
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

    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        return (
            <div>
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.toMySelf()}
                >手机
            </NavBar>
                <Flex align="baseline">
                    <InputItem
                        {...getFieldProps('phone', {
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
                        placeholder="请输入新手机号"
                    >手机号</InputItem>
                    <Button type="" className='code-btn' onClick={() => this.getCode(this)}
                        value={this.state.msg}
                        disabled={this.state.msg === "获取验证码" ? false : true}
                    >
                        {this.state.msg}
                    </Button>
                </Flex>
                <InputItem
                    {...getFieldProps('code', {
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
                <Button type="" onClick={this.onSubmitNumber} className='login-btn'>完成</Button>
            </div>
        )
    }
}
const Phone = createForm()(CodeForm);
export default Phone;
