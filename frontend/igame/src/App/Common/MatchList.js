import React from 'react';
import { NavBar, List, WhiteSpace, SearchBar } from 'antd-mobile';
import { Icon } from 'antd';
import 'antd-mobile/dist/antd-mobile.css'; // 这一句是从哪里引入的？


export default class MatchList extends React.Component {    //已完成的比赛
    state={
        originList:this.props.matchList,
        list:this.props.matchList,
    }
    componentWillMount(){
        if(!this.props.name){
            this.props.setHiddenState(true)
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.matchList){
            this.setState({
                originList:nextProps.matchList,
                list:nextProps.matchList
            })
        }
    }
    // 按关键字搜索比赛 ★
    handlerSearch(value){
        let afterList=this.state.originList;
        if(!afterList){
            this.setState({
                list: this.state.originList
            })
        }else{
            if(value){
                afterList = afterList.filter(item => {
                    return item.name.indexOf(value)!==-1 
                });
                this.setState({
                    list: afterList
                })
            }else{
                this.setState({
                    list: this.state.originList
                })
            }
        }
    }

    toMatchDetails = (index)=>{
        this.props.toMatchDetails();
        this.props.setMatch(index);
    }
    render() {
        let matchList = null;
        if (!this.state.list || this.state.list.length === 0 ){
            matchList = (<div>
                    <p key={0} style={{textAlign:'center',fontSize:14,padding:15, marginTop:1}} >暂无比赛</p>
            </div>);
        }else{
            matchList = (<div>
                {this.state.list.map((item, index) => {
                    return (
                        <List.Item key={index}    //?这里应该用id还是索引做key
                        extra={item.datetime}
                        arrow="horizontal" 
                        onClick={() => this.toMatchDetails(index)}
                        >{item.name}</List.Item>
                    );
                })}
            </div>);
        }

        return(
            <div>
                <NavBar
                mode="light"
                icon={  <Icon type="left" /> }
                onLeftClick={ this.props.name ? 
                    this.props.toSortList : 
                    ()=>{this.props.setOthers(null);
                        this.props.setHiddenState(false)} 
                    }                                       // 返回我的比赛分类页/返回上层(主页)
                >{this.props.title}
                </NavBar>
                <WhiteSpace size='xl' />
                {/* {matchList} */}
                <SearchBar
                placeholder="Search"
                onSubmit={value => this.handlerSearch(value)}
                onChange={value => this.handlerSearch(value)}
                />
                {matchList}
            </div>
        );
    }
}