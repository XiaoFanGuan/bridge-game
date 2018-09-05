import React from 'react';
import './Course.css';
import Game from '../../OdooRpc/Game';


const Separator = ()=>(
    <div style={{
        backgroundColor: '#F5F5F9',
        height: 8,
        borderTop: '1px solid #ECECED',
        borderBottom: '1px solid #ECECED',  }}>
    </div>
);

export default class Course extends React.Component{
    state = {
        courseData:this.props.course,
        courseId:null,
    }
    componentWillMount(){
        //  判断轮次信息有没有，没有则发起请求
        if(!this.state.courseData){
            const m = new Game(this.success,this.error);
            m.search_rounds_details(this.props.match.id);
        }
    }

    success = (data)=>{
        // const data = [
        //     {id:1, start_time:'2018-07-07 10:00:00', over_time:'2018-07-07 11:00:00', name:'排位赛', number:1},
        //     {id:2, start_time:'2018-07-07 11:15:00', over_time:'2018-07-07 12:15:00', name:'排位赛', number:2},
        //     {id:3, start_time:'2018-07-07 14:30:00', over_time:'2018-07-07 15:30:00', name:'排位赛', number:3},
        //     {id:4, start_time:'2018-07-07 15:45:00', over_time:'2018-07-07 16:45:00', name:'排位赛', number:4},
        //     {id:5, start_time:'2018-07-09 10:00:00', over_time:'2018-07-09 11:00:00', name:'排位赛', number:5},
        //     {id:6, start_time:'2018-07-09 11:15:00', over_time:'2018-07-09 12:15:00', name:'排位赛', number:6},
        //     {id:7, start_time:'2018-07-09 14:30:00', over_time:'2018-07-09 15:30:00', name:'排位赛', number:7},
        //     {id:8, start_time:'2018-07-09 15:45:00', over_time:'2018-08-09 16:45:00', name:'排位赛', number:8},
        //     {id:9, start_time:'2018-10-09 14:58:00', over_time:'2018-10-09 15:59:00', name:'排位赛', number:9}
        // ]
        var tempMap={};
            for(var i=0;i<data.length;i++){
                var obj = data[i];
                var key = obj["start_time"].substr(0,10);
                if( tempMap[key]!==0 && !tempMap[key] ){
                    tempMap[key]=[];
                }
                tempMap[key].push(obj);
            }

        // const lp = (k,i)=>()=>console.log(tempMap[k][i].id)
        const lp = (k,i)=>()=>{             //每个轮次的点击事件
            console.log(tempMap[k][i].id)   //轮次id
            //开始时间，时间戳
            var start_time = new Date(tempMap[k][i].start_time.replace(/-/g,'/')).getTime();
            //结束时间，时间戳
            var over_time = new Date(tempMap[k][i].over_time.replace(/-/g,'/')).getTime();
            //当前时间，时间戳
            var nowtime = new Date().getTime();

            //假定开始前五分钟可以入场准备
            if( start_time>nowtime && start_time-nowtime>300000 ){
                console.log('比赛尚未开始，开始前五分钟才能入场')
                this.props.toMatchResult();     //测试用，以后注释

            }
            if( start_time>nowtime && start_time-nowtime<=300000 ){
                console.log('比赛马上开始，可以入场等待')
                this.props.toMatchResult();     //测试用，以后注释
            }
            if( start_time<nowtime && over_time>nowtime ){
                console.log('比赛进行中，你迟到了')
                this.props.toMatchResult();     //测试用，以后注释
            }
            if( over_time<nowtime ){
                console.log('比赛已经结束，进入成绩查询页');
                this.props.toMatchResult();
            }
            this.props.setInitialPage(2);
            // this.props.setCourseId([tempMap[k][i].id,tempMap[k][i].name,data.length]);
            this.props.setRoundMessage([tempMap[k][i].id,tempMap[k][i].name,tempMap[k][i].number],data);
        }

        //把数据放到table中
        var arr = [];
        for(key in tempMap){
            for (let i = 0; i < tempMap[key].length; i++) {
                if(i===0){
                    arr.push(
                        <tr key={tempMap[key][i].id} >
                            <td rowSpan={tempMap[key].length} > {key} </td>
                            <td> {tempMap[key][i].start_time.substr(11,5)+'-'+tempMap[key][i].over_time.substr(11,5)} </td>
                            <td><a onClick={lp(key,i)} > {tempMap[key][i].name}第{tempMap[key][i].number}轮 </a></td>
                        </tr>)
                }else{
                    arr.push(
                        <tr key={tempMap[key][i].id} >
                            <td> {tempMap[key][i].start_time.substr(11,5)+'-'+tempMap[key][i].over_time.substr(11,5)} </td>
                            <td><a onClick={lp(key,i)} > {tempMap[key][i].name}第{tempMap[key][i].number}轮 </a>
                            </td>
                        </tr>)
                }
            }
        }
        this.setState({     //把整理好的DOM数据放到state里
            courseData:arr,
        })
        this.props.setCourse(arr)   //把整理好的DOM数据状态提升，放回顶层，避免下次访问再连接数据库
    }
    
    error = ()=>{     
        this.setState({
            courseData:
            <tr  >
                <td colSpan={3} >没有赛程信息</td>
            </tr>}
        )
    }

    render() {
        return(
            <div  className='courseTable'>
                <Separator />
                <table>
                    <thead>
                        <tr>
                            <th>日期</th>
                            <th>时间</th>
                            <th>类型【{this.props.match.type}】</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.courseData}
                    </tbody>
                </table>
            </div>
        );
    }
}
