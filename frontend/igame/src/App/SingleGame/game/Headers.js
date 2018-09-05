import React, { Component } from 'react';
import './Headers.css'
/**
 * 结果直接写在　生命周期函数里 异步获取即可。
 */
class Imps extends Component {
    render(){
        return(
            <div className='imps'>
                <div className='iheader'>IMPs</div>
                <div className='ibody'>NS : 0<br />EW : 0</div>
            </div>
        )
    }
}

class Seats extends Component{
    
    render(){
        return(
            <div className='seats'>
                <div className='s1' style={{textAlign:'center',lineHeight:'100%'}}>{this.props.dealer==='north'?'D':null}</div>
                <div className='s2'>{this.props.dealer==='west'?'D':null}</div>
                <div className='s'><span style={{display:'block',marginTop:'23%'}}>{this.props.board_id?this.props.board_id:null}</span></div>
                <div className='s3'>{this.props.dealer==='east'?'D':null}</div>
                <div className='s4' style={{textAlign:'center',lineHeight:'100%'}}>{this.props.dealer==='south'?'D':null}</div>
            </div>
        )
    }
}

class Tricks extends Component{
    render(){
        return(
            <div className='tricks'>
                <div className='s1'>{this.props.vertical?this.props.vertical:0}</div>
                <div className='s2' style={{textAlign:'center'}}>{this.props.contract?this.props.contract:null}<br/>{this.props.declarer?this.props.declarer:null}</div>
                <div className='s3'>{this.props.transverse?this.props.transverse:0}</div>
            </div>
        )
    }
}
export {Imps, Seats, Tricks}