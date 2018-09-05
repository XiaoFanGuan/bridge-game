import React from 'react';
import { NavBar, Icon, InputItem, Toast, Button, WhiteSpace } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css'; // 这一句是从哪里引入的？
import { createForm } from 'rc-form';
import My from '../../OdooRpc/My';
class BasicInput extends React.Component {
    validateAccount = (rule, value, callback) => {  //输入验证规则
        if (value && value.replace(/\s+/g).length > 6) {
            callback(new Error('不能超过6个字符'));
        } else {
            callback();
        }
    }

    onSubmit = () => {   //表单提交方法
        this.props.form.validateFields({ force: true }, (error) => {  //输入验证，符合规则才向后后端交数据
            if (!error) {
                var formData = this.props.form.getFieldsValue();  //表单数据
                const m = new My((data) => this.success(data), () => console.log('没有发送'));
                m.nick_name(formData.user_name);
                console.log(formData.user_name, 'zzzzzzzzzz');
                // const successCallback = (data) => {
                //     console.log(data);
                // }
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
    success = (data) => {
        if (data) {
            Toast.fail('修改成功')
        } else {
            Toast.fail('网络错误')
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
                >姓名
            </NavBar>
                <form>
                    <InputItem
                        {...getFieldProps('user_name', {
                            rules: [
                                { required: true, message: '姓名尚未填写！' },
                                { validator: this.validateAccount },
                            ],
                        })}
                        clear
                        error={!!getFieldError('user_name')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('user_name').join('、'));
                        }}
                        type="user_name"
                        placeholder="请输入姓名"
                    >姓名</InputItem>

                    <WhiteSpace size="xl" />
                    <WhiteSpace size="xl" />
                    <Button type="" onClick={this.onSubmit} className='login-btn'>保存</Button>
                </form>
            </div>
        )
    }
}
const UserName = createForm()(BasicInput);  //表单组件
export default UserName;