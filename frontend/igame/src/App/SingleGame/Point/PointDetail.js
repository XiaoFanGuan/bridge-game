import React from 'react'
import {Table} from 'antd';
import {WingBlank,WhiteSpace,NavBar,Icon,} from 'antd-mobile'
import './table.css'
import CardSuit from './CardSuit'
import Func from '../Models/Func'
const DealFunc = new Func();
const call=[{
    title: '北',
    dataIndex: 'N',
    key: 'N',
  },{
    title: '东',
    dataIndex: 'E',
    key: 'E',
  },{
    title: '南',
    dataIndex: 'S',
    key: 'S',
  },{
    title: '西',
    dataIndex: 'W',
    key: 'W',
  },]
  const play=[,{
    title: '墩',
    dataIndex: 'pier',
    key: 'pier',
  },{
    title: '东',
    dataIndex: 'east',
    key: 'east',
  },{
    title: '南',
    dataIndex: 'south',
    key: 'south',
  },{
    title: '西',
    dataIndex: 'west',
    key: 'west',
  },{
    title: '北',
    dataIndex: 'north',
    key: 'north',
  },{
    title: '东',
    dataIndex: 'east_next',
    key: 'east_next',
  },{
    title: '南',
    dataIndex: 'south_next',
    key: 'south_next',
  },{
    title: '西',
    dataIndex: 'west_next',
    key: 'west_next',
  }]
export default class PointDetail extends React.Component{
	state={
		callData:[{
			key:0,
			N:'',
			E:'',
			S:'',
			W:'',
		}],
		playData:[]
	}
	componentDidMount(){
    let i=0;
    console.log(this.props.Detail)
    let calls =null;
		if(this.props.Detail.calls.length){
			this.props.Detail.calls.map(item=>{  //[1, "E", "1S"],[2, "S", "Pass"], [3, "W", "Pass"]，[4, "N", "Pass"]
				calls = DealFunc.call_cards(item[1],item[2],this.state.callData);
      })
    }
    if(this.props.Detail.plays){
			let plays = this.state.playData
			this.props.Detail.plays.map((item,index)=>{
				if(item[0]!==0&&item[0]%4===0){
					plays.push( DealFunc.playOrder(this.props.Detail.plays,i))
					i++
				}
			})
			this.setState({ callData:calls, playData:plays })
		}
	}
	onLeftClick=()=>{
		this.props.toPointResult()
	}
    render(){
        return(
            <WingBlank size='md' >
                <NavBar
                mode="light"
                icon={<Icon type="left" />}
                onLeftClick={this.onLeftClick}
                >第{this.props.result_key+1}副牌详情</NavBar>
                <WhiteSpace/>
                <p>牌型分布</p>
                <CardSuit cards={this.props.Detail.cards} vulnerable={this.props.Detail.vulnerable} table_information={this.props.Detail.table_information}/>
                <Table 
                dataSource={this.state.callData} 
                columns={call}
                size="middle"
                title={() => '叫牌过程'}
                pagination={false}
                />
                <Table 
                dataSource={this.state.playData} 
                columns={play}
                size="middle"
                title={() => '出牌顺序'}
                pagination={false}
                />
            </WingBlank>
        )
    }
}
