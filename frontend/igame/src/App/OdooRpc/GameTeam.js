import Models from './OdooRpc';

export default class GameTeam extends Models {
    constructor(...args) {
        super(...args);
        this.model = 'og.igame.team';
    }
    get_teams() {            //获取我所在赛队列表，查看我的队伍时用
        this.exec('get_teams', {}, []);
    }
    create_team(...data) {   //创建赛队（报名）
        this.exec('create_team', {}, ...data);
    }
    get_own_teams() {        //请求我所创建的赛队列表，比赛报名时用
        this.exec('get_own_teams', {}, []);
    }

    search_game_player(gameId) {   //请求比赛的参赛队
        const obj = this.with_model('og.igame');
        obj.exec('search_game_player', {}, gameId);
        /**
         * params:gameId
         * return:
         * [
            {number:'12',
            ranking:'2',
            name:'白鲨1队',
            member:[{id:1,name:'蒋周伟',others:'56%'},{id:1,name:'蒋周伟',others:'56%'},
                    {id:1,name:'蒋周伟',others:'56%'},{id:1,name:'蒋周伟',others:'56%'},],
            pay:true},
            {number:'25',
            ranking:'3',
            name:'白鲨2队',
            member:[{id:1,name:'张三',others:'56%'},{id:1,name:'李四',others:'56%'},
                    {id:1,name:'李四',others:'56%'},{id:1,name:'李四',others:'56%'},],
            pay:false},
        ]
        ---说明--- 尚未开始的比赛，编号和名次没有值    number：赛队编号，ranking：名次，pay：是否交费 
        *         
        */


    }
    search_combat_team(gameId, teamId) {       //查询某个队伍在某个比赛的对阵方和得分
        this.exec('search_combat_team', {}, gameId, teamId);
        /**
         * params:gameId
         * return:
         */
    }

    // search_round_score(igame_id,team_id,round_id){       //？？？？？？？？？？？
    //     const obj = this.with_model('og.igame.team.line');
    //     obj.exec('search_round_score',{},igame_id,team_id,round_id);
    // }
}
