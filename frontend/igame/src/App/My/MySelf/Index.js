import React from 'react';
import { WhiteSpace, Button, NavBar, List } from 'antd-mobile';
import { Icon } from 'antd';
import 'antd-mobile/dist/antd-mobile.css'; // 这一句是从哪里引入的？
import session from '../../User/session';
import My from '../../OdooRpc/My';
const Item = List.Item;

export default class MySelf extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            data: null
        })
    }
    loginOut = () => {
        this.props.loginOut();
        this.props.toMine();
        session.destroy();
    }
    componentDidMount() {
        //***********接口方法调用**************
        const m = new My((data) => this.setState({ data: data }), () => console.log('没有拿数据'));
        m.personal_info()
    }
    render() {
        let bank_card, email, head_portrait, idcard, nickname, phone, version;
        if (this.state.data) {
            bank_card = this.state.data.bank_card;
            email = this.state.data.email;
            head_portrait = this.state.data.head_portrait;
            idcard = this.state.data.idcard;
            nickname = this.state.data.nickname;
            phone = this.state.data.phone;
            version = this.state.data.version;
        }
        return (
            <div>
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={this.props.toMine}
                >个人信息
                </NavBar>
                <WhiteSpace size="xl" />
                <List>
                    <Item extra={<img alt='头像' src={require("../../User/963065731.jpg")} style={{ width: 60 }} />}
                        arrow="horizontal" onClick={() => { this.props.toImage() }}>头像</Item>
                    <Item extra={nickname} arrow="horizontal" onClick={() => { this.props.toUserName() }}>姓名</Item>
                    <Item extra={phone} arrow="horizontal" onClick={() => { this.props.ToPhone() }}>绑定手机</Item>
                    <Item extra={idcard} arrow="horizontal" onClick={() => { this.props.ToIdCard() }}>绑定身份证</Item>
                    <Item extra="" arrow="horizontal" onClick={() => { this.props.ToPassword() }}>修改密码</Item>
                    <Item extra={bank_card} arrow="horizontal" onClick={() => { this.props.ToBankCard() }}>我的银行卡</Item>
                    <Item extra={email} arrow="horizontal" onClick={() => { this.props.ToEmail() }}>邮箱</Item>
                    <Item extra={version} arrow="horizontal" onClick={() => { this.props.ToVersion() }}>关于智赛桥牌</Item>
                </List>
                <WhiteSpace size='xl' />
                <WhiteSpace size='xl' />
                <WhiteSpace size='xl' />

                <Button type="" size='small'
                    style={{ width: 150, backgroundColor: '#e8e8e8', margin: 'auto' }}
                    onClick={() => this.loginOut()}
                >退出登录</Button>

            </div>
        );
    }
}