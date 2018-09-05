import React, { Component } from 'react';
import './Prepare.css'
export default class Prepare extends Component {
    render() {
        return (
            <div className='prepare'>
                <button key='0' className={ ' pe'}
                >
                {this.props.readyState.east?'就绪':'准备'}
                </button>
                <button key='1' className={ ' ps'}
                    disabled={this.props.readyState.south}
                    onClick={() => this.props.handleReady()}
                    >
                {this.props.readyState.south?'就绪':'准备'}
                </button>
                <button key='2' className={' pw'}
                    >
                {this.props.readyState.west?'就绪':'准备'}
                </button>
                <button key='3' className={' pn'}
                >
                {this.props.readyState.north?'就绪':'准备'}
                </button>
            </div>
        )
    }
}