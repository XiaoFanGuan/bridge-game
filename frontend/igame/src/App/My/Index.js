import React from 'react';
import 'antd-mobile/dist/antd-mobile.css'; // 这一句是从哪里引入的？
import Mine from './Mine';
import MySelf from './MySelf/Index';
import MyMatch from './MyMatch/Index';
import MyFriend from './MyFriend/Index';
import MyTeam from './MyTeam/Index';
import SignIn from './SignIn/Index';
import ToImage from './MySelf/ToImage';
import UserName from './MySelf/UserName';
import IdCard from './MySelf/IdCard';
import Phone from './MySelf/Phone';
import Password from './MySelf/Password';
import BankCard from './MySelf/BankCard';
import Email from './MySelf/Email';
import ToVersion from './MySelf/ToVersion';
import BindIdCard from './MySelf/BindUser/BindIdCard';
import AddBankCard from './MySelf/BindUser/AddBankCard';
import BindBankCard from './MySelf/BindUser/BindBankCard';
import AddBindBankCard from './MySelf/BindUser/AddBindBankCard';
export default class My extends React.Component {
    state = {
        page: 'mine',
    }
    toMyTeam = () => {
        this.props.setHiddenState(true);
        this.setState({ page: 'myteam' })
    }
    toMyFriend = () => {
        this.props.setHiddenState(true);
        this.setState({ page: 'myfriend' })
    }
    toMySelf = () => {
        this.props.setHiddenState(true);
        this.setState({ page: 'myself' })
    }
    toImage = () => {
        this.props.setHiddenState(true);
        this.setState({ page: 'toImage' })
    }
    toMyMatch = () => {
        this.props.setHiddenState(true);
        this.setState({ page: 'mymatch' })
    }
    toSignin = () => {
        this.props.setHiddenState(true);
        this.setState({ page: 'signin' })
    }
    toMine = () => {
        this.props.setHiddenState(false);
        this.setState({ page: 'mine' })
    }
    toUserName = () => {
        // this.props.setHiddenState(false);
        this.setState({ page: 'username' })
    }
    ToPhone = () => {
        // this.props.setHiddenState(false);
        this.setState({ page: 'phone' })
    }
    ToIdCard = () => {
        // this.props.setHiddenState(false);
        this.setState({ page: 'idcard' })
    }
    ToPassword = () => {
        // this.props.setHiddenState(false);
        this.setState({ page: 'password' })
    }
    ToBankCard = () => {
        console.log('ToBankCard')
        // this.props.setHiddenState(false);
        this.setState({ page: 'ToBankCard' })
    }
    ToEmail = () => {
        this.setState({ page: 'ToEmail' })
    }
    ToVersion = () => {
        this.setState({ page: 'ToVersion' })
    }
    ToBindIdCard = () => {
        this.setState({ page: 'BindIdCard' })
    }
    ToAddBankCard = () => {
        console.log('AddBankCard')
        this.setState({ page: 'AddBankCard' })
    }
    ToBindBankCard = () => {
        console.log('ToBindBankCard')
        this.setState({ page: 'ToBindBankCard' })
    }
    ToAddBindBankCard = () => {
        console.log('ToAddBindBankCard')
        this.setState({ page: 'AddBindBankCard' })
    }
    render() {
        let now = null;
        switch (this.state.page) {
            case 'mine':
                now = <Mine toMySelf={this.toMySelf}
                    toMyFriend={this.toMyFriend}
                    toMyTeam={this.toMyTeam}
                    toSignin={this.toSignin}
                    toMyMatch={this.toMyMatch} />
                break;
            case 'myself':
                now = <MySelf
                    toMine={this.toMine}
                    loginOut={this.props.loginOut}
                    toImage={this.toImage}
                    toUserName={this.toUserName}
                    ToPhone={this.ToPhone}
                    ToIdCard={this.ToIdCard}
                    ToPassword={this.ToPassword}
                    ToBankCard={this.ToBankCard}
                    ToEmail={this.ToEmail}
                    ToVersion={this.ToVersion}
                />
                break;
            case 'toImage':
                now = <ToImage
                    toMySelf={this.toMySelf}
                />
                break;
            case 'mymatch':
                now = <MyMatch toMine={this.toMine} />
                break;
            case 'myfriend':
                now = <MyFriend toMine={this.toMine} />
                break;
            case 'myteam':
                now = <MyTeam toMine={this.toMine} />
                break;
            case 'signin':
                now = <SignIn toMine={this.toMine} />
                break;
            case 'username':
                now = <UserName toMySelf={this.toMySelf} />
                break;
            case 'phone':
                now = <Phone
                    toMySelf={this.toMySelf}
                    toMine={this.toMine}
                    loginOut={this.props.loginOut}
                />
                break;
            case 'idcard':
                now = <IdCard
                    toMySelf={this.toMySelf}
                    ToBindIdCard={this.ToBindIdCard}
                />
                break;
            case 'password':
                now = <Password
                    toMySelf={this.toMySelf}
                    toMine={this.toMine}
                    loginOut={this.props.loginOut}
                />
                break;
            case 'ToBankCard':
                now = <BankCard toMySelf={this.toMySelf}
                    ToAddBankCard={this.ToAddBankCard}
                />
                break;
            case 'ToEmail':
                now = <Email toMySelf={this.toMySelf} />
                break;
            case 'ToVersion':
                now = <ToVersion toMySelf={this.toMySelf} />
                break;
            case 'BindIdCard':
                now = <BindIdCard
                    ToIdCard={this.ToIdCard}

                />
                break;
            //填加 //短信验证页面 2
            case 'AddBankCard':
                now = <AddBankCard
                    ToBankCard={this.ToBankCard}
                    // ToBindBankCard={this.ToBindBankCard}
                    ToAddBindBankCard={this.ToAddBindBankCard}
                />
                break;
            // 填写手机验证页面 1
            case 'BindBankCard':
                now = <BindBankCard
                    ToBankCard={this.ToBankCard}
                    ToAddBankCard={this.ToAddBankCard}
                />
                break;
            //真·添加页面 3
            case 'AddBindBankCard':
                now = <AddBindBankCard
                    ToAddBankCard={this.ToAddBankCard}
                />
                break;
            default:
                break;
        }
        return (
            <div>
                {now}
            </div>
        );
    }
}

