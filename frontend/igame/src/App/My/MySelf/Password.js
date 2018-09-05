import React from 'react';
import { NavBar, Icon, InputItem, Flex, Toast, Button, WhiteSpace } from 'antd-mobile';
import { createForm } from 'rc-form';
import My from '../../OdooRpc/My';
class BasicInput extends React.Component {
    state = {
        data: null
    }
    validateAccount = (rule, value, callback) => {  //输入验证规则

        if (!value || value.length < 6 || value.length > 20) {
            callback(new Error('密码超过6个字符小于20个字符'));
        } else {
            callback();
        }
    }
    onSubmit = () => {   //表单提交方法
        this.props.form.validateFields({ force: true }, (error) => {  //输入验证，符合规则才向后后端交数据
            var formData = this.props.form.getFieldsValue();  //表单数据
            if (formData.new_passwrd1 !== formData.new_passwrd) {
                Toast.fail('两次密码不一致');
            } else {
                if (!error) {
                    var formData = this.props.form.getFieldsValue();  //表单数据
                    console.log('zzzz', formData)
                    const m = new My((data) => this.success(data), (data) => this.error(data));
                    m.change_password(formData.old_passwrd, formData.new_passwrd);

                    const errorCallback = () => {
                        Toast.fail('修改失败，请稍后重试！', 1);
                    }
                    //发送请求
                    // const m = new User(successCallback, errorCallback);
                    // m.login(formData.phone, formData.password);

                } else {
                    Toast.fail('您的输入不完整！');
                }
            }
        });
    }
    success() {
        Toast.fail('修改成功');
        this.props.loginOut();
        this.props.toMine();
    }
    error() {
        Toast.fail('修改失败');
    }
    render() {
        const { getFieldProps, getFieldError } = this.props.form;

        return (
            <div>
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.toMySelf()}
                >修改密码
            </NavBar>
                <form>
                    <InputItem
                        {...getFieldProps('old_passwrd', {
                            rules: [
                                { required: true, message: '旧密码尚未填写！' },
                                { validator: this.validateAccount },
                            ],
                        })}
                        clear
                        error={!!getFieldError('old_passwrd')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('old_passwrd').join('、'));
                        }}
                        type="password"
                        placeholder="请输入旧密码"
                    >
                    </InputItem>
                    <InputItem
                        {...getFieldProps('new_passwrd', {
                            rules: [
                                { required: true, message: '新密码尚未填写！' },
                                { validator: this.validateAccount },
                            ],
                        })}
                        clear
                        error={!!getFieldError('new_passwd')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('new_passwrd').join('、'));
                        }}
                        type="password"
                        placeholder="请输入新密码"
                    >
                    </InputItem>
                    <InputItem
                        {...getFieldProps('new_passwrd1', {
                            rules: [
                                { required: true, message: '确认密码未填写！' },
                                { validator: this.validateAccount },
                            ],
                        })}
                        clear
                        error={!!getFieldError('new_passwrd1')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('new_passwrd1').join('、'));
                        }}
                        type="password"
                        placeholder="确认新密码"
                    >
                    </InputItem>
                    <WhiteSpace size="xl" />
                    <WhiteSpace size="xl" />
                    <Button type="" onClick={this.onSubmit} className='login-btn'>完成</Button>
                </form>
            </div>
        )
    }
}
const Password = createForm()(BasicInput);
export default Password;
