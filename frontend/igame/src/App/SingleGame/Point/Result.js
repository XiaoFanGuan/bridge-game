import React from 'react'
import PointResult from './PointResult'
import PointDetail from './PointDetail'

export default class Result extends React.Component{
    state={
        scene:0,   //0, 8副牌成绩; 1, 每一副牌成绩详情
        result:null,
        oneResult:null,
        table_id:this.props.table_id,
        result_key:null,
    } 
    componentDidMount(){
        this.props.setHiddenState(false)
        console.log(this.state.table_id)
        console.log(this.props.table_id)
    }
    searchOneResult=(data,key)=>{
        this.setState({
            oneResult:data,
            scene:1,
            result_key:key
        });
    }
    toPointResult=()=>{
        this.setState({
            scene:0
        })
    }
    render(){
        return(
            <div>
                {this.state.scene===0?<PointResult searchOneResult={this.searchOneResult} table_id={this.props.table_id}></PointResult>:null}
                {this.state.scene===1?<PointDetail Detail={this.state.oneResult} result_key={this.state.result_key} toPointResult={this.toPointResult}></PointDetail>:null}
            </div>
        )
    }
}