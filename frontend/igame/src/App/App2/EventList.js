// import React from 'react';
// import {List, SearchBar, WingBlank,Toast} from 'antd-mobile'

// import EventNavBar from './Common/EventNavBar'
// // import  { Game } from './../Models/Models'
// import Game from '../OdooRpc/Game';

// export default class Event extends React.Component{ 
//     state={
//         originList:this.props.originList||null,
//         list:null
//     }
 
//     // 请求比赛列表 
//     componentDidMount(){
//         // 每次打开或回到列表页都重新请求
//         // const m = Game.create();
//         // m.query('exec', 'og.igame','search2',{},this.stateList,this.callFail,[]);
//         const m = new Game(this.stateList,this.callFail);
//         m.search2();

//     }
//     stateList=(res)=>{
//         this.setState({
//             originList:res,
//             list:res
//         });
//         console.log(this.state.list)
//         this.props.stateList(res);
//     }
//     callFail=()=>{
//         Toast.fail('查询赛事失败，请稍后重试！！',1)
//     }

//     // 按关键字搜索比赛 ★
//     handlerSearch(value){
//         let afterList=this.state.originList;
//         if(!afterList){
//             this.setState({
//                 list: this.state.originList
//             })
//         }else{
//             if(value){
//                 afterList = afterList.filter(item => {
//                     return item.name.indexOf(value)!==-1 
//                 });
//                 this.setState({
//                     list: afterList
//                 })
//             }else{
//                 this.setState({
//                     list: this.state.originList
//                 })
//             }
//         }
//     }

//     // 点击查看详情 ★
//     handlerClick=(key)=>{
//         this.props.handlerDetail(key);
//     }

//    render(){
//         let items = [];
        
// 		if(!this.state.list || this.state.list.length === 0 ) {
//             items.push(<p key={0} style={{textAlign:'center',fontSize:14,padding:15, marginTop:1}} >暂无比赛</p>);
//         }
//         else {
//             this.state.list.forEach(item => {
//                 items.push(
//                     <List.Item 
//                         key={item.id} 
//                         style={{margin:'5px 0'}}
//                         arrow="horizontal" 
//                         onClick={id => this.handlerClick(item.id)}
//                         >
//                         <span style={{marginRight:5}}>{item.name}</span>
//                     </List.Item>
//                 );
//             });
// 		}
        
//         return (
//             <WingBlank>  
//                <EventNavBar  left="" eventName="比赛列表" clickArrow={()=>{return false}}/>
//                 <SearchBar
//                 placeholder="Search"
//                 onSubmit={value => this.handlerSearch(value)}
//                 onChange={value => this.handlerSearch(value)}
//                 />
//                 <List>{items}</List>
//             </WingBlank>
//         );
//     }
// }