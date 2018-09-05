import React from 'react';
import { NavBar, WhiteSpace, Toast } from 'antd-mobile';
import { Icon } from 'antd';
import Game from '../../OdooRpc/Game';
import OneBardTable from './OneBoardTable/OneBoardTable';
import OneBoardPos from './OneBoardTable/OneBoardPos';
export default class OneBoard extends React.Component {
    state = {
        boardId: this.props.boardId[0],
        boardIds: this.props.boardId[1],
        boardNumber: this.props.boardId[2],
        data: []
    }
    componentWillMount() {
        //***********接口方法调用**************
        /**
      * params:game_id,round_id,deal_id
      * return:
     */
        console.log(this.props.boardId[1], '11111111111111');

        const m = new Game((data) => this.success(data), () => console.log('没有拿数据'));
        m.round_deal_info(this.props.match.id, this.props.thisOneRound[0], this.state.boardId)
    }
    success = (data) => {
        this.setState({
            data: data
        })
    }
    gerUpDatas = (index) => {
        let number = null;
        let id = null;
        this.state.boardIds.forEach((v, i, a) => {
            if (v === index && a[i - 1]) {
                number = this.state.boardNumber - 1;
                id = a[i - 1];
            }
        })
        if (id) {
            this.setState({
                boardNumber: number,
                boardId: id,
            })
            const m = new Game((data) => this.success(data), () => console.log('没有拿数据'));
            m.round_deal_info(this.props.match.id, this.props.thisOneRound[0], this.state.boardId)
        } else {
            return Toast.info('已经是第一副了！')
        }
    }
    gerDownDatas = (index) => {
        let number = null;
        let id = null;
        this.state.boardIds.forEach((v, i, a) => {
            if (v === index && a[i + 1]) {
                number = this.state.boardNumber + 1;
                id = a[i + 1];
            }
        })
        if (id) {
            this.setState({
                boardNumber: number,
                boardId: id,
            })
            const m = new Game((data) => this.success(data), () => console.log('没有拿数据'));
            m.round_deal_info(this.props.match.id, this.props.thisOneRound[0], this.state.boardId)
        } else {
            return Toast.info('已经是最后一副了！')
        }
    }

    render() {
        return (
            <div>
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.showPage('OneCourseResult')}    //到一轮结果

                >第{this.state.boardNumber}副牌
                <div style={{ width: 35 }} >
                        <Icon type="caret-up" style={{ fontSize: 5, display: 'block' }} onClick={() => this.gerUpDatas(this.state.boardId)} />
                        <Icon type="caret-down" style={{ fontSize: 5, display: 'block' }} onClick={() => this.gerDownDatas(this.state.boardId)} />
                    </div>
                </NavBar>
                <OneBoardPos direction={this.state.data[1]} />
                <OneBardTable data={this.state.data} />
                <WhiteSpace size='xl' />
                {/*
                <h1>赛事名称：{this.props.match.name}</h1>
                <h1>赛事ID：{this.props.match.id}</h1>
                 <h1>轮次ID：{this.props.courseId[0]}</h1> 
                <h1>轮次ID：{this.props.thisOneRound[0]}</h1>
                <h1>牌的IDzzzzz：{this.props.boardId}</h1>
                */}


            </div>
        );
    }
}