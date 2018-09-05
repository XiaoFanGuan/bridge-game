import React, { Component } from 'react';
import TweenOne from 'rc-tween-one';
import './Claim.css'
/**
* props
* number 剩余数字
* active 点击状态
* myclaim 是否自己　claim   true,false
*/

export default class Claim extends Component {
    state = {
        value: 0,
        submit: 0,
        active: 0 ,
    }
    componentWillReceiveProps(newProps){
        console.log(newProps)
    }
    handleClick = (value) => {
        this.setState({
            value: value
        })
    }
    handleCancel=()=>{
        this.props.cancelClaim()
    }
    handleSubmit = () => {
        this.setState({
            submit: 1
        })
        this.props.onSubmit(this.state.value);
    }
    handleSubmit1 = (data) => {
        console.log(data)
        this.setState({active:1})
        this.props.onSubmit1(data)
    }
    render() {
        const cblocks = Array(this.props.number / 1).fill('').map((_, index) =>
            <Cblock key={index} number={index + 1}
                active={this.state.value === index + 1 ? 0 : 1}
                onClick={this.state.submit ? null : this.handleClick.bind(this, index + 1)} />
        )
        console.log(cblocks)
        const myClaim = <div id='myclaim' className='claim'>
            <h3>请选择你要Claim的墩数？</h3>
            {cblocks}
            {this.state.submit ?
                <button  className='waitingClaim' disabled='true' onClick={this.handleSubmit}>等待确认..</button> :
                <div>
                    <button className='cancelClaim'  onClick={this.handleCancel}>取消</button>
                    <button className='sureClaim' disabled={!this.state.value} onClick={this.handleSubmit}>确认</button>
                </div>
            }
        </div>
        const otherClaim = <div id='otherclaim' className='claim'>
            <span>庄家 claim {this.props.claimnum?this.props.claimnum.num:null} 墩</span>
            {!this.props.isDummy?<button disbaled={this.state.active} onClick={this.handleSubmit1.bind(this,true)}>同意</button>:null}
            {!this.props.isDummy?<button onClick={this.handleSubmit1.bind(this,false)}>拒绝</button>:null}
            {this.props.isDummy?<p>正在等待防守方同意...</p>:null}
        </div>

        return (
            this.props.claimseat===0 ? myClaim : otherClaim
        )
    }
}




class Cblock extends Component {
    /**
     * 参考 bidblocks
     * props.number 数字
     */
    render() {
        const animation = (this.props.active === 0) ?
            { brightness: 0.6 } : { brightness: 1 }
        return (
            <TweenOne
                animation={{
                    ...animation,
                    duration: 100,
                    ease: 'easeOutQuint',       // 缓动参数 参考蚂蚁手册 easeOutExpo
                }}
                className='cblock'
            >

                <div className='cn1' onClick={this.props.onClick} style={{ backgroundColor: '#eeeeee' }}>
                    {this.props.number}
                </div>
            </TweenOne>
        );
    }
}