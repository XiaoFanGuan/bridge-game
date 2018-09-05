import React from 'react';
import { List } from 'antd-mobile';
import './Index.css';

const Item = List.Item;

export default class Resetpwd extends React.Component {


    render() {
        return (
            <div>
                <List renderHeader={() => 'plese enter your password !'} className="my-list">
                    <Item arrow="horizontal" onClick={this.props.onReset}>重置密码222222222</Item>
                </List>
            </div>
        );
    }
}

