/**
 * 每日签到 
 * 日历组件 
 * LSY
 */

import React, { Component } from 'react';
import './Calendar.css';
const date = new Date();
//一年内每月天数数组（润年判断）
let yearDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 30, 31, 30, 31];
let yearDate = date.getFullYear();
if (yearDate % 4 === 0 || yearDate % 100 !== 0 && yearDate % 400 === 0) {
    yearDate[1] = 29;
}
//求出当月一号是星期几
let monthDate = date.getMonth();
let todayDate = date.getDate();
//第一行几个空格
var d = new Date();
d.setDate(1);
let monthFirst = 6 - d.getDay();
//每月有多少行 
let rows = [];
//最后一行有多少天
let lastRow;
let r = Math.floor((yearDay[monthDate] - (7 - monthFirst)) / 7);  //有多少整行
let remainder = (yearDay[monthDate] - (7 - monthFirst)) % 7;  //最后一行有几天
if (remainder > 0) {
    lastRow = remainder;
}

//渲染第一行
let keys = 60;  //给日历空白区域定义key值
let firstRows = [];
for (let i = 0; i < 7; i++) {
    if (i > monthFirst - 1) {
        firstRows[i] = 1;
    } else {
        firstRows[i] = keys;
        keys += 1;
    }
}
console.log(firstRows);
//中间行渲染
let weekRows = [];
//尾行渲染
// let WeekRows = [][7];
let middleFirstDay = 7 - monthFirst + 1;
for (let i = 0; i < r; i++) {
    let arr1 = []
    for (let m = 0; m < 7; m++) {
        arr1.push(middleFirstDay);
        middleFirstDay += 1;
    }
    weekRows.push(arr1)
}

let lastWeekRows = [];
//最后一行的第一个日期
let lastFirstDay = yearDay[monthDate] - remainder + 1;
for (let i = 0; i < 7; i++) {
    if (i < remainder) {
        lastWeekRows[i] = lastFirstDay;
        lastFirstDay += 1
    } else {
        lastWeekRows[i] = keys;
        keys += 1;
    }
}

class Calendar extends Component {
    //今天几号
    today = new Date().getDate();
    //日历存在两种状态 （签到/未签到）
    state = ({
        //已经签到天数
        signDay: [1, 3, 6, 8, 10, 25, 30, 31],
        //先做一个判断 若false 则禁用按钮  再把所有签到日期遍历证明没签到  
        today: true
    })
    componentWillMount() {
        const { signDay } = this.state;
        signDay.map((child) => {
            if (child === this.today) {
                this.setState({
                    today: false
                })
            }
        })
    }
    onActive = () => {
        const { signDay } = this.state;
        this.setState({
            signDay: [...signDay, this.today],
            today: false
        })
    }
    render() {
        //首行选中渲染 
        const firstWeek = firstRows.map((child) => {
            let signDayStyle = {
                "background": "fff"
            }
            for (let s = 0; s < this.state.signDay.length; s++) {
                if (child === this.state.signDay[s]) {
                    signDayStyle.background = "yellow"
                }
            }
            return (
                <td key={child}>
                    <div style={signDayStyle}>
                        {child >= 60 ? '' : child}
                    </div>
                </td>
            )
        })
        //中间行渲选中样式
        const middleWeek = weekRows.map((child, index) => {
            return (
                <tr key={index}>
                    {child.map((item) => {
                        let signDayStyle = {
                            "background": "#fff"
                        }
                        for (let s = 0; s < this.state.signDay.length; s++) {
                            if (item === this.state.signDay[s]) {
                                signDayStyle.background = "yellow"
                            }
                        }
                        return (
                            <td key={item}>
                                <div style={signDayStyle}>
                                    {item}
                                </div>
                            </td>
                        );
                    })}
                </tr>
            )
        })
        //最后一行选中样式
        const lastWeek = lastWeekRows.map((child) => {
            let signDayStyle = {
                "background": "#fff`"
            }
            for (let s = 0; s < this.state.signDay.length; s++) {
                if (child === this.state.signDay[s]) {
                    signDayStyle.background = "yellow"
                }
            }
            return (
                <td key={child}>
                    <div style={signDayStyle}>
                        {child >= 60 ? '' : child}
                    </div>
                </td>
            )
        })
        //签到样式
        const isToday = { disabled: this.state.today ? '' : 'disabled' }; //今天是否已经签到

        return (
            <div>
                <div className="signButton">
                    <button {...isToday} onClick={this.onActive}>点击签到</button>
                </div>
                <div className="yearmonth">
                    <p>
                        {yearDate}年{monthDate+1}月
                    </p>
                </div>
                <table className="calendartable">
                    <tbody>
                        <tr>
                            <th>一</th>
                            <th>二</th>
                            <th>三</th>
                            <th>四</th>
                            <th>五</th>
                            <th>六</th>
                            <th>日</th>
                        </tr>
                        <tr>
                            {firstWeek}
                        </tr>
                        {middleWeek}
                        <tr>
                            {lastWeek}
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Calendar;