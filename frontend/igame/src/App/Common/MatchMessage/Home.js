import React from 'react';
import {  Row, Col, } from 'antd';
import { WhiteSpace, Button } from 'antd-mobile';

import 'antd-mobile/dist/antd-mobile.css'; // 这一句是从哪里引入的？

export default class DetailsHome extends React.Component {    //已完成的比赛
    componentWillMount(){
    }
    toSignMatch=()=>{
        this.props.toSignMatch()
        //传回比赛ID
    }
    render() {
        const match = this.props.match;
        return(
            <div> 
                <Row>
                    <Col span={24}><img src='/Images/963065731.jpg' alt='logo' style={{width:'100%',height:100}} /></Col>
                </Row>
                <Row>
                    <Col span={24}>{match.name?match.name:'暂无' }</Col>
                </Row>
                <Row style={{marginTop:5}}>
                    <Col span={8}>比赛时间：</Col>
                    <Col span={16}>{match.datetime?match.datetime:'暂无' }</Col>
                </Row>
                <Row style={{marginTop:10}}>
                    <Col span={8}>主办单位：</Col>
                    <Col span={16}>{match.host_unit?match.host_unit:'暂无'}</Col>
                </Row>
                <Row style={{marginTop:10}}>
                    <Col span={8}>赞助单位：</Col>
                    <Col span={16}>{match.sponsor?match.sponsor:'暂无'}</Col>
                </Row>
                <Row style={{marginTop:10}}>
                    <Col span={8}>裁判：</Col>
                    <Col span={16}>{match.referee?match.referee:'暂无'}</Col>
                </Row>
                <Row style={{marginTop:10}}>
                    <Col span={8}>仲裁：</Col>
                    <Col span={16}>{match.arbitration?match.arbitration:'暂无'}</Col>
                </Row>
                <Row style={{marginTop:10}}>
                    <Col span={8}>报名时间：</Col>
                    <Col span={16}>{match.datetime?match.datetime:'暂无'}</Col>
                </Row>
                <Row style={{marginTop:10}}>
                    <Col span={8}>联系方式：</Col>
                    <Col span={16}>
                        <Row>
                            <Col>联系人：{match.contact?match.contact:'张江川'}</Col>
                            <Col>电  话： {match.contact?match.contact:'13111110000'}</Col>
                            <Col>邮  箱： {match.contact?match.contact:'OdooHt@163.com'}</Col>
                            <Col>传  真： {match.contact?match.contact:'13111110000'}</Col>
                        </Row>
                    </Col>
                </Row>
                <WhiteSpace size='xl' />
                <WhiteSpace size='xl' />
                {this.props.name||(match&&match.tt===true) ? null : <Button type="primary" size="small" onClick={()=>this.toSignMatch()} >我要报名</Button>}
            </div>
        );
    }
}

