import React, { Component } from 'react';
import { Table } from 'antd';
import './GradeDatumTable.css';
const desk =
    <table className="tablsTitle">
        <tbody>
            <tr>
                <td className="firsttd" colSpan="2">1桌</td>
            </tr>
            <tr>
                <td className="lefttd">开室</td>
                <td>闭室</td>
            </tr>
        </tbody>
    </table>
//名称不显示  title没用
const directionArrColumns = [
    {
        title: '牌号',
        dataIndex: 'emay',
        width: "10%",
    }, {
        title: 'pos',
        dataIndex: 'pos',
        width: "30%"
    }, {
        title: desk,
        colSpan: 2,
        dataIndex: 'open',
        width: "30%"
    }, {
        title: '闭室',
        colSpan: 0,
        dataIndex: 'close',
        width: "30%"
    },
]
class GradeDatumTable extends Component {
    render() {
        let gradeArrProps = [];
        let openGrade = 0;
        let closeGrade = 0;
        let directionArrProps = [];
        let hostProps = '';
        let guestProps = '';
        if (this.props.gradeArr) {
            this.props.gradeArr.map((child) => {
                openGrade += child.open;
                closeGrade += child.close;
            })
            gradeArrProps = [...this.props.gradeArr, { deal_number: 'XIMP', datum: 'XIMP', open: 'XIMP', close: 'XIMP' }]
        }
        if (this.props.host) {
            hostProps = this.props.host;
        }
        if (this.props.guest) {
            guestProps = this.props.guest;
        }
        if (this.props.directionArr) {
            this.props.directionArr.map((child) => {

            })
            directionArrProps = this.props.directionArr

            directionArrProps.map((child) => {
                child = { ...child, emay: '' }
            })
        }
        const HostGuest = [{ eamy: null, game: '主场', 'people': hostProps }, { eamy: null, game: '客场', 'people': guestProps }]
        const columnsHostGuest = [{
            title: '空',
            dataIndex: 'eamy',
            width: '10%',
        }, {
            title: '主客',
            dataIndex: 'game',
            width: '30%',
        }, {
            title: 'people',
            dataIndex: 'people',
            width: '60%'
        }]
        const columns = [{
            title: '牌号',
            dataIndex: 'deal_number',
            width: "10%",
            render: (text) => {
                if (text === 'XIMP') {
                    return null
                } else {
                    return text
                }
            }
        }, {
            title: 'datum',
            dataIndex: 'datum',
            width: "30%",
            render: (text) => {
                if (text === 'XIMP') {
                    return <span style={{ color: 'red' }}>XIMP</span>
                } else {
                    return text
                }
            }
        }, {
            title: desk,
            dataIndex: 'open',
            colSpan: 2,
            width: "30%",
            render: (text, row, index) => {
                if (text === 'XIMP') {
                    return <span style={{ color: 'red' }}>{openGrade}</span>
                } else {
                    return text
                }
            }
        }, {
            title: '闭室',
            colSpan: 0,
            dataIndex: 'close',
            width: "30%",
            render: (text, row, index) => {
                if (text === 'XIMP') {
                    return <span style={{ color: 'red' }}>{closeGrade}</span>
                } else {
                    return text
                }
            }
        }]
        return (
            <div>
                {gradeArrProps ?
                    <div>
                        <Table
                            // style={{ height: 150 }}
                            dataSource={gradeArrProps}
                            className="datumTable datumborder"
                            bordered
                            size="small"
                            columns={columns}
                            pagination={false}
                        />
                        <div >
                            <Table
                                style={{ height: '100%' }}
                                dataSource={directionArrProps}
                                className="datumTable gradeTable gradeborder "
                                bordered
                                showHeader={false}
                                size="small"
                                columns={directionArrColumns}
                                pagination={false}
                            />
                        </div>
                        <div>
                        <Table
                            style={{ height: 161 }}
                            dataSource={HostGuest}
                            className="datumTable gradeTable hostGuestTable"
                            bordered
                            showHeader={false}
                            size="small"
                            columns={columnsHostGuest}
                            pagination={false}
                        /></div>
                    </div>
                    : ''
                }
            </div> 
        )
    }
}

export default GradeDatumTable;