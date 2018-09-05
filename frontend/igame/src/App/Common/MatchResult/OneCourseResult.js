import React from 'react';
import { NavBar, WhiteSpace, Toast } from 'antd-mobile';
import { Icon, Row, Col, Table } from 'antd';
import Game from '../../OdooRpc/Game';
import './OneCourseResult.css';

//表头样式
const titleTeam = (<p className="titleSty">
    <span>主队</span>
    <br />
    <span>客队</span>
</p>);
const titleIMPSMOD = (<div className="titleSty">
    <span>IMPS</span>
    <hr style={{ textAlign: "center", "marginTop": 0 }} />
    <span>主队</span>
    <br />
    <span>客队</span>
</div>);
const titleVPSMOD = (<div className="titleSty">
    <span>VPS</span>
    <hr style={{ textAlign: "center", "marginTop": 0 }} />
    <span>主队</span>
    <br />
    <span>客队</span>
</div>);

export default class OneCourseResult extends React.Component {
    state = {
        gameId: this.props.match.id,
        thisOneRound: this.props.thisOneRound,
        rounds: this.props.rounds,
        list: null,
        dealNumber: null,
        data: [] //用于存放获取到的用与表格的数值
    }
    componentWillMount() {
        const m = new Game(this.success, this.error);
        m.search_round_details(this.state.gameId, this.props.thisOneRound[0]);

    }
    toOneTable = (index) => {
        this.props.showPage('OneTable')
        this.props.setTableNumber(index)
    }
    toOneBoard = (index) => {
        this.props.showPage('OneBoard')
        this.props.setBoardId(index)
    }
    toOneTeam = (index) => {
        this.props.showPage('OneTeam')
        this.props.setTeam(index)
    }
    gerUpDatas = (index) => {
        let bb = [];
        console.log(bb.length)
        this.state.rounds.forEach((v, i, a) => {
            if (v.id === index && a[i - 1]) {
                const b = [a[i - 1].id, a[i - 1].name, a[i - 1].number];
                bb.push(b)
            }
        })
        console.log(bb.length)
        if (bb.length) {
            console.log(bb)
            this.setState({
                thisOneRound: bb[0],
            })
            const m = new Game(this.success, this.error);
            m.search_round_details(this.state.gameId, bb[0][0]);
        } else {
            return Toast.info('已经是第一轮了！')
        }
    }
    gerDownDatas = (index) => {
        let bb = [];
        this.state.rounds.forEach((v, i, a) => {
            if (v.id === index && a[i + 1]) {
                const b = [a[i + 1].id, a[i + 1].name, a[i + 1].number];
                bb.push(b)
            }
        })
        if (bb.length) {
            this.setState({
                thisOneRound: bb[0],
            })
            const m = new Game(this.success, this.error);
            m.search_round_details(this.state.gameId, bb[0][0]);
        } else {
            return Toast.info('已经是最后一轮了！')
        }
    }
    success = (data) => {
        console.log(data)
        // const data = [      //测试数据，连上服务器后更改success方法的参数为data，并注释掉这段数据就好
        //     { namtch_id:1, round_name: 'GG', deal: 6, close_id: 2, open_id: 2, number: 1, IMPS: { host_imp: 0.00, guest_imp: 0.00 }, VPS: { host_vp: 10.00, guest_vp: 10.00 }, team: { host_name: "牛的一比", host_id: 1, guest_name: "tthf", guest_id: 2 } },
        //     { namtch_id:2, round_name: 'GG', deal: 6, close_id: 2, open_id: 2, number: 2, IMPS: { host_imp: 0.00, guest_imp: 0.00 }, VPS: { host_vp: 10.00, guest_vp: 10.00 }, team: { host_name: "bagsad", host_id: 3, guest_name: "gththt", guest_id: 4 } },
        //     { namtch_id:3, round_name: 'GG', deal: 6, close_id: 2, open_id: 2, number: 3, IMPS: { host_imp: 58, guest_imp: 12 }, VPS: { host_vp: 10.00, guest_vp: 10.00 }, team: { host_name: "casgasdg", host_id: 5, guest_name: "名字整的好长好长好长啊", guest_id: 6 } },
        //     { namtch_id:4, round_name: 'GG', deal: 6, close_id: 2, open_id: 2, number: 4, IMPS: { host_imp: 0.00, guest_imp: 0.00 }, VPS: { host_vp: 10.00, guest_vp: 10.00 }, team: { host_name: "dadgdggd", host_id: 7, guest_name: "thi", guest_id: 8 } },
        //     { namtch_id:5, round_name: 'GG', deal: 6, close_id: 2, open_id: 2, number: 5, IMPS: { host_imp: 0.00, guest_imp: 0.00 }, VPS: { host_vp: 10.00, guest_vp: 10.00 }, team: { host_name: "dsae", host_id: 9, guest_name: "j", guest_id: 0 } }
        // ]
        console.log('zzzzzz', data)
        let setDealNumber = data[0].deal.map(
            (value, index, array) => {
                return <a key={index} style={{ margin: '0px 5px' }} onClick={() => this.toOneBoard([value, array, index + 1])} >{index + 1}</a>
            }
        )
        // let setDealNumber = length => Array.from({ length }, (v, k) => <a style={{ margin: '0px 5px' }} key={k + 1} onClick={() => this.toOneBoard(k + 1)} >{k + 1}</a>)
        this.props.setThisOneRound(this.state.thisOneRound);

        let match_ids = [];
        data.forEach(element => {
            match_ids.push(element.match_id)
        });
        this.props.setMatchIds([data[0].match_id, match_ids])
        // 先判断是否为空
        this.setState({
            data: data,
            dealNumber: data.length ? setDealNumber : null,
        })
    }
    error = () => {
        console.log('has error!')
    }

    render() {
        //表格表头
        const columns = [{
            title: "桌",
            dataIndex: "number",
            width: "4%",
            render: (text, row) => {
                return (
                    <span>
                        <a
                            onClick={() => this.toOneTable([row.match_id, row.number])}
                        >
                            {text}
                        </a>
                    </span>
                )
            }
        }, {
            title: "完成",
            dataIndex: "deal",
            width: "4%",
            render: (text) => {
                return text.length
            }
        }, {
            title: titleTeam,
            dataIndex: "team",
            width: "50%",
            render: (text, row) => {
                return (
                    <div>
                        <span>
                            <a
                                onClick={() => this.toOneTeam([row.team.host_id, row.team.host_name])}
                            >
                                {text.host_name}
                                {/* {text.host_name} */}
                            </a>
                        </span>
                        <hr />
                        <span>
                            <a
                                onClick={() => this.toOneTeam([row.team.guest_id, row.team.guest_name])}
                            >
                                {text.guest_name}
                            </a>
                        </span>
                    </div>
                )
            }
        }, {
            title: titleIMPSMOD,
            dataIndex: "IMPS",
            width: "22%",
            render: (text) => {
                return (
                    <div>
                        <span>{text.host_imp}</span>
                        <br />
                        <span>{text.guest_imp}</span>
                    </div>
                )
            }
        }, {
            title: titleVPSMOD,
            dataIndex: "VPS",
            width: "20%",
            render: (text) => {
                return (
                    <div>
                        <span>{text.host_vp.toFixed(2)}</span>
                        <br />
                        <span>{text.guest_vp.toFixed(2)}</span>
                    </div>
                )
            }
        }]

        //一共几副牌初始化
        // let dealNumber = 0;
        // if (this.state.dealNumber) {
        //     dealNumber = this.state.dealNumber.length;
        // }

        return (
            <div className='table1'>
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.toMatchDetails()} >
                    {this.state.thisOneRound[1]}第{this.state.thisOneRound[2]}轮
                    <div style={{ width: 35 }} >
                        <Icon type="caret-up" style={{ fontSize: 5, display: 'block' }} onClick={() => this.gerUpDatas(this.state.thisOneRound[0])} />
                        <Icon type="caret-down" style={{ fontSize: 5, display: 'block' }} onClick={() => this.gerDownDatas(this.state.thisOneRound[0])} />
                    </div>
                </NavBar>
                <WhiteSpace size='sm' />
                <Row>
                    <Col span={12} >
                        <div style={{ border: '1px solid gray', textAlign: 'center', padding: 10 }} >对阵结果</div>
                    </Col>
                    <Col span={12} >
                        <div style={{ border: '1px solid gray', textAlign: 'center', padding: 10 }} onClick={() => this.props.showPage('OneCourseRanking')} >赛队排名</div>
                    </Col>
                </Row>
                <WhiteSpace size='sm' />
                <Table
                    rowKey={(row) => row.match_id}
                    // rowKey={(row) => row.number}
                    bordered
                    columns={columns}
                    dataSource={this.state.data}
                    pagination={false}
                />
                <ul>
                    <li>点击桌号 查看计分表</li>
                    <li>点击队名 查看对阵记录</li>
                    <li><a onClick={() => this.props.showPage('Ranking_teamNumber')} >瑞士赛成绩表</a></li>
                    <li><a onClick={() => this.props.showPage('Ranking_scores')} >瑞士赛成绩表(按名次排序)</a></li>
                    <li><a onClick={() => this.props.showPage('Datum')} >Datum</a></li>
                    <li><h3>牌：{this.state.dealNumber}</h3></li>
                </ul>
            </div>
        );
    }
}