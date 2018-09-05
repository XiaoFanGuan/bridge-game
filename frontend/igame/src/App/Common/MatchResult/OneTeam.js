import React from 'react';
import { NavBar, WhiteSpace } from 'antd-mobile';
import { Icon, Table } from 'antd';
import GameTeam from '../../OdooRpc/GameTeam';

const columns = [{
    title: "轮次",
    dataIndex: "round"
}, {
    title: "对阵方",
    dataIndex: "name"
}, {
    title: "IMPs",
    dataIndex: "IMPs"
}, {
    title: "VPs",
    dataIndex: "VPs"
}]
export default class OneTeam extends React.Component {
    state = ({
        data: [],
    });
    componentWillMount() {
        // const m = new GameTeam(()=>{console.log('连接成功')},()=>{'连接失败'});
        const m = new GameTeam((data) => this.setState({ data: data }), () => console.log('没有拿到数据'));
        m.search_combat_team(this.props.team[0], this.props.match.id)
    }
    render() {
        // 初始化表格数据
        // console.log('111', this.state.data);

        // {0: 5, name: "W", round: 0, 5.0: 15}
        let data = this.state.data

        return (
            <div>
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.showPage('OneCourseResult')}    //到一轮结果
                >{this.props.team[1]}
                </NavBar>
                <WhiteSpace size='xl' />
                <Table
                    rowKey={row => { console.log(row) }}
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                />
                {/*
                <h1>赛事名称：{this.props.match.name}</h1>
                <h1>赛事ID：{this.props.match.id}</h1>
                <h1>轮次ID：{this.props.thisOneRound[0]}</h1>
                <h1>队伍ID：{this.props.team[0]}</h1>
               */ }

            </div>
        );
    }
}