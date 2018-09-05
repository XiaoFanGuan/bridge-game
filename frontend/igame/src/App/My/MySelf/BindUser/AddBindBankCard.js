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
        if (value && value.length > 23) {
            callback(new Error('Please enter 11 digits'));
        } else {
            callback();
        }
    }
    onSubmit = () => {   //表单提交方法
        this.props.form.validateFields({ force: true }, (error) => {  //输入验证，符合规则才向后后端交数据
            var formData = this.props.form.getFieldsValue();  //表单数据
            console.log(formData)
            if (formData.bank_card === formData.bank_card1) {
                if (!error) {
                    const m = new My(() => this.success(), () => this.error());
                    m.bank_card_info(formData.bank_card)
                    const errorCallback = () => {
                        Toast.fail('修改失败，请稍后重试！', 1);
                    }
                    //发送请求
                    // const m = new User(successCallback, errorCallback);
                    // m.login(formData.phone, formData.password);

                } else {
                    Toast.fail('您的输入不完整！');
                }
            } else {
                Toast.fail('俩次输入不i一致！');
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
                    onLeftClick={() => this.props.ToAddBankCard()}
                >银行卡
            </NavBar>
                <form>
                    <InputItem
                        {...getFieldProps('bank_card', {
                            rules: [
                                { required: true, message: '银行卡尚未填写！' },
                                { validator: this.validateAccount },
                            ],
                        })}
                        clear
                        error={!!getFieldError('bank_card')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('bank_card').join('、'));
                        }}
                        type="number"
                        placeholder="请输入银行卡"
                    ></InputItem>
                    <InputItem
                        {...getFieldProps('bank_card1', {
                            rules: [
                                { required: true, message: '银行卡尚未填写！' },
                                { validator: this.validateAccount },
                            ],
                        })}
                        clear
                        error={!!getFieldError('bank_card1')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('bank_card1').join('、'));
                        }}
                        type="number"
                        placeholder="确认银行卡"
                    ></InputItem>

                    <WhiteSpace size="xl" />
                    <WhiteSpace size="xl" />
                    <Button type="" onClick={this.onSubmit} className='login-btn'>保存</Button>
                </form>
            </div>
        )
    }
}
const AddBindBankCard = createForm()(BasicInput);  //表单组件
export default AddBindBankCard;