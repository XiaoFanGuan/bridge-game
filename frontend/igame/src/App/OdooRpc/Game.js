import Models from './OdooRpc';
export default class Game extends Models {
    constructor(...args) {
        super(...args);
        this.model = 'og.igame';
    }
    /*
    参数： 无
    返回值： {[]}
     */
    get_users() {                    //获取所有用户
        this.exec('get_users', {}, []);
    }
    /*
     */
    register_game(...data) {         //赛队报名
        this.exec('register_game', {}, ...data);
    }
    search2() {                      //查找所有比赛，这个方法现在没有用到
        this.exec('search2', {}, []);
    }
    search_user_match() {            //查找所有比赛，辨别用户是否参与此比赛
        this.exec('search_user_match', {}, []);
    }
    search_own_match() {             //根据用户ID查找用户参与的所有比赛
        this.exec('search_own_match', {}, []);
    }

    search_rounds_details(gameId) {         //根据gameID查轮次详细信息
        this.exec('search_rounds_details', {}, gameId);
        /**
         * params:gameId
         * return:
                [{id:1, start_time:'2018-07-07 10:00:00', over_time:'2018-07-07 11:00:00', name:'G1', number:1},
                {id:2, start_time:'2018-07-07 11:15:00', over_time:'2018-07-07 12:15:00', name:'G1', number:2}]
         * 
         */
    }
    search_round_details(gameId, roundId) {       //查询每轮成绩，按桌号排序
        this.exec('search_round_details', {}, gameId, roundId)
        /**
         * params:gameId,roundId
         * return:[
             { 
            namtch_id: 5, 
            round_name: 'GG', 
            deal: 6, 
            close_id: 2,
            open_id: 2, 
            number: 5, 
            IMPS: { host_imp: 0.00, guest_imp: 0.00 }, 
            VPS: { host_vp: 10.00, guest_vp: 10.00 }, 
            team: { host_name: "dsae", host_id: 9, guest_name: "j", guest_id: 0 } 
            }  
         ]
         */
    }

    game_score(gameId) {         //整个比赛的成绩表（未排序）
        this.exec('game_score', {}, gameId)
        /**
         * params:gameId
         * return:[]
         */
    }

    round_team_rank(roundId, gameId) {          //某轮比赛的赛队排名
        const obj = this.with_model('og.igame.round');  //模型名
        obj.exec('round_team_rank', {}, roundId, gameId);
        /**
         * params:roundId,gameId
         * return:
        */
    }

    table_result(gameId, roundId, match_id, number) {   //查询某一轮某一桌的成绩
        const obj = this.with_model('og.table');  //模型名
        obj.exec('table_result', {}, gameId, roundId, match_id, number);
        /**
         * params:gameId,roundId,match_id,number
         * return:
        */
    }

    search_round_table_score(gameId, roundId, match_id, number) {   //查询某一轮某一桌的成绩
        const obj = this.with_model('og.igame.team.line');  //模型名
        obj.exec('search_round_table_score', {}, gameId, roundId, match_id);
        /**
         * params:gameId,roundId,match_id
         * return:
        */
    }
    round_deal_info(game_id, round_id, deal_id) {
        //查询第几副牌
        const obj = this.with_model('og.igame.round');  //模型名
        obj.exec('round_deal_info', {}, game_id, round_id, deal_id);
        /**
        * params:game_id,round_id,deal_id(牌ID))
        * return:
       */
    }
    search_game_score(game_id) {
        //查询第几副牌
        const obj = this.with_model('og.igame');  //模型名
        obj.exec('search_game_score', {}, game_id);
        /**
        * params:game_id,round_id,deal_id(牌ID))
        * return:
       */
    }




}