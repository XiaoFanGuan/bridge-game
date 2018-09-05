import React from 'react';
import {  List, } from 'antd-mobile';
const Item = List.Item;
const Brief = Item.Brief;

const Separator = ()=>(
    <div style={{
        backgroundColor: '#F5F5F9',
        height: 8,
        borderTop: '1px solid #ECECED',
        borderBottom: '1px solid #ECECED',  }}>
    </div>
);

export default class News extends React.Component{
    state = {
        news:null,
    }
    componentWillMount(){
        // const matchId = this.props.match.id;    //这里应该想后台发送赛事id(matchId),获取赛事相关新闻
        
        //这里的data假定是从数据库取回来的新闻
        const data = [
            {id:1,  title:'中国桥牌协会大师分英雄榜',               img:'/Images/bridge.jpg',       time:'2018-5-14~2018-5-20'},
            {id:2,  title:'仁者乐山，智者乐桥：无问输赢，但问过程',   img:'/Images/963065731.jpg',     time:'2018-5-14~2018-5-20'},
            {id:3,  title:'让桥牌哲理锻造强国一代',                 img:'/Images/1754250879.jpg',   time:'2018-5-14~2018-5-20'},
            {id:4,  title:'中国桥牌协会大师分英雄榜',               img:'/Images/887582064.jpg',    time:'2018-5-14~2018-5-20'},
            {id:5,  title:'中国桥牌协会大师分英雄榜',               img:'/Images/bridge.jpg',       time:'2018-5-14~2018-5-20'}
        ]
        const Items = (<div>
            {data.map((item, index) => {
                return (
                    <Item    style={{fontSize:14}}
                    thumb={item.img} multipleLine
                    onClick={() => console.log('这是一条新闻') }
                    key={index} 
                    >
                    {item.title}<Brief>{item.time}</Brief>
                    </Item>
                );
            })}
            </div>);
        this.setState({
            news:Items,
        })
    }
    render() {
        return(
            <div>
                <Separator />
                <List>
                    {this.state.news}
                </List>
            </div>
        );
    }
}
    
    