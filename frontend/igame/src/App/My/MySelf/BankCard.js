import React from 'react';
import { NavBar, Icon, Button, WhiteSpace, List } from 'antd-mobile';
import My from '../../OdooRpc/My';
const Item = List.Item;

class BankCard extends React.Component {
    state = {
        data: ''
    }
    addBankCard = () => {
        this.props.ToAddBankCard();
    }
    componentDidMount() {
        //***********接口方法调用**************
        const m = new My((data) => this.setState({ data: data }), () => console.log('没有拿数据'));
        m.personal_info()
    }
    render() {
        return (
            <div>
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.toMySelf()}
                >银行卡
               </NavBar>
                <List className="my-list">
                    <Item multipleLine align="top" wrap>
                        {this.state.data.bank_card}
                    </Item>

                </List>
                <WhiteSpace size="xl" />
                <WhiteSpace size="xl" />
                <Button className='login-btn' onClick={this.addBankCard}>添加银行卡</Button>
            </div >
        )
    }
}
export default BankCard;