import React from 'react';
import { NavBar, List, WhiteSpace } from 'antd-mobile';
import { Icon } from 'antd';
import 'antd-mobile/dist/antd-mobile.css'; // 这一句是从哪里引入的？
import MatchList from './MatchList';
// import { Game } from '../Models/Models';
import Game from '../OdooRpc/Game';
import MatchDetails from './MatchMessage/Index';
import MatchResult from './MatchResult/Index';
import SignEvent from '../App2/Sign/SignEvent';

const Item = List.Item;


export default class Match extends React.Component {
    state = {
        open:0,             // 0：默认页，分类列表， 1：所选分类的比赛列表， 2：所选比赛的详细信息，    3：比赛结果，   4：报名
        title:'',           //分类列表页的标题
        matchList:null,     //当前分类的比赛列表
        match:null,         //选中的单个比赛
        course:null,        //轮次信息(整理好的DOM))
        initialPage:0,      //赛事详细信息默认展示的页面
        thisOneRound:null,  //当前轮次的ID和轮次名
        rounds:null,        //所有轮次数据，在选择下一轮和上一轮的时候使用
    }
    setRoundMessage=(one,all)=>{
        this.setState({
            thisOneRound:one,
            rounds:all
        })
    }
    setInitialPage = (index)=>{     //设置赛事详细信息的显示页
        this.setState({initialPage:index})
    }
    setCourse = (index)=>{          //设置轮次信息数据
        this.setState({
            course:index,
        })
    }
    setMatch = (index)=>{           //设置当前选中的比赛数据
        this.setState({
            match:this.state.matchList[index],
        })
    }
    setMatchList = (val)=>{        //设置所选分类的赛事数据
        this.setState({
            matchList:val,
        })
    }
    setTitle = (title)=>{          //设置分类列表的导航标题
        this.setState({
            title:title,
        })
    }
    toSortList = ()=>{             //返回我的比赛分类页
        this.setState({
            open:0,
        })
    }
    toMatchList = ()=>{            //进入比赛列表页
        this.setState({
            open:1,
        })
    }
    toMatchDetails = (index)=>{     //进入比赛详细信息页
        this.setState({
            open:2,
            // match:this.state.matchList[index],
        })
    }
    toMatchResult = ()=>{           //进入比赛结果
        this.setState({
            open:3,
        })
    }
    toSignMatch = ()=>{             //进入比赛报名
        this.setState({
            open:4,
        })
    }
    
    render() {
        let page = null;
        switch (this.state.open) {
            case 0:     //默认页，分类列表
                page = <SortList 
                    name = {this.props.name}                    //用以验证入口，有这个字段说明是从《我》这个入口进来的
                    toMine={this.props.toMine}                  //返回个人中心
                    setTitle={this.setTitle}                    //设置导航标题
                    setMatchList={this.setMatchList}            //设置比赛列表数据
                    toMatchList={this.toMatchList} />          //进入比赛列表页
                break;
            case 1:      //所选分类的比赛列表
                page = <MatchList 
                    setHiddenState={this.props.setHiddenState}
                    setOthers={this.props.setOthers}
                    name = {this.props.name}
                    title={this.state.title} 
                    toMatchDetails={this.toMatchDetails}
                    setMatch={this.setMatch} 
                    matchList={this.state.matchList} 
                    toSortList={this.toSortList} />  
                break;
            case 2:     //所选比赛的详细
                page = <MatchDetails
                    name = {this.props.name}
                    toSignMatch={this.toSignMatch}
                    setRoundMessage={this.setRoundMessage}
                    setInitialPage={this.setInitialPage}
                    setCourse={this.setCourse}
                    toMatchList={this.toMatchList} 
                    toMatchResult={this.toMatchResult}
                    match={this.state.match}
                    initialPage={this.state.initialPage}
                    course={this.state.course} />   
                break;
            case 3:     //所选比赛的详细
                page = <MatchResult
                match={this.state.match}
                thisOneRound={this.state.thisOneRound}
                rounds={this.state.rounds}
                toMatchDetails={this.toMatchDetails} />
                break;
            case 4:     //赛事报名页
                page = <SignEvent match={this.state.match}
                toMatchDetails={this.toMatchDetails} />
                break;
            default:
                // page = <Match toMine={this.props.toMine} />;
                break;
        }
        return(
            <div>
                {page}
            </div>
        );
    }
}

class SortList extends React.Component {       //我的比赛分类列表页组件
    state = {
        data:null,
        matchList1:null,             //即将开始的比赛列表
        matchList2:null,             //正在进行的比赛列表
        matchList3:null,             //已经完成的比赛列表
        title:'',
    }
    
    componentWillMount(){
        //获取所有比赛列表
        const m = new Game(this.stateList,this.callFail);
        //如果不是从《我》入口进来，调用后面的查询函数
        // this.props.name ? m.search2() : m.search2();

        //      这里是正确的调用接口
        this.props.name ? m.search_own_match() : m.search_user_match();

        // this.props.name ? m.search_user_match() : m.search_user_match();
        
    }
    stateList = (datas)=>{
        //这里先用模拟数据list，后面应该 换成真实的数据data
        // const list = [{arbitrator:false,datetime:"2018-01-30 07:07:20",host_unit:false,id:1,name:"G1",referee:false,sponsor:false,type:"team",state:'draft'},
        //             {arbitrator:false,datetime:"2018-02-30 20:27:24",host_unit:false,id:2,name:"G2",referee:false,sponsor:false,type:"team",state:'conformed'},
        //             {arbitrator:false,datetime:"2018-06-30 08:14:14",host_unit:false,id:3,name:"G3",referee:false,sponsor:false,type:"team",state:'locked'},
        //             {arbitrator:false,datetime:"2018-05-30 01:27:25",host_unit:false,id:4,name:"G4",referee:false,sponsor:false,type:"team",state:'ready'},
        //             {arbitrator:false,datetime:"2018-05-30 07:27:34",host_unit:false,id:5,name:"G5",referee:false,sponsor:false,type:"team",state:'done'},
        //             {arbitrator:false,datetime:"2018-06-30 07:27:54",host_unit:false,id:6,name:"G6",referee:false,sponsor:false,type:"team",state:'cancel'},
        //             {arbitrator:false,datetime:"2018-06-30 13:28:24",host_unit:false,id:7,name:"G7",referee:false,sponsor:false,type:"team",state:'draft'},
        //             {arbitrator:false,datetime:"2018-08-30 10:27:37",host_unit:false,id:8,name:"G8",referee:false,sponsor:false,type:"team",state:'conformed'},
        //             {arbitrator:false,datetime:"2018-08-30 05:25:24",host_unit:false,id:9,name:"G9",referee:false,sponsor:false,type:"team",state:'locked'},
        //             {arbitrator:false,datetime:"2018-08-30 07:27:26",host_unit:false,id:10,name:"G10",referee:false,sponsor:false,type:"team",state:'ready'},
        //             {arbitrator:false,datetime:"2018-06-30 07:27:14",host_unit:false,id:11,name:"G11",referee:false,sponsor:false,type:"team",state:'done'},
        //             {arbitrator:false,datetime:"2018-06-30 08:26:24",host_unit:false,id:12,name:"G12",referee:false,sponsor:false,type:"team",state:'cancel'},
        //             {arbitrator:false,datetime:"2018-06-30 07:23:33",host_unit:false,id:13,name:"G13",referee:false,sponsor:false,type:"team",state:'draft'},
        //             {arbitrator:false,datetime:"2018-06-30 09:27:45",host_unit:false,id:14,name:"G14",referee:false,sponsor:false,type:"team",state:'conformed'},
        //             {arbitrator:false,datetime:"2018-06-30 06:25:44",host_unit:false,id:15,name:"G15",referee:false,sponsor:false,type:"team",state:'draft'},
        //             {arbitrator:false,datetime:"2018-06-30 16:27:29",host_unit:false,id:16,name:"G16",referee:false,sponsor:false,type:"team",state:'done'},]
        let list1 = [];         //即将进行的比赛列表     
        let list2 = [];         //正在进行的比赛列表
        let list3 = [];         //已经完成的比赛列表

        datas.forEach((item)=>{
        // list.forEach((item)=>{
            if( item.state==='draft' || item.state==='conformed' ){
                list1.push(item)
            }

            if( item.state==='locked' || item.state==='ready' ){
                list2.push(item)
            }

            if( item.state==='done' || item.state==='cancel' ){
                list3.push(item)
            }
        });
        this.setState({
            data:datas,
            // data:list,
            matchList1:list1,
            matchList2:list2,
            matchList3:list3,
        })
        !this.props.name?this.toMatchList('比赛列表',this.state.data):this.setState({title:'我的比赛'})
    }
    callFail = ()=>{
        console.log('没有比赛信息......')
    }
    toMatchList = (title,data)=>{
        this.props.toMatchList();
        this.props.setTitle(title);
        this.props.setMatchList(data);
    }
    render() {
        // const name = this.props.name;
        return(
            <div>
                <NavBar
                mode="light"
                icon={ <Icon type="left" /> }
                onLeftClick={()=>this.props.toMine() }      //如果有name，认为是从《我》这个入口进来，从而加载不同的数据，设置不同的title
                >{this.state.title}
                </NavBar>
                <WhiteSpace size='xl' />
                <Item extra="" arrow="horizontal" onClick={() => {this.toMatchList('即将开始的比赛',this.state.matchList1)} }>即将开始的比赛</Item>
                <Item extra="" arrow="horizontal" onClick={() => {this.toMatchList('正在进行的比赛',this.state.matchList2)} }>正在进行的比赛</Item>
                <Item extra="" arrow="horizontal" onClick={() => {this.toMatchList('已经完成的比赛',this.state.matchList3)} }>已经完成的比赛</Item>
            </div>
        );
    }
}