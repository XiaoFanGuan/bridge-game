import React from 'react';
import { NavBar, WhiteSpace } from 'antd-mobile';
import { Icon, Row, Col, Table } from 'antd';
import Game from '../../OdooRpc/Game';

const columns = [{
    title: '排名',
    children: [{
        title: "名次",
        // dataIndex: "ranking",
        dataIndex: "rank",
        width: "15%",
    }, {
        title: "参赛队",
        // dataIndex: "team",
        dataIndex: "name",
        width: "35%",
    }, {
        title: "VPs",
        dataIndex: "VPs",
        width: "20%",
    }, {
        title: "罚分",
        dataIndex: 'penaltyPoints',
        width: "20%",
    }]
}]


export default class OneCourseRanking extends React.Component {
    state = {
        data: null
    }
    componentWillMount() {
        //***********接口方法调用**************
        const m = new Game((data) => this.setState({ data: data }), () => console.log('没有拿到本轮排名数据'));
        m.round_team_rank(this.props.thisOneRound[0], this.props.match.id)
    }
    render() {
        return (
            <div>
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.toMatchDetails()}    //返回轮次页
                >{this.props.thisOneRound[1]}第{this.props.thisOneRound[2]}轮排名(每轮排名)
                {/* >{this.props.courseId[1]}排名(每轮排名)thisOneRound */}
                </NavBar>
                <WhiteSpace size='sm' />
                <Row>
                    <Col span={12} >
                        <div style={{ border: '1px solid gray', textAlign: 'center', padding: 10 }} onClick={() => this.props.showPage('OneCourseResult')} >对阵结果</div>
                    </Col>
                    <Col span={12} >
                        <div style={{ border: '1px solid gray', textAlign: 'center', padding: 10 }} >赛队排名</div>
                    </Col>
                </Row>
                <WhiteSpace size='sm' />
                <Table
                    rowKey={(row) => row.team_id}         //注意：这里需要一个不重复的值
                    columns={columns}
                    dataSource={this.state.data}
                    // dataSource={data}
                    size="small"
                    pagination={false}
                />,
                {/*
                <h1>赛事名称：{this.props.match.name}</h1>
                <h1>赛事ID：{this.props.match.id}</h1>
                <h1>轮次ID：{this.props.courseId[0]}</h1>*/}
            </div>
        );
    }
}