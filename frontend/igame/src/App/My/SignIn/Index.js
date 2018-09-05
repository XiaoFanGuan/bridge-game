import React, { Component } from 'react';
import { NavBar } from 'antd-mobile';
import { Icon } from 'antd';
import Calendar from './Calendar';
class SignIn extends Component {
    render() {
        return (
            <div>
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onClick={() => this.props.toMine()}
                >每日签到
                <span style={{ float: "right" }}>规则</span>
                </NavBar>
                <img style={{ width: "100%", height: 170 }} src='/Images/887582064.jpg' />
                <div>
                    <Calendar />
                </div>
                <div style={{ position: 'absolute', bottom: 15, margin: '0 15px', width: '100%' }}>
                    <Icon
                        style={{ fontSize: 40, marginRight: 30 }}
                        type="codepen-circle" />
                    <Icon
                        style={{ fontSize: 50, marginRight: 30 }}
                        type="codepen-circle" />
                    <Icon
                        style={{ fontSize: 60, marginRight: 30 }}
                        type="codepen-circle" />
                    <Icon
                        style={{ fontSize: 70 }}
                        type="codepen-circle" />
                </div>
            </div>
        )
    }
}

export default SignIn;



