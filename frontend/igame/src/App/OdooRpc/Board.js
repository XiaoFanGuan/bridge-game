import Models from './OdooRpc';
export default class Board extends Models {
    constructor(...args){
        super(...args);
        this.model='og.board';
    }
    /*
    参数： 无
    返回值： {[]}
     */
    init_board(...data){  //初始化牌桌
        this.exec('init_board',{},...data);
        /*
         * params:[board_id,channel_id]
         * return:[
         *      cards:"AQ93.T9632.T7.73 6.K7.K984.AQJ964 K42.AQ5.AJ3.KT85 JT875.J84.Q652.2",
         *      dealer:'E',
         *      players:[["111 1111 1111", "S", 7],
         *              ["222 2222 2222", "N", 8],
         *              ["333 3333 3333", "E", 9],
         *              ["444 4444 4444", "W", 10]],
         *      vulnerable:"NS"
         * ]
         */
    }
    bid(...data){         //发送叫牌信息
        this.exec('bid',{},...data);
        /*
         * params:[board_id,pos,call,channel_id]
         * return:[
                {board_id: 44, number: 1, name: '1S', pos: 'S'}
                // 牌号，叫牌顺序，叫的牌，叫牌方位
            ]
         */
    }
    call_result(...data){    //查询叫牌结果
        this.exec('call_result',{},...data);
        /*
         * params:[board_id,channel_id]
         * return:[
                {dummy:'N',openlead:'W',declarer:'S',nextplayer:'W',contract:'1S'}
                // 明手，首攻，庄家，下一个出牌方，定约
            ]
         */
    }
    play(...data){       //发送打牌消息
        this.exec('play',{},...data);
        /*
         * params:[board_id,pos,card]
         * return:[
                {ns_win:0,number:1,rank:'5',pos:'W',suit:'C',nextplayer:'W',card:'C5',ew_win:0}
                //南北赢墩，出牌顺序，出牌点，出牌方位，出牌花色，下一个出牌方，出的牌，东西赢墩
            ]
         */
    }
    sendplay(...data){
        this.exec('sendplay',{},...data);
    }
    
    board_points(...data){    //一副牌的成绩
        this.exec('board_points',{},...data);
         /*
         * params:[board_id]
         * return:[
                {result:[N 1D +3],ns_points:6,ew_points:7}
                //结果[庄家，定约，赢墩],南北得分，东西得分
            ]
         */
    }
    table_points(...data){   //8副牌打完后的总成绩
        this.exec('table_points',{},...data);
        /*
         * params:[table_id]
         * return:[
            //8副牌的成绩及每副牌的牌型，叫牌信息和打牌信息
        ]
         */
    }

    claim1(...data){   //庄家发送claim消息
        this.exec('claim1',{},...data);
        /*
         * params:[board_id,pos,num,channel_id]
         * return:[
                 {pos:'W', num:3, board:['SQ','ST']}
                 //claim方位，claim墩数,claim方的牌
            ]
         */
    }

    claim(...data){   //claim
        this.exec('claim',{},...data);
        /*
         * params:[board_id,pos,channel_id]
         * return:[
                 
            ]
         */
    }
 
    send_message(...data){   //直接向频道发送消息
        this.exec('send_message',{},...data);
         /*
         * params:[channel_id,msg]
         * return:[
                {msg}
            ]
         */
    }

    call_ready(...data){    //准备状态
        this.exec('call_ready',{},...data);
    }

    claiming(...data){
        this.exec('claiming',{},...data);
    }

    ask_claim(...data){
        this.exec('ask_claim',{},...data);
    }
   
}