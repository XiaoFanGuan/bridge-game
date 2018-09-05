import React from 'react';
import { NavBar, WhiteSpace, Toast } from 'antd-mobile';
import { Icon } from 'antd';
import GradeDatumTable from './DatumTable/GradeDatumTable';
import Game from '../../OdooRpc/Game';
export default class Datum extends React.Component {
    state = ({
        // data: []
        tableNum: null,
        host: null,
        guest: null,
        gradeArr: null,
        directionArr: null,
        match_ids: this.props.match_ids[1],
        match_id: this.props.match_ids[0]
    })
    componentWillMount() {
        //***********接口方法调用**************
        console.log(1111111111111111111111111)
        console.log(this.props.thisOneRound)
        console.log('this.props.match_ids')
        console.log(this.props.match_ids)
        console.log('[this.props.match_ids[1]]')
        console.log(this.props.match_ids[1])
        const m = new Game((data) => this.success(data), () => console.log('没有拿数据'));
        m.search_round_table_score(this.props.match.id, this.props.thisOneRound[0], this.props.match_ids[0])
    }

    gerUpDatas = (index) => {
        let number = null;
        let id = null;
        this.state.match_ids.forEach((v, i, a) => {
            if (v === index && a[i - 1]) {
                number = this.state.tableNum - 1;
                id = a[i - 1];
            }
        })
        if (id) {
            this.setState({
                tableNum: number,
                match_id: id,
            })
            const m = new Game((data) => this.success(data), () => console.log('没有拿数据'));
            m.round_deal_info(this.props.match.id, this.props.thisOneRound[0], this.state.match_id)
        } else {
            return Toast.info('已经是第一桌了！')
        }
    }
    gerDownDatas = (index) => {
        let number = null;
        let id = null;
        this.state.match_ids.forEach((v, i, a) => {
            if (v === index && a[i + 1]) {
                number = this.state.tableNum - 1;
                id = a[i + 1];
            }
        })
        if (id) {
            this.setState({
                tableNum: number,
                match_id: id,
            })
            const m = new Game((data) => this.success(data), () => console.log('没有拿数据'));
            m.round_deal_info(this.props.match.id, this.props.thisOneRound[0], this.state.match_id)
        } else {
            return Toast.info('已经是最后一桌了！')
        }
    }
    success = (data) => {
        let tableNum = ''; //桌号
        let host = '';    //主场
        let guest = '';   //客场
        let gradeArr = []; //成绩数组
        let directionArr = []; //人员方位
        if (data) {
            data.map((child, index) => {
                switch (index) {
                    case 0:
                        tableNum = child[0].table_num;
                        break;
                    case 1:
                        host = child[1].host;
                        break;
                    case 2:
                        guest = child[2].guest;
                        break;
                    case 3:
                        gradeArr = child[3];
                        break;
                    case 4:
                        directionArr = child[4];
                        break;
                    default:
                        break;
                }
            })
        }
        this.setState({
            tableNum: tableNum,
            host: host,
            guest: guest,
            gradeArr: gradeArr,
            directionArr: directionArr
        })
    }

    render() {
        let table_num = 1;
        if (this.state.tableNum) {
            table_num = this.state.tableNum
        }
        return (
            <div>
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.showPage('OneCourseResult')}    //到一轮结果
                >排位赛第{table_num}桌
                <div style={{ width: 35 }} >
                        <Icon type="caret-up" style={{ fontSize: 5, display: 'block' }} onClick={() => this.gerUpDatas(this.props.match_ids[0])} />
                        <Icon type="caret-down" style={{ fontSize: 5, display: 'block' }} onClick={() => this.gerDownDatas(this.state.match_ids[0])} />
                    </div>
                </NavBar>
                <GradeDatumTable
                    gradeArr={this.state.gradeArr}
                    directionArr={this.state.directionArr}
                    host={this.state.host}
                    guest={this.state.guest}
                />
                <WhiteSpace size='xl' />


            </div>
        );
    }
}