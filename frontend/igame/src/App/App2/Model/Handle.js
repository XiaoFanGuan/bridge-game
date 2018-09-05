import { Toast } from 'antd-mobile';
import  Models  from '../../Models/Models'

// model: og.igame , og.igame.team
// methods: search2(查询赛事列表) ,  get_users(查询所有用户) , create_team(创建赛队) , get_own_teams(查询我创建的赛队) , register_game(报名比赛)

class Currency{
    constructor(callback) {
        this.callback = callback; 
        this.word='';
        this.list=null;
    }
    currency = (model,method,data=[])=>{       
        const json={
            'model': model,
            'method': method,
            'args': data,
            'kw': {},
        }
        const cb = (res)=>{
            if (res){
                this.callback ? this.callback(res):null;
                console.log(res)
            }else{
                Toast.fail('操作失败，请重试',1)
                return null;
            }
        }
        const m = Models.create();
        m.query('exec', json, cb);
    }
    // 按关键字搜索比赛
    searchList(list,word,callback){
        this.list = list;
        this.word = word;
        //在list中搜索
        if(!list){
            callback(null);
        }else{
            if(word){
                list = list.filter(item => {
                    return item.name.indexOf(word)!==-1 
                });
                callback(list);
            }else{
                callback(list);
            }
        }
    } 
}


// export {Currency}