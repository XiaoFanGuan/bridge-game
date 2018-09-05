import React from 'react';
import 'antd-mobile/dist/antd-mobile.css'; // 这一句是从哪里引入的？
import Match from '../../Common/Index';

export default class MyMatch extends React.Component {
    render() {
        return(
            <Match 
            name='zj' 
            toMine={this.props.toMine} />      //传入name的目的是为了区分入口，加载不同的数据
        );
    }
}

