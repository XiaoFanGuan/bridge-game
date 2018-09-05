import Models from './OdooRpc';
class RoundScore extends Models {
    constructor(...args){
        super(...args);
        this.model='og.ig.team.line';
    }
    // search_round_score(gameId,roundId){       //查询每轮成绩，按桌号排序  已移至game模型
    //     this.exec('search_round_score',{},gameId,roundId);
    //     /**
    //      * params:gameId,courseId(或者叫round_id)
    //      * return:[
    //             {tableId:1, tableNumber:1, 牌的副数：8，赛队:[{主队：海外队},{客队:大陆队}], IMPs:[{主队:10},{客队:9}], VPs:[{主队:10.44},{客队:9.56}]},
    //             {tableId:1, tableNumber:1, 牌的副数：8，赛队:[{主队：海外队},{客队:大陆队}], IMPs:[{主队:10},{客队:9}], VPs:[{主队:10.44},{客队:9.56}]}
    //         ]
    //      * 
    //      */
    // }
    search_round_ranking(gameId,roundId){             //查询每轮排名
        this.exec('search_round_ranking',{},gameId,roundId);
        /**
         * params:gameId,courseId(或者叫roundID)
         * return:[
                {ranking:1, teamName:'海外队',  VPs:20.00,  罚分：0.50},
                {ranking:1, teamName:'海外队',  VPs:20.00,  罚分：0.50}
            ]
         */
    }

}

class TableScore extends Models {
    constructor(...args){
        super(...args);
        this.model='og.ig.natch';
    }
    search_table_score(gameId,courseId,tableId){       //查询每桌成绩
        this.exec('search_round_score',{},gameId,courseId,tableId);
        /**
         * params:gameId,courseId(或者叫roundID),tableId
         * return:
                    [team:[主队队名，客队队名] 
                    player:[[e:张三：s:李四 w:王五C n:孙刘],[e:张三：s:李四 w:王五C n:孙刘]]
                    score:[IMPs:[主队本轮IMPs总得分,客队本轮IMPs总得分],VPs:[主队本轮VPs总得分,客队本轮VPs总得分]]
                    data:[{ 牌号：1，  明细 ：[开：[庄家，定约，结果，NS,EW]，闭：[庄家，定约，结果，NS,EW]],   得分：[主队得分，客队得分] },
                            { 牌号：2，  明细 ：[开：[庄家，定约，结果，NS,EW]，闭：[庄家，定约，结果，NS,EW]],   得分：[主队得分，客队得分] }]]
         * 
         */
    }

}


export { RoundScore, TableScore }