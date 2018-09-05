import React from 'react';
import OneCourseResult from './OneCourseResult';
import OneCourseRanking from './OneCourseRanking';
import RankingByScores from './Ranking-scores';
import Datum from './Datum';
import RankingByTeamNumber from './Ranking-teamNumber';
import OneBoard from './OneBoard';
import OneTable from './OneTable';
import OneTeam from './OneTeam';

export default class MatchResult extends React.Component{
    state={
        // match:this.props.match,     //????????
        show:'OneCourseResult',
        thisOneRound:this.props.thisOneRound,
        rounds:this.props.rounds,
        tableNumber:null,
        boardId:null,
        team:null,
        match_ids:null
    }
    setMatchIds=(index)=>{
        this.setState({
            match_ids:index,
        })
    }
    setThisOneRound=(index)=>{
        this.setState({
            thisOneRound:index,
        })
    }
    setTableNumber=(index)=>{
        this.setState({
            tableNumber:index,
        })
    }
    setBoardId=(index)=>{
        this.setState({
            boardId:index,
        })
    }
    setTeam=(index)=>{
        this.setState({
            team:index,
        })
    }
    showPage=(index)=>{
        this.setState({
            show:index,
        })
    }

    render() {
        let page = null;
        switch (this.state.show) {
            case 'OneCourseResult':             //一轮比赛的对阵结果
                page=<OneCourseResult 
                    showPage={this.showPage}
                    toMatchDetails={this.props.toMatchDetails} 
                    match={this.props.match}                //当前比赛
                    thisOneRound={this.state.thisOneRound}  //当前伦次ID和name
                    rounds={this.state.rounds}              //所有轮次基本信息
                    setMatchIds={this.setMatchIds}          //设置对抗的match_id
                    setThisOneRound={this.setThisOneRound}  //设置当前轮次
                    setTableNumber={this.setTableNumber}    //设置桌号
                    setBoardId={this.setBoardId}            //设置牌的ID
                    setTeam={this.setTeam}              //设置队伍ID
                />
                break;
            case 'OneCourseRanking':            //一轮比赛的排名
                page=<OneCourseRanking
                    showPage={this.showPage}
                    toMatchDetails={this.props.toMatchDetails} 
                    match={this.props.match}        
                    thisOneRound={this.state.thisOneRound}
                />
                break;
            case 'Ranking_scores':              //成绩表(按名次)
                page=<RankingByScores
                    showPage={this.showPage}
                    match={this.props.match}        
                    thisOneRound={this.state.thisOneRound}
                />
                break;
            case 'Datum':                       //Datum
                page=<Datum
                    showPage={this.showPage}
                    match={this.props.match}
                    match_ids={this.state.match_ids}        
                    thisOneRound={this.state.thisOneRound}
                />
                break;
            case 'Ranking_teamNumber':          //成绩表(按赛队序号)
                page=<RankingByTeamNumber
                    showPage={this.showPage}
                    match={this.props.match}        
                    thisOneRound={this.state.thisOneRound}
                />
                break;
            case 'OneBoard':                    //一副牌的结果
                page=<OneBoard
                    showPage={this.showPage}
                    match={this.props.match}        
                    thisOneRound={this.state.thisOneRound}
                    boardId={this.state.boardId}
                />
                break;
            case 'OneTable':                    //一桌牌的结果
                page=<OneTable
                    showPage={this.showPage}
                    match={this.props.match}        
                    thisOneRound={this.state.thisOneRound}
                    tableNumber={this.state.tableNumber}
                />
                break;
            case 'OneTeam':                    //一个队伍的成绩
                page=<OneTeam
                    showPage={this.showPage}
                    match={this.props.match}        
                    thisOneRound={this.state.thisOneRound}
                    team={this.state.team}
                />
                break;
            default:
                break;
        }
        return(
            <div>{page}</div>
        );
    }
}