import React from 'react';
// import {  List, } from 'antd-mobile';
// const Item = List.Item;
// const Brief = Item.Brief

const Separator = ()=>(
    <div style={{
        backgroundColor: '#F5F5F9',
        height: 8,
        borderTop: '1px solid #ECECED',
        borderBottom: '1px solid #ECECED',  }}>
    </div>
);

export default class MatchData extends React.Component{
    state = {
        datas:null,
    }
    componentWillMount(){
        // const matchId = this.props.match.id;    //这里应该想后台发送赛事id(matchId),获取赛事相关数据
        
        //这里的data假定是从数据库取回来的比赛数据
        const data = (<h1>还没有数据......</h1>);
        
        this.setState({
            datas:data,
        })
    }
    render() {
        return(
            <div>
                <Separator />
                {this.state.datas}
                {/* <h1>还没有数据......</h1> */}
            </div>
        );
    }
}
    
    