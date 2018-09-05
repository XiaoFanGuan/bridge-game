import React from 'react';
import { NavBar, Icon, InputItem, Toast, Button, WhiteSpace } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css'; // 这一句是从哪里引入的？
import { createForm } from 'rc-form';
import My from '../../OdooRpc/My';
class BasicInput extends React.Component {
    state = {
        data: null
    }
    validateAccount = (rule, value, callback) => {  //输入验证规则
        const reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
        if (!reg.test(value)) {
            callback(new Error('格式错误'));
        } else {
            callback();
        }
    }
    onSubmit = () => {   //表单提交方法
        this.props.form.validateFields({ force: true }, (error) => {  //输入验证，符合规则才向后后端交数据
            if (!error) {
                var formData = this.props.form.getFieldsValue();  //表单数据
                console.log('zzzz', formData)
                const m = new My(() => this.success(), () => this.error());
                m.my_email1(formData.user_email)

                const errorCallback = () => {
                    Toast.fail('修改失败，请稍后重试！', 1);
                }
                //发送请求
                // const m = new User(successCallback, errorCallback);
                // m.login(formData.phone, formData.password);

            } else {
                Toast.fail('您的输入不完整！');
            }
        });
    }
    success() {
        Toast.fail('修改成功');
    }
    error() {
        Toast.error('修改失败');
    }
    render() {
        const { getFieldProps, getFieldError } = this.props.form;

        return (
            <div>
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.toMySelf()}
                >邮箱
            </NavBar>
                <form>
                    <InputItem
                        {...getFieldProps('user_email', {
                            rules: [
                                { required: true, message: '姓名尚未填写！' },
                                { validator: this.validateAccount },
                            ],
                        })}
                        clear
                        error={!!getFieldError('user_email')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('user_email').join('、'));
                        }}
                        type="string"
                        placeholder="请输入邮箱"
                    >邮箱</InputItem>

                    <WhiteSpace size="xl" />
                    <WhiteSpace size="xl" />
                    <Button type="" onClick={this.onSubmit} className='login-btn'>保存</Button>
                </form>
            </div>
        )
    }
}
const Email = createForm()(BasicInput);  //表单组件
export default Email;