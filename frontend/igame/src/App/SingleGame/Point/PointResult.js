import React from 'react'
import {Table} from 'antd';
import {WingBlank,NavBar,Icon,WhiteSpace} from 'antd-mobile'
import './table.css'
import Models from '../Models/model'
import './pointResult.css'
const columns = [{
    title: '副数',
    dataIndex: 'number',
    key: 'number',
	render: text => <a href="javascript:;">{text}</a>,
  }, {
    title: '发牌',
    dataIndex: 'dealer',
    key: 'dealer',
  }, {
    title: '局况',
    dataIndex: 'vulnerable',
    key: 'vulnerable',
  },{
    title: '定约',
    dataIndex: 'contract',
    key: 'contract',
  },{
    title: '定约者',
    dataIndex: 'declarer',
    key: 'declarer',
  },{
    title: '首攻',
    dataIndex: 'openlead',
    key: 'openlead',
  },{
    title: '结果',
    dataIndex: 'result',
    key: 'result',
  },{
    title: 'EW',
    dataIndex: 'ew_point',
    key: 'ew_point',
  },{
	  title: 'NS',
	  dataIndex: 'ns_point',
	  key: 'ns_point',
	}];
let dataSource=[];
export default class PointResult extends React.Component{
	state={
		result:null
	}
	componentDidMount(){
		console.log(this.props.table_id)
			dataSource=[];
			Models.table_points(this.sucResult,this.failResult,this.props.table_id);
	}
	sucResult=(data)=>{
		this.setState({
			result:data
			// result:data.reverse()
		})
		data.map((item,index)=>{
		// data.reverse().map((item,index)=>{
			// 顺序：从 1 到 8
			dataSource.push({
				key: index,
				number:index+1,
				dealer:item.dealer,
				vulnerable:item.vulnerable,
				contract:item.result?item.result.split(' ')[1]:'-',
				declarer:item.result?item.result.split(' ')[0]:'-',
				openlead:item.openlead?item.openlead:'-',
				result:item.result?item.result.split(' ')[2]:'-',
				ew_point:item.ew_point?item.ew_point:'-',
				ns_point:item.ns_point?item.ns_point:'-',
			})
		})
		this.forceUpdate()
	}
	failResult(){}

	searchResultDetail=(record)=>{
		let oneResult = null;
		this.state.result.filter((item,index)=>{
			if(index===record.key){
				oneResult = item;
				return oneResult;
			}
		});
		this.props.searchOneResult(oneResult,record.key);
	}

    render(){
        return(
          	<WingBlank>
             	<NavBar
                mode="light"
                // icon={<Icon type="left" />}
                // onLeftClick={() => console.log('onLeftClick')}
				>本局累计得分</NavBar>
				<WhiteSpace/>
				<Table 
				className='pan_pointResultTable'
                dataSource={dataSource} 
                columns={columns}
				size="middle"
				onRow={(record) => {
					console.log()
					return {
					  onClick: () => {this.searchResultDetail(record)},       // 点击行
					};
				  }}
				pagination={false}
                />
			</WingBlank>
        )
    }
}
