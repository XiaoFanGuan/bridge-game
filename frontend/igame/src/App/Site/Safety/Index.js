import React from 'react';
import { List } from 'antd-mobile';
import './Index.css';
import Changepwd from './Changepwd';
import Resetpwd from './Resetpwd';
import { SiteLogin } from '../Common/Login';
import { session } from '../Models/Models';

const Item = List.Item;
// const Brief = Item.Brief;


export default class Safety extends React.Component {
    state = {
        // disabled: false,
        SafetyNav:true,
        change:false,
        reset:false,
        // sid:session.get_sid()
    }


    toggleMenu = ()=>{
        this.setState({
            SafetyNav:!this.state.SafetyNav,
            change:true
        })
        this.props.toggleHasLogin()
    }
    onCheckChange = ()=>{
        if (session.get_sid()){
            this.setState({
                SafetyNav:!this.state.SafetyNav,
                change:true,
            });
        }else{
            const login = new SiteLogin( this.toggleMenu );  
            login.login();
        }
        
    }
    onCheckReset = ()=>{
        this.setState({
            SafetyNav:!this.state.SafetyNav,
            reset:true,
        });
    }

    onChange = ()=>{
        this.setState({
            SafetyNav:!this.state.SafetyNav,
            change:false,
        });
    }
    
    onReset= ()=>{
        this.setState({
            SafetyNav:!this.state.SafetyNav,
            reset:false,
        });
    }
    render() {
        return (
            <div>
                {this.state.SafetyNav ? 
                    <List renderHeader={() => '请选择你要进行的操作'} className="my-list">
                        <Item arrow="horizontal" onClick={this.onCheckChange}>修改密码</Item>
                        <Item arrow="horizontal" onClick={this.onCheckReset}>重置密码（忘记密码）</Item>
                    </List>
                : 
                ''
                }
                {this.state.change ? <Changepwd onChange={this.onChange} />  : ''}
                {this.state.reset ? <Resetpwd onReset={this.onReset} />  : ''}
            </div>
        );
    }
}

