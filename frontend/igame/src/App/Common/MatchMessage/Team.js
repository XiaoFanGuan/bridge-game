import React from 'react';
import { Row, Col } from 'antd';
import {  List  } from 'antd-mobile';
import GameTeam from '../../OdooRpc/GameTeam';

const Item = List.Item;

const Separator = ()=>(
    <div style={{
        backgroundColor: '#F5F5F9',
        height: 8,
        borderTop: '1px solid #ECECED',
        borderBottom: '1px solid #ECECED',  }}>
    </div>
);

export default class MatchTeam extends React.Component{
    state = {
        datas:null,
    }
    componentWillMount(){
        const m = new GameTeam(this.success,this.error);
        m.search_game_player(this.props.match.id);
    }
    success=(datas)=>{
        // console.log('*********参赛队信息**********')
        // console.log(data)
        
        // const datas = [
        //     {number:'12',
        //     ranking:'2',
        //     coach:'李四',
        //     leader:'张三',
        //     name:'白鲨1队',
        //     member:[{id:1,name:'蒋周伟',others:'56%'},{id:1,name:'蒋周伟',others:'56%'},
        //             {id:1,name:'蒋周伟',others:'56%'},{id:1,name:'蒋周伟',others:'56%'},],
        //     pay:true},
        //     {number:'25',
        //     ranking:'3',
        //     coach:'李四',
        //     leader:'张三',
        //     name:'白鲨2队',
        //     member:[{id:1,name:'张三',others:'56%'},{id:1,name:'李四',others:'56%'},
        //             {id:1,name:'李四',others:'56%'},{id:1,name:'李四',others:'56%'},],
        //     pay:false},
        //     {number:'32',
        //     ranking:'1',
        //     coach:'李四',
        //     leader:'张三',
        //     name:'白鲨5队',
        //     member:[{id:1,name:'王麻子',others:'56%'},{id:1,name:'王麻子',others:'56%'},
        //             {id:1,name:'王麻子',others:'56%'},{id:1,name:'王麻子',others:'56%'},],
        //     pay:true},
        // ]
        // console.log(datas)
        let data1 = null;
        if(datas){
            data1 = datas.map((item,index)=>{ //后端数据完善后这里还需作调整
                return(
                    <Item key={index} >
                    
                    <Row  type="flex" justify="center">
                        <Col span={6}> <span>编号</span> </Col>
                        <Col span={18}> <span>{item.number}</span> </Col>
                    </Row>
                    <Row>
                        <Col span={6}> <span>名次</span> </Col>
                        {/* <Col span={18}> <span>{item.rank}</span> </Col> */}
                        <Col span={18}> <span>{item.ranking}</span> </Col>
                    </Row>
                    <Row>
                        <Col span={6}> <span>队名</span> </Col>
                        <Col span={18}> <span>{item.name}</span> </Col>
                    </Row>
                    <Row> 
                        <Col span={6}> <span>教练/领队</span> </Col>
                        <Col span={18}> <span>{item.coach} / {item.leader}</span> </Col>
                    </Row>
                    <Row>
                        <Col span={6}> <span>队员</span> </Col>
                        <Col span={18}> 
                            {/* {item.player.map((v,i)=>{return<Row key={i}> */}
                            {item.member.map((v,i)=>{return<Row key={i}>
                                <Col span={6}><span>{v.id}</span></Col>
                                <Col span={12}><span>{v.name}</span></Col>
                                <Col span={6}><span>69%</span></Col>
                                {/* <Col span={6}><span>{v.others}</span></Col> */}
                            </Row>})}
                        </Col>
                        
                    </Row>  
                    <Row style={{textAlign:'center',color:'#fff',background:item.pay?'blue':'red' }} >
                        {item.pay?'已交费':'未交费'}
                    </Row>
                </Item>
                )
            })
        
        
        }else{
            data1=<Item>没有参赛队信息</Item>
        }
        this.setState({
            datas:data1,
        })
    }
    error=()=>{
        console.log('has error !')
    }
    render() {
        return(
            <div>
                <Separator />
                <Item style={{background:'aquamarine',fontSize:24}} >{this.props.match.type==='team'?'队式赛':'其他'}</Item>
                {this.state.datas}
                {/* <h1>还没有数据......</h1> */}
            </div>
        );
    }
}


