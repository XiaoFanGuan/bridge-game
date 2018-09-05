import Models from './OdooRpc';
export default class Channel extends Models {
    constructor(...args){
        super(...args);
        this.model='og.channel';
    }
    /*
    参数： 无
    返回值： {[]}
     */
    join_channel(...data){         //进入频道
        this.exec('join_channel',{},...data);
        /*
         * params:[table_id]
         * return:[
                {channel_id:hcannel_id}
                // 叫的牌，叫牌方位，第n次叫牌
            ]
         */
    }
   
}