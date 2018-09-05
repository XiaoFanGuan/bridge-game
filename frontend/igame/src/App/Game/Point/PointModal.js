import React from 'react'
import {Modal} from 'antd-mobile'
import Board from '../../OdooRpc/Board'

export default class PointModal extends React.Component{
    state={
        point:{
            result:null,
            ns_points:null,
            ew_points:null
        }
    }
    onClose=()=>{
        this.props.onClose();
    }
    componentWillReceiveProps(newProps){
        console.log(newProps)
        if(newProps.board_id){
            const  board= new Board(this.sucPost,this.failPost); 
            board.board_points(newProps.board_id)
        }
    }
    sucPost=(data)=>{
        console.log(data) 
        this.setState({point:data }) 
    }
    render(){
        return(
            <Modal
            visible={this.props.modal}
            transparent
            maskClosable={false}
            title="本次比赛结果"
            footer={[{ text: 'Ok', onPress: () => { this.onClose() }} ]}
            >
                <div style={{width:200,fontSize:18}}>
                    <span>[ {this.state.point.result} ] </span>
                    <span> NS: {this.state.point.ns_points} </span>
                    <span> EW: {this.state.point.ew_points} </span>
                </div>
                </Modal>
            )
        }
    }