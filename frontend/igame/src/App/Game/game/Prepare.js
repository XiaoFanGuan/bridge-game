import React, { Component } from 'react';
import './Prepare.css'
export default class Prepare extends Component {
    // handleClick=()=>{
        // if(this.props.readyState.south){
        //     this.props.handleReady()
        // }else{
        //     this.props.handleReady()
        // }
    // }
    render() {
        return (
            <div className='prepare'>
                <button key='0' className={ ' pe'} disabled={true}
                >
                {this.props.readyState.east?'就绪':'准备'}
                </button>
                <button key='1' className={ ' ps'}
                    disabled={this.props.readyState.south}
                    onClick={() => this.props.handleReady()}
                    // onClick={this.handleClick}
                    >
                {this.props.readyState.south?'就绪':'准备'}
                </button>
                <button key='2' className={' pw'} disabled={true}
                    >
                {this.props.readyState.west?'就绪':'准备'}
                </button>
                <button key='3' className={' pn'} disabled={true}
                >
                {this.props.readyState.north?'就绪':'准备'}
                </button>
            </div>
        )
    }
}