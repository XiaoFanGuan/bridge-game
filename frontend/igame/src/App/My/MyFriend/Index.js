import React from 'react';
import { NavBar, List, WhiteSpace} from 'antd-mobile';
import { Icon } from 'antd';
import 'antd-mobile/dist/antd-mobile.css'; // 这一句是从哪里引入的？


export default class MyFriend extends React.Component {    //我的好友
    render() {
        const matchListData = [
            {id:1, grade:'大师级',  name:'刘德华'},
            {id:2, grade:'大师级',  name:'范冰冰'},
            {id:3, grade:'大师级',  name:'李冰冰'},
            {id:4, grade:'大师级',  name:'成龙'},
            {id:8, grade:'大师级',  name:'张学友'},
            {id:9, grade:'大师级',  name:'李小璐'}
        ];
        const MatchList = (<div>
            {matchListData.map((item, index) => {
                return (
                    <List.Item key={index}    //?这里应该用id还是索引做key
                    extra={item.grade}
                    arrow="horizontal" 
                    onClick={() => {}}
                    >{item.name}</List.Item>
                );
            })}
        </div>);
        return(
            <div>
                <NavBar
                mode="light"
                icon={<Icon type="left" />}
                onLeftClick={this.props.toMine}    //返回我的好友分类页（
                >我的好友
                </NavBar>
                <WhiteSpace size='xl' />
                {MatchList}
            </div>
        );
    }
}