import React, { Component } from 'react';
export default class Debug extends Component {
    render() {
        const o = this.props.o;
        return (
            <div className='debug' style={{position:'absolute'}}>
                {/* <button onClick={o.testUsersReady}>登录</button> */}
                <button onClick={o.deal}>发牌</button>
                <button onClick={o.checkTest}>nextBidder</button>
                 {/*<button onClick={o.clickToPlay}>出牌</button>
                <button onClick={o.testActive}>阻止出牌</button>
                <button onClick={o.test3}>清理桌面</button>
                <br />
                <button onClick={o.testDummy.bind(o, 'east')}>明手东</button>
                <button onClick={o.testDummy.bind(o, 'west')}>明手西</button>
                <button onClick={o.testDummy.bind(o, 'north')}>明手北</button>
                <br />
                <button onClick={o.testBid}>显示叫牌</button>
                <button onClick={o.testBid1}>叫牌</button>
                <button onClick={o.testClock}>倒计时</button>
                <button onClick={o.testLastTrick}>上一墩牌</button>
                <br />
                <button onClick={o.showResult}>显示结果</button> */}
            </div>
        )
    }
}