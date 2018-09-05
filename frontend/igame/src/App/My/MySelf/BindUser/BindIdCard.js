import React from 'react';
import { NavBar, Icon, InputItem, Toast, Button, WhiteSpace } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css'; // 这一句是从哪里引入的？
import { createForm } from 'rc-form';
import My from '../../../OdooRpc/My';
class BasicInput extends React.Component {
    state = {
        data: null
    }
    validateAccount = (rule, value, callback) => {  //输入验证规则
        if (value.length > 25) {
            callback(new Error('Please enter 25 digits'));
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
                m.idcard_info(formData.name, formData.id_card)

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
                    onLeftClick={() => this.props.ToIdCard()}
                >身份证
            </NavBar>
                <form>
                    <InputItem
                        {...getFieldProps('name', {
                            rules: [
                                { required: true, message: '姓名尚未填写！' },
                                { validator: this.validateAccount },
                            ],
                        })}
                        clear
                        error={!!getFieldError('name')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('name').join('、'));
                        }}
                        type="string"
                        placeholder="姓名"
                    ></InputItem>
                    <InputItem
                        {...getFieldProps('id_card', {
                            rules: [
                                { required: true, message: '身份证尚未填写！' },
                                { validator: this.validateAccount },
                            ],
                        })}
                        clear
                        error={!!getFieldError('id_card')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('id_card').join('、'));
                        }}
                        type="number"
                        placeholder="身份证"
                    ></InputItem>
                    <WhiteSpace size="xl" />
                    <WhiteSpace size="xl" />
                    <Button type="" onClick={this.onSubmit} className='login-btn'>提交</Button>
                </form>
            </div>
        )
    }
}
const BindIdCard = createForm()(BasicInput);  //表单组件
export default BindIdCard;
