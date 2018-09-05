import React from 'react'
import { Form, Select, Button } from 'antd';
// import { Form, Select, Button, Input, Row, Col  } from 'antd';
import {Toast} from 'antd-mobile'  

import session from '../../User/session'
// import  { Game, GameTeam } from '../../Models/Models'
import Game from '../../OdooRpc/Game';
import GameTeam from '../../OdooRpc/GameTeam';

const FormItem = Form.Item;
const Option = Select.Option;

class FormForSign extends React.Component{
    state={
        eventDetail:this.props.eventDetail,//要报名赛事的全部信息
        myTeams:null,
        currentTeam:null,
        currentTeam2:null,
        mySelf:null,
        teamId:null,
        disabled:true
    }

    componentDidMount(){
        // 请求赛队列表 
        const m = new GameTeam(this.stateTeams,this.requestFai);        //说明：传入回调函数
        m.get_own_teams();                                              //说明：调用Models里面定义好的方法
    }
    stateTeams=(res)=>{
        if(res && res.length!==0){
            this.setState({
                myTeams:res,
                currentTeam:res[0].players.filter( item => {return item.playername !== session.get_name()}),
                currentTeam2:res[0].players.filter( item => {return item.playername !== session.get_name()}),
                mySelf: res[0].players.filter( item => {return item.playername === session.get_name()})[0],
                teamId:res[0].id,
                disabled:false
            });
        }else{
            Toast.info('没有赛队信息，请先创建赛队！！', 2);
        }
    }
    requestFail=()=>{
        Toast.fail('查询赛队失败，请稍后重试！！',1)
    }
    
// 提交表单，发送报名请求
    onSubmit=(e)=>{
        e.preventDefault();
        const teamSign = [];
        this.props.form.getFieldValue('player').forEach((item)=>{
            const obj={};
            obj.id=item;
            obj.role='player';
            teamSign.push(obj);
        });
        teamSign.push({id:this.props.form.getFieldValue('leader'),role:'leader'})
        teamSign.push({id:this.props.form.getFieldValue('coach'),role:'coach'})

        // const m = Models.create();
        // m.query('exec', 'og.igame','register_game',{},this.signEvent,this.registerFail,this.state.eventDetail.id,this.state.teamId,teamSign);

        const m = new Game(this.signEvent,this.registerFail);                   //说明：传入回调函数
        m.register_game(this.state.eventDetail.id,this.state.teamId,teamSign);  //说明：调用Models里面定义好的方法，传入相应的参数
    }
    signEvent =(res)=>{
        this.props.setToast();
        Toast.success('报名成功，请到‘我-我的比赛’中查看',1)
    }
    registerFail=()=>{
        Toast.fail('报名失败，请稍后重试！！',1)
    }
    
// 取消报名，返回选择报名方式页面 ★
    cancelSubmit=()=>{
        this.props.cancelSubmit();
    }

// 选择参赛队伍
    handleTeamSelect=(val)=>{
        this.setState({
            currentTeam : this.state.myTeams.filter(item =>{
                return item.id === val
            })[0].players.filter( item => {return item.playername !== session.get_name()}),
            currentTeam2 : this.state.myTeams.filter(item =>{
                return item.id === val
            })[0].players.filter( item => {return item.playername !== session.get_name()}),
            teamId : val
        });
        this.props.form.setFieldsValue({
            leader:null,
            coach:null,
            player:[]
        })
    }

// 教练 ，值发生改变 ★
    handleCoach = (key)=>{
        this.setState({
            currentTeam2:  this.state.myTeams.filter(item =>{
                        return item.id === this.state.teamId
                    })[0].players.filter(item=> {
                            return item.playername !== session.get_name() && item.id !== key;
                        })
        })
    }

// 队员 ，值发生改变 ★
    handlePlayer = (key)=>{
        this.setState({
            currentTeam:   this.state.currentTeam.filter((item,index) => {
                            return item.playername !== session.get_name() && item.id !== key;
                        })
        })
    }
    handlePlayerDe = (key)=>{
        this.setState({
            currentTeam:   this.state.currentTeam.concat(
                            this.state.currentTeam2.filter((item,index) => {
                                return item.playername !== session.get_name() && item.id === key;
                        }))
        })
    }

    validateTeamName = (rule, value, callback) => {
        let pattern=/[A-Za-z0-9_\-\u4e00-\u9fa5]+/;
        if(value){
            if(pattern.test(value) && value.length > 2 && value.length <= 10){
                callback();
              } else {
                callback(new Error('长度为3-10个字符，只能包含中文、数字、字母'));
              }
        }else{
            callback();
        }
    }

    validatePlayer = (rule, value, callback) => {
        if(value){
            if(value.length > 1 && value.length <= 6){
                callback();
              } else {
                callback(new Error('请选择2-6个队员'));
              }
        }else{
            callback();
        }
    }


    items=(state)=>{
        let items = [];
        
		if(!state || state.length === 0 ) {
            return items=[];
        }
        else {
            if(state === this.state.myTeams){
                state.forEach(item => {
                    items.push(
                        <Option key={item.id} value={item.id}>{item.teamname}</Option>
                    );
                });
            }else{
                state.forEach(item => {
                    items.push(
                        <Option key={item.id} value={item.id} disabled={false}>姓名：{item.playername}，赛事证号：{item.id}</Option>
                    );
                });
            }
        }
        return items
    }


    render(){
        const {getFieldProps, getFieldDecorator} = this.props.form;
        // const {getFieldProps, getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        
        return(
            <Form layout="vertical" onSubmit={this.onSubmit}>
                    <FormItem style={{marginBottom:0}} >
                        <span>赛队：</span>
                        <Select placeholder="选择赛队" defaultValue={this.state.myTeams ? this.state.myTeams[0].id : null } notFoundContent="没有赛队信息" style={{ width: 120 }} onChange={key => this.handleTeamSelect(key)}>
                        {this.items(this.state.myTeams)}
                        </Select>
                    </FormItem>
                    <FormItem label="领队"  style={{marginBottom:0}} >   
                        <Select disabled={this.state.disabled} placeholder="姓名" notFoundContent="没有用户信息" defaultValue={this.state.mySelf ? this.state.mySelf.id :null } style={{ width: 290 }} {...getFieldProps('leader')}>
                            <Option key={this.state.mySelf ? this.state.mySelf.id :null } value={this.state.mySelf ? this.state.mySelf.id :null} disabled={false}>{this.state.mySelf ? '姓名：' + this.state.mySelf.playername + '赛事证号：' +  this.state.mySelf.id :'没有用户信息'}</Option>
                        </Select>  
                    </FormItem>
                    <FormItem label="教练"  style={{marginBottom:0}}>  
                        {getFieldDecorator('coach', {
                            rules: [{ required: true ,message:'请选择一名教练'}],
                        })( 
                            <Select  disabled={this.state.disabled}  placeholder="姓名" notFoundContent="没有用户信息" showSearch={true} style={{ width: 290 }} onSelect={key => this.handleCoach(key)}>
                            {this.items(this.state.currentTeam)}
                            </Select>   
                        )} 
                    </FormItem>
                    <FormItem label="队员"  style={{marginBottom:0}}>   
                        {getFieldDecorator('player', {
                            rules: [
                                { required: true},
                                { validator: this.validatePlayer }
                            ],
                        })(
                            <Select  disabled={this.state.disabled} mode="multiple" notFoundContent="没有用户信息" placeholder="姓名" showSearch={true} style={{ width: 290 }} onSelect={key => this.handlePlayer(key)} onDeselect={key => this.handlePlayerDe(key)}>
                            {this.items(this.state.currentTeam2)}
                            </Select>  
                        )}
                    </FormItem>     
                    <FormItem>
                        <Button  disabled={this.state.disabled} type="primary" style={{paddingLeft:10, paddingRight:10, marginRight:10}} htmlType="submit">提交</Button>
                        <Button  disabled={this.state.disabled} type="danger" style={{paddingLeft:10, paddingRight:10}} onClick={this.cancelSubmit}>取消</Button>
                    </FormItem>
                </Form>      
        )
    }
}

const ExistTeamForm = Form.create()(FormForSign);

export default ExistTeamForm;
