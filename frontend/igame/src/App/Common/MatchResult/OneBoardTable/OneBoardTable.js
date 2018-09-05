import React, { Component } from 'react';
import { Table } from 'antd';
import './oneBoardTable.css';
const oneBoardColumns = [{
    title: "桌号",
    dataIndex: 'number',
    fixed: 'left',
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
    },
}, {
    title: "主队",
    dataIndex: 'no1',
    colSpan: 2,
}, {
    title: "主队",
    dataIndex: 'no2',
    colSpan: 0,
}, {
    title: "客队",
    dataIndex: 'no3',
    colSpan: 2,
}, {
    title: "客队",
    dataIndex: 'no4',
    colSpan: 0,
}, {
    title: '',
    dataIndex: 'table',
    render: (text) => {
        if (text === "open") {
            return '开室'
        } else if (text === "close") {
            return '闭室'
        }
    }
}, {
    title: '庄家',
    dataIndex: 'declarer',
}, {
    title: '约定',
    dataIndex: 'contract'
}, {
    title: '结果',
    dataIndex: 'result',
}, {
    title: 'NS',
    dataIndex: 'NS'
}, {
    title: 'EW',
    dataIndex: 'EW'
}, {
    title: 'Datum',
    dataIndex: 'Datum'
}, {
    title: 'ximp',
    dataIndex: 'ximp'
}, {
    title: '主队IMP',
    dataIndex: 'host_imp',
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
    },
}, {
    title: '客队IMP',
    dataIndex: 'guest_img',
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
    },
}]

export default class OneBardTable extends Component {
    render() {
        let datas = [];
        if (this.props.data) {
            datas = this.props.data[0];
        }
        return (
            <div>
                <Table
                    bordered
                    className="oneTable"
                    dataSource={datas}
                    columns={oneBoardColumns}
                    pagination={false}
                    size='small'
                    scroll={{ x: 900 }}
                />
            </div>
        )
    }
}
