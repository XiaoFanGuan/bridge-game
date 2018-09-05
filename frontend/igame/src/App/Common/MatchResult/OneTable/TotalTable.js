import React, { Component } from 'react';
import { Table, Divider } from 'antd';
import './TotalTable.css';

const renderContent = (value, row, index) => {
    const obj = {
        children: value,
        props: {},
    };
    if (index === 4) {
        obj.props.colSpan = 0;
    }
    return obj;
};

const impsTitle = <div className="impstitle">
    <p className="impsp">IMPs</p>
    <hr />
    <div className="impsp">
        <span>主</span>
        <Divider style={{ background: '#000' }} type="vertical" />
        <span>客</span>
    </div>
</div>

const columns = [{
    title: '牌号',
    dataIndex: 'number',
    width: '12%',
    render: (value, row, index) => {
        const obj = {
            children: value,
            props: {},
        };
        if (index === 0) {
            obj.props.rowSpan = 2;
        }
        else if (index % 2 == 0 && index > 1) {
            obj.props.rowSpan = 2;
        } else {
            obj.props.rowSpan = 0;
        }
        return obj;
    }
}, {
    title: '房间',
    dataIndex: 'table',
    width: '12%',
    render: (text) => {
        if (text === 'open') {
            return '开'
        } else if (text === 'close') {
            return '关'
        }
    }
}, {
    title: '庄家',
    dataIndex: 'declarer',
    width: '11%',
    render: (value) => {
        if (value === false) {
            return '无'
        }
    }
}, {
    title: '约定',
    dataIndex: 'contract',
    width: '12%',
    render: (value) => {
        if (value === false) {
            return '无'
        }
    }
}, {
    title: '结果',
    dataIndex: 'result',
    width: '11%'
}, {
    title: 'NS',
    dataIndex: 'NS',
    width: '13%',

}, {
    title: "EW",
    dataIndex: 'EW',
    width: '13%',
}, {
    title: impsTitle,
    colSpan: 2,
    dataIndex: 'host_imp',
    width: '8%',
    render: (value, row, index) => {
        const obj = {
            children: value,
            props: {},
        };
        if (index === 0) {
            obj.props.rowSpan = 2;
        } else if (index % 2 == 0 && index > 1) {
            obj.props.rowSpan = 2;
        } else {
            obj.props.rowSpan = 0;
        }
        return obj;
    }
    //guest_imp host_imp
}, {
    title: impsTitle,
    colSpan: 0,
    dataIndex: 'guest_imp',
    width: '8%',
    render: (value, row, index) => {
        const obj = {
            children: '12',
            props: {},
        };
        if (index === 0) {
            obj.props.rowSpan = 2;
        } else if (index % 2 == 0 && index > 1) {
            obj.props.rowSpan = 2;
        } else {
            obj.props.rowSpan = 0;
        }
        return obj;
    }
    //guest_imp host_imp
}]
class TotalTable extends Component {
    render() {
        let datas = [];
        let data = null;
        const propsData = this.props.data;
        if (propsData) {
            propsData.map((child) => {
                child.map((item) => {
                    datas = [...datas, item]
                })
            })
        }
        return (
            <div>
                <table
                    className="impsTable">
                    <tbody>
                        <tr>
                            <td>IMPs</td>
                            <td>{this.props.imps}</td>
                        </tr>
                        <tr>
                            <td>VPs</td>
                            <td>{this.props.vps}</td>
                        </tr>
                    </tbody>
                </table>
                <Table
                    className="talbeText"
                    size="small"
                    columns={columns}
                    dataSource={datas}
                    bordered
                    pagination={false}
                />
            </div>
        )
    }
}

export default TotalTable;


