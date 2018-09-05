import React from 'react';
import { Form, Input, Select,  Button} from 'antd';
import { WingBlank, WhiteSpace, Toast, NavBar, Icon } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css'; // 这一句是从哪里引入的？
// import { Game, GameTeam } from '../../../Models/Models';
import Game from '../../../OdooRpc/Game';
import GameTeam from '../../../OdooRpc/GameTeam';

const FormItem = Form.Item;
const Option = Select.Option;

export default class TeamAdd extends React.Component {      //创建赛队页面
    render() {
        return(
            <div>
                <NavBar
                mode="light"
                icon={<Icon type="left" />}
                onLeftClick={this.props.toTeamMine}    //返回我
                rightContent={[
                    <Icon key="0" type="plus-square" 
                    onClick={()=>this.props.toTeamAdd()} 
                    style={{ marginRight: '16px',fontSize:20 }} />,
                  ]}
                >创建赛队
                </NavBar>
                <WhiteSpace size='xl' />
                <WingBlank>
                    <TeamAddForm toTeamMine={this.props.toTeamMine} />
                </WingBlank>
            </div>
        );
    }
}

class BaseForm extends React.Component{
    state={
        player:null
    }
// 请求通讯录列表 
    componentDidMount(){
        // m.query('exec','og.igame','get_users',{},(data)=>{this.setState({player:data})},()=>{},[]);
        const m = new Game((data)=>{this.setState({player:data})},()=>{});
        m.get_users();
    }

// 提交表单，发送创建赛队请求
    onSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFields(
            (err) => {
                if (!err) {
                    let formData = this.props.form.getFieldsValue();
                    const successCallback = ()=>{
                        Toast.success(`队伍：【${formData.teamname}】创建成功`,1);
                        this.props.toTeamMine();
                    }
                    const errorCallback =()=>{
                        Toast.fail('创建失败，请稍后再试！', 1);
                    }
                    const m = new GameTeam(successCallback,errorCallback);
                    m.create_team(formData.teamname,formData.player);
                }else{
                    Toast.fail('您的输入不完整！', 1);
                }
            },
        );
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
    validatePlayerr = (rule, value, callback) => {
        if(value){
            if(value.length > 3 && value.length <= 6){
                callback();
              } else {
                callback(new Error('请选择4-6个队员'));
              }
        }else{
            callback();
        }
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        let items=[];
        if(!this.state.player || this.state.player.length === 0 ) {
            items.push(<Option key={0} value={0} disabled={true}>暂无可以添加的用户</Option>);
        }
        else {
            this.state.player.forEach(item => {
                items.push(
                    <Option key={item.id} value={item.id} disabled={false}>{item.name}</Option>
                );
            });
        }
        return(          
            <Form layout="vertical" onSubmit={this.onSubmit}>
                <FormItem label="队伍名称" style={{marginBottom:0}}>
                        {getFieldDecorator('teamname', {
                        rules: [
                            { required: true},
                            { validator: this.validateTeamName }
                        ],
                    })(
                        <Input placeholder="填写队伍名称" style={{ width: 250 }}/>
                    )}
                </FormItem>
                <FormItem style={{marginBottom:0}}>
                    <span>队伍成员(4-8人)：</span>
                </FormItem>
                <FormItem label="队员"  style={{marginBottom:0}}>   
                    {getFieldDecorator('player', {
                        rules: [
                            { required: true},
                            { validator: this.validatePlayerr }
                        ],
                    })(
                        <Select mode="multiple" placeholder="姓名" showSearch={true} style={{ width: 250 }}>
                            {items}
                        </Select>  
                    )}
                </FormItem>  
                <WhiteSpace size='xl' />
                <FormItem>
                    <Button type="primary"  htmlType="submit">创建赛队</Button>
                </FormItem>
            </Form>      
        )
    }
}
const TeamAddForm = Form.create()(BaseForm);