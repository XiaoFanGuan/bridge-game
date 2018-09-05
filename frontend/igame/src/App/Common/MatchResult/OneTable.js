import React from 'react';
import { NavBar, WhiteSpace } from 'antd-mobile';
import { Icon } from 'antd';
import './OneTable.css';
import Game from '../../OdooRpc/Game';
import TotalTable from './OneTable/TotalTable';
export default class OneTable extends React.Component {
    state = ({
        data: null
    })
    componentWillMount() {
        //***********接口方法调用**************
        const m = new Game((data) => this.setState({ data: data }), () => console.log('没有拿到本轮排名数据'));
        m.table_result(this.props.match.id, this.props.thisOneRound[0], this.props.tableNumber[0], this.props.tableNumber[1])
        // gameId, roundId, match_id, number
    }
    render() {
        let data = [];
        let openE = '', openW = '', openS = '', openN = '';
        let closeE = '', closeW = '', closeS = '', closeN = '';
        let imps = '', vps = '';
        if (this.state.data) {
            data = this.state.data[0];
            openE = this.state.data[1][0].open[0].E;
            openS = this.state.data[1][0].open[0].S;
            openN = this.state.data[1][0].open[0].N;
            openW = this.state.data[1][0].open[0].W;
            closeE = this.state.data[1][0].close[0].E;
            closeS = this.state.data[1][0].close[0].S;
            closeN = this.state.data[1][0].close[0].N;
            closeW = this.state.data[1][0].close[0].W;
            imps = this.state.data[2].IMPs;
            vps = this.state.data[3].VPs;
        }
        console.log(imps, '111111')
        return (
            <div>
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.showPage('OneCourseResult')}    //到一轮结果
                >第{this.props.tableNumber[1]}桌
                </NavBar>
                <div className="teamName">
                    <p>法尔胜 VS 育贤海外队</p>
                </div>
                <div className="openhouse">开室</div>
                <div className="open">
                    <div className="openbox">
                        <div className="north">{openN}</div>
                        <div className="middle">
                            <div className="western">{openW}</div>
                            <div className="table">
                                <div className="tablebox">
                                    <div className="nor">N</div>
                                    <div className="wes">W</div>
                                    <div className="ease">E</div>
                                    <div className="sou">S</div>
                                </div>
                            </div>
                            <div className="east">{openE}</div>
                        </div>
                        <div className="south">{openS}</div>
                    </div>
                </div>
                {/*与上面的内容样式相同 重复使用className*/}
                <div className="openhouse">闭室</div>
                <div className="open">
                    <div className="openbox">
                        <div className="north">{closeN}</div>
                        <div className="middle">
                            <div className="western">{closeW}</div>
                            <div className="table">
                                <div className="tablebox">
                                    <div className="nor">N</div>
                                    <div className="wes">W</div>
                                    <div className="ease">E</div>
                                    <div className="sou">S</div>
                                </div>
                            </div>
                            <div className="east">{closeE}</div>
                        </div>
                        <div className="south">{closeS}</div>
                    </div>
                </div>
                <TotalTable
                    data={data}
                    imps={imps}
                    vps={vps}
                />
                <WhiteSpace size='xl' />
                {/*
                 <h1>赛事名称：{this.props.match.name}</h1>
                <h1>赛事ID：{this.props.match.id}</h1>
                <h1>轮次ID111：{this.props.thisOneRound[0]}</h1>
                <h1>number：{this.props.tableNumber[0]}</h1>
                <h1>match_id：{this.props.tableNumber[1]}</h1>
                */}
            </div>
        );
    }
}