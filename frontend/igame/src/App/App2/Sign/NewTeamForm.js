import React from 'react'
import { Form, Input, Select, Button} from 'antd';
import {Toast} from 'antd-mobile'  

import session from '../../User/session'
// import  { GameTeam, Game }  from '../../Models/Models'
import Game from '../../OdooRpc/Game';
import GameTeam from '../../OdooRpc/GameTeam';
// import  Models  from '../../Models/Models'

const FormItem = Form.Item;
const Option = Select.Option;


class FormForSign extends React.Component{
    state={
        eventDetail:this.props.eventDetail,//要报名赛事的全部信息
        myFriends:null,
        userList:null,
        userList2:null,
        mySelf:null,
        teamId:null
    }

// 请求通讯录列表  ★
    componentWillMount(){
        // 每次打开报名页都重新请求
        // const m = Models.create();
        // m.query('exec', 'og.igame','get_users',{},this.stateFriends,this.requestFail,[]);
        const m = new Game(this.stateFriends,this.requestFail);
        m.get_users();
    }
    stateFriends=(res)=>{
        if(res && res.length!==0){
            this.setState({
                myFriends:res,
                userList:res.filter(item => {return item.name !== session.get_name()}),
                userList2:res.filter(item => {return item.name !== session.get_name()}),
                mySelf: res.filter( item => {return item.name === session.get_name()})[0],
            });
        }else{
            Toast.info('没有用户信息，请先添加好友！！', 2);
        }
    }
    requestFail=()=>{
        Toast.fail('查询用户列表失败，请稍后重试！！',1)
    }

// 创建新队伍（不设置人员身份），提交表单
    onSubmit=(e)=>{
        e.preventDefault();
        const newTeamForm = []
        this.props.form.validateFields(
            (err) => {
                if (!err) {
                    this.props.form.getFieldValue('player').map(item=>{return newTeamForm.push(item)})
                    newTeamForm.push(this.props.form.getFieldValue('leader'));
                    newTeamForm.push(this.props.form.getFieldValue('coach'));

                    // const m = Models.create();
                    // m.query('exec', 'og.igame.team','create_team',{},this.newTeamSign,this.createFail,this.props.form.getFieldValue('teamname'),newTeamForm);

                    const m = new GameTeam(this.newTeamSign,this.createFail);
                    m.create_team(this.props.form.getFieldValue('teamname'),newTeamForm);
                }else{
                    Toast.fail('验证失败，请重新填写表单', 2);
                }
            },
        );
    }
    createFail=()=>{
        Toast.fail('创建赛队失败，请稍后重试',1)
    }

// 设置队伍人员身份，提交表单，发送报名请求
    newTeamSign=(res)=>{
        this.setState({
            teamId:res
        })
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

        const m = new Game(this.signEvent,this.registerFail);
        m.register_game(this.state.eventDetail.id,this.state.teamId,teamSign);
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

// 教练 ，值发生改变 ★
    handleCoach = (key)=>{
        this.setState({
            userList2:  this.state.myFriends.filter(item=> { return item.name !== session.get_name() && item.id !== key;})
        })
    }

// 队员 ，值发生改变 ★
    handlePlayer = (key)=>{
        this.setState({
            userList:   this.state.userList.filter((item,index) => { return item.name !== session.get_name() && item.id !== key;})
        })
    }
    handlePlayerDe = (key)=>{
        this.setState({
            userList:   this.state.userList.concat(
                            this.state.userList2.filter((item,index) => { return item.name !== session.get_name() && item.id === key;})
                        )
        })
    }

// 以下为验证表单数据
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
            state.forEach((item,index)=> {
                items.push(
                    <Option key={index} value={item.id} disabled={false}>姓名：{item.name}，赛事证号：{item.id}</Option>
                );
            });
        }

        return items
    }

    render(){
        const {getFieldProps, getFieldDecorator } = this.props.form;

        return(       
            <Form layout="vertical"   onSubmit={this.onSubmit}>
                    <FormItem label="队伍名称" style={{marginBottom:0}}>
                         {getFieldDecorator('teamname', {
                            rules: [
                                { required: true},
                                { validator: this.validateTeamName }
                            ],
                        })(
                            <Input placeholder="填写队伍名称" style={{ width: 290 }}/>
                        )}
                    </FormItem>
                    <FormItem style={{marginBottom:0}}>
                        <span>队伍成员(4-8人)：</span>
                    </FormItem>
                    <FormItem label="领队"  style={{marginBottom:0}} >   
                    <Select placeholder="姓名" notFoundContent="没有用户信息" defaultValue={this.state.mySelf ? this.state.mySelf.id :null } style={{ width: 290 }} {...getFieldProps('leader')}>
                        <Option key={this.state.mySelf ? this.state.mySelf.id :null } value={this.state.mySelf ? this.state.mySelf.id :null} disabled={false}>姓名：{this.state.mySelf ? this.state.mySelf.name :null}，赛事证号：{this.state.mySelf ? this.state.mySelf.id :null}</Option>
                    </Select>  
                </FormItem>
                <FormItem label="教练"  style={{marginBottom:0}}>  
                    {getFieldDecorator('coach', {
                        rules: [{ required: true ,message:'请选择一名教练'}],
                    })( 
                        <Select  placeholder="姓名" notFoundContent="没有用户信息" showSearch={true} style={{ width: 290 }} onSelect={key => this.handleCoach(key)}>
                        {this.items(this.state.userList)}
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
                        <Select mode="multiple" notFoundContent="没有用户信息" placeholder="姓名" showSearch={true} style={{ width: 290 }} onSelect={key => this.handlePlayer(key)} onDeselect={key => this.handlePlayerDe(key)}>
                        {this.items(this.state.userList2)}
                        </Select>  
                    )}
                </FormItem>     
                <FormItem>
                    <Button type="primary" style={{paddingLeft:10, paddingRight:10, marginRight:10}} htmlType="submit">提交</Button>
                    <Button type="danger" style={{paddingLeft:10, paddingRight:10}} onClick={this.cancelSubmit}>取消</Button>
                </FormItem>
                </Form>      
        )
    }
}

const SignForm = Form.create()(FormForSign);

export default SignForm;