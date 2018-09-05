import React from 'react';
import 'antd-mobile/dist/antd-mobile.css'; // 这一句是从哪里引入的？
import { TeamAdd, TeamMine } from '../../Loadable';
import TeamDetails from './TeamDetails/Index';

export default class MyTeam extends React.Component {
    state = {
        teamPageState:0,       // 0：默认页(Team列表)，  1：创建队伍页， 2：队伍详情页
        teamDetailsData:null,      //赛队详情数据，由赛队列表页（TeamMine）传回
    }
    toTeamMine = ()=>{         //返回我的赛队列表页
        this.setState({
            teamPageState:0,
        })
    }
    toTeamAdd = ()=>{        //进入创建赛队页
        this.setState({
            teamPageState:1,
        })
    }
    toTeamDetails = (item)=>{        //进入我的赛队详情页
        this.setState({
            teamDetailsData:item,
            teamPageState:2,
        })
    }
    render() {
        let page = null;
        switch (this.state.teamPageState) {
            case 0:     //赛队列表页
                page = <TeamMine 
                    toMine={this.props.toMine}               //回到‘我’页面
                    toTeamAdd={this.toTeamAdd}               //创建赛队
                    toTeamDetails={this.toTeamDetails} />;   //我的赛队详情
                break;
            case 1:     //创建赛队页
                page = <TeamAdd toTeamMine={this.toTeamMine}  />;   
                break;
            case 2:     //赛队详情页
                page = <TeamDetails toTeamMine={this.toTeamMine} 
                        teamDetailsData={this.state.teamDetailsData} />;   //赛队详情数据
                break;
            default:
                
                break;
        }
        return(
            <div>
                {page}
            </div>
        );
    }
}
