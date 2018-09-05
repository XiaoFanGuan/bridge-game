import React from 'react';
import { NavBar, WhiteSpace } from 'antd-mobile';
import { Icon, Table } from 'antd';
import Game from '../../OdooRpc/Game';
import './RankingScores.css'


export default class RankingByScores extends React.Component {
    state = ({
        data: [],
        filteredInfo: null,
        sortedInfo: null,
    })

    handleChange = (pagination, filters, sorter) => {
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    }
    componentWillMount() {
        //***********接口方法调用**************
        const m = new Game((data) => this.setState({ data: data }), () => console.log('没有拿数据'));
        m.search_game_score(this.props.match.id)
    }
    render() {
        let { sortedInfo, filteredInfo } = this.state;
        sortedInfo = sortedInfo || {};
        // filteredInfo = filteredInfo || {};
        const columns = [{
            title: '队号',
            width: 60,
            dataIndex: 'team_number',
            fixed: 'left',
            sorter: (a, b) => a.team_number - b.team_number,
            sortOrder: sortedInfo.columnKey === 'team_number' && sortedInfo.order
        }, { title: '队名', dataIndex: 'name', width: 60 },
        { 
            title: '总分',
         dataIndex: 'score',
          width: 60 ,
          render:(text)=>{
              return text.toFixed(2)
          }
        },
        { title: '罚分', dataIndex: 'Penalty', width: 60 },
        { title: '带分', dataIndex: 'band_score', width: 60 },
        { title: '获胜轮数', dataIndex: 'win_round', width: 70 },
        { title: '对手平均分', dataIndex: 'average_score_opp', width: 80 },
        { title: 'IMP.Q', dataIndex: 'IMP.Q', width: 60 },
        {
            title: '排名', dataIndex: 'rank', width: 60, fixed: 'right',
            sorter: (a, b) => a.rank - b.rank,
            sortOrder: sortedInfo.columnKey === 'rank' && sortedInfo.order
        }
        ];
        let data = [];
        if (this.state.data) {
            data = this.state.data;
        }
        return (
            <div>
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.showPage('OneCourseResult')}    //到一轮结果
                >{this.props.match.name}成绩表(按成绩)
                {/* >{this.props.courseId[1]}成绩表(按成绩) */}
                </NavBar>
                <Table
                    rowKey={(row, index) => index}
                    className='scoresTabls'
                    columns={columns}
                    // dataSource={this.state.data}
                    dataSource={data}
                    scroll={{ x: 562 }}
                    pagination={false}
                    size="small"
                    bordered={true}
                    onChange={this.handleChange}
                />
                {/*
                      <WhiteSpace size='xl' />
                <h1>赛事名称：{this.props.match.name}</h1>
                <h1>赛事ID：{this.props.match.id}</h1>
                <h1>轮次ID111：{this.props.thisOneRound[0]}</h1>
                */}
                {/* <h1>轮次ID：{this.props.courseId[0]}</h1> */}

            </div>
        );
    }
}

