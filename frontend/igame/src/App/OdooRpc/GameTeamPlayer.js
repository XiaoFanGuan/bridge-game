import Models from './OdooRpc';

export default class GameTeamPlayer extends Models {
    constructor(...args) {
        super(...args);
        this.model = 'og.igame.team.player';
    }

    get_matches(){  //查询所有自己报名了但未开始的比赛桌号
        this.exec('get_matches', {}, []);
        /*
         * params:[]
         * return:[
                [table_id1,tble_id2,table_id3]
                // 桌号，桌号，桌号
            ]
         */
    }
}
