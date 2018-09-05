import React from 'react';
import 'antd-mobile/dist/antd-mobile.css'; // 这一句是从哪里引入的？
import { Row, Col } from 'antd';
import { WingBlank, WhiteSpace, NavBar, Icon, List  } from 'antd-mobile';

const Item=List.Item;

export default class TeamDetails extends React.Component {
    render (){
        const teamDetailsData = this.props.teamDetailsData;     //详情数据
        const data =teamDetailsData.players.map((item,index)=>{ //后端数据完善后这里还需作调整
            return(
                <Item key={index} >
                    队员：{index+1}
                    <Row  type="flex" justify="center">
                        <Col span={10}>
                            <span>姓名</span>
                        </Col>
                        <Col span={14}>
                            <span>{item.playername}</span>
                        </Col>
                        <Col span={10}>
                            <span>赛事证号</span>       
                        </Col>
                        <Col span={14}>
                            <span>{item.id}</span>
                        </Col>
                        <Col span={10}>
                            <span>级别</span>
                        </Col>
                        <Col span={14}>
                            <span>大师级</span>
                        </Col>
                    </Row>  
                </Item>
            )
        })
        return(
            <div>
                <NavBar
                mode="light"
                icon={<Icon type="left" />}
                onLeftClick={this.props.toTeamMine}    //返回我的赛队列表
                >赛队【 {teamDetailsData.teamname} 】详情
                </NavBar>
                <WhiteSpace size='xl' />
                <WingBlank>
                    {data}
                </WingBlank>
            </div>
        );
    }
}