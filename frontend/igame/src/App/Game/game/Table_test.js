import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Card from './Card'
import BidPanel from './BidPanel'
import Clock from './Clock'
import {Imps,Seats,Tricks} from './Headers'
import Prepare from './Prepare'
import Debug from './Debug'
import Claim from './Claim'
import  session from '../../User/session'
import './Table.css'
import Models from '../Models/model'
import Sound from './Sound'
import pureFunc from '../Models/pureFunc'
import {Toast} from 'antd-mobile'

const False = 'False'

/**
 * Game  是一局比赛，涉及到了比赛者，以及和比赛相关的其他信息。重点在于比赛。
 * Table 是一桌游戏的界面：重点在于 一桌
 */
class Table extends Component {
    state = {
        cards: null, // 考虑这里不用 cards 只用必要的数字 ,方位按照Table.seats
        scene: 0,    // 0 准备阶段 1 叫牌阶段 2 出牌阶段 3 claim 等待，4 claim 确认
        calldata:[],
        bidCard: null,
        user: { east: null, south: null, west: null, north: null },
        // ready:null,
        ready:{east: null, south: null, west: null, north: null ,next_board:0},
        userdir:[],
        contract:null,
        declarer:null,
        ns_win:null,
        ew_win:null,
        lastTrick:false,
        debug: false,
        online:true,
        lastState:null,
        playCardNumber: 0,
        nextplayer:null,
        claiming:0,
        claimnum:{pos:null, num:0},
        claimingState:[],
        toResult:false
    }
    /**
     * 重构参考： 打牌的几个阶段，应该在规则里面，调入进来。
     * 属性列表：
     *  scene:  0 准备阶段 1 叫牌阶段 2 出牌阶段 3 claim 等待，4 claim 确认
     *  deals: 牌，除了自己的牌，其他人的牌应该不显示
     *  seat：ESWN 自己做在那个方位。
     *  csize: 牌的大小 手机 80像素比较合适。
     *  board：桌面上打出来的四张牌。用于清理桌面。
     */
    constructor(props) {
        super(props);
        this.width = window.screen.width;
        this.height = window.screen.height;
        this.css = {
            table: {
                width: this.width,
                height: this.height,
                //fontSize:this.width * 0.03 + 'px'
            },
            panel: {
                top: this.width * 0.15,
                // top: this.width * 0.32,
                left: this.width * 0.2,
                width: this.width * 0.6,
                height: this.width * 0.6
            },
            header: {
                width: this.width,
                height: this.width * 0.2,
            },
            body: {
                width: this.width,
                height: this.width,
                // fontSize: this.width * 0.04 + 'px'
            },
            footer: {
                width: this.width,
                height: '40px',
            },
            east: {
                top: this.width * 0.2,
                width: this.width * 0.2,
                height: this.width * 0.6,
            },
            south: {
                width: this.width,
                height: this.width * 0.2,
            },
            west: {
                top: this.width * 0.2,
                width: this.width * 0.2,
                height: this.width * 0.6,
            },
            north: {
                width: this.width,
                height: this.width * 0.2,
            },
            re: {
                width: this.width * 0.19,
                height: this.width * 0.19,
            },
            board: {
                width: this.width * 0.6,
                height: this.width * 0.6,
                top: this.width * 0.2,
                left: this.width * 0.2,
            },
            result: {
                width: this.width * 0.6,
                height: this.width * 0.2,
                top: this.width * 0.6,
                left: this.width * 0.2,
                zIndex:1000,
                textAlign:'center',
                fontSize:this.width * 0.06 + 'px',
            }
        }
        this.table_id_list =null;
        this.table_id = null;
        this.board_id_list = null;  //牌号列表
        this.board_id = null;   //当前牌号
        this.channel_id = null;     //公共频道号
        this.my_channel_id =null;   //私有频道号
		this.pollingId = 1;     //消息ID
        this.callResult = 0;    //叫牌时，对'Pass'进行计数，判断是否叫牌结束
        this.dealer = null;     //发牌人
        
        this.dummyCards = null;
        this.dummySeat = null;
        // this.claimnum = 0;      //claim的墩数、方位、庄家剩余的牌
        this.agreeClaim = 0;    //claim时，对防守方是否同意claim计数
        this.claimtrick = 13;    //可claim的数目
        this.playSuit = null;
        this.originData = null; //初始化牌桌时的所有数据
        this.board = []; // 桌面上的四张牌
        this.lastTrickCard = null    //上墩牌
        this.lastTrickPos = [];  //上墩牌的方位
        this.cards = [];  //原始牌
        
        this.zindex = 10;
        this.center = null; // 桌子的中心 {x,y}
        this._csize = null; // 牌的大小
        this.deals = 'XXX.XX.XXXX.XXXX QJ98.A5.J853.QT4 XXX.XX.XXXX.XXXX XXX.XX.XXXX.XXXX'
        this.myseat = 'S'               // 用户坐在 南
        this.seat = {
            'east': [{ x: 0, y: 0 }, { x: 0, y: 0 }],  // seat 用于记录坐标 
            'south': [{ x: 0, y: 0 }, { x: 0, y: 0 }], // 第一个xy 是 四个区域左上角坐标
            'west': [{ x: 0, y: 0 }, { x: 0, y: 0 }],  // 第二个xy 是 出牌4个区域坐标。
            'north': [{ x: 0, y: 0 }, { x: 0, y: 0 }]   // 也就是牌出到什么地方。
        }
        // ref 用来记录 四个发牌位置的div引用
        this.ref = {};
        for (let key in this.seat) this.ref[key] = React.createRef()
        this.ref.board = React.createRef();
        this.state.cards = this.initCards() // 把以上牌初始化放到桌子上(不发牌)
        this.TableFunc = new pureFunc(this)
    }
    /* 通过计算获得 Card 的 size */
    get csize() {
        // 短路语法 牌的大小 可以计算在下面的函数内。
        return this._csize || (() => {
            return this.width * 0.18;
        })()
    }

    /* 完成挂载后，要计算 各个位置的坐标。 */
    componentDidMount() {
        this._initSeat();
        this.props.setHiddenState(true)
        // Models.get_matches(this.sucGetMatch,this.failGetMatch)  //查询桌号
    }

    sucGetMatch=(data)=>{   //查询到所有未开始的table_id
        console.log(data)   
        if(data.length){
            this.table_id_list = data;
            this.table_id = data[0];
            Models.join_channel(this.sucChannel,this.failChannel,this.table_id);    //根据桌号进入频道
            this._initSeat();   // 初始化 发牌位置 出牌位置等坐标
        }else{
            //提示：未查询到待开始的比赛
            Toast.info('您当前没有比赛，请稍后再试',2)
        }
    }

    sucChannel=(data)=>{    //查询公共频道号,board_id,私有频道号,  [2, Array(8), 5]
        const boardData = data.slice(-3);
        if(data.length===4){ 
            this.setState({lastState:data[0]});
            if(data[0]==='All Done'){
                Toast.info('您当前没有比赛，请稍后再试',2)
            }else if(data[0]['current_board']){
                // this.setBoardId(boardData,data[0]['current_board'])
                this.TableFunc.setBoardId(boardData,data[0]['current_board'])
            }else{
                // this.setBoardId(boardData)
                this.TableFunc.setBoardId(boardData)
            }
        }
    }
    
    // setBoardId=(data,board_id)=>{
    //     this.my_channel_id = data[2];
    //     if(this.board_id_list){
    //         this.channel_id = data[0];
    //         this.board_id = this.board_id_list[this.board_id_list.indexOf(this.board_id)+1];
    //     }else{
    //         this.board_id_list = data[1];
    //         this.channel_id = data[0];
    //         this.board_id = board_id||data[1][0];
    //     }
    //     Models.init_board(this.sucInit,this.failInit,this.board_id,this.channel_id);    //初始化牌桌
    // }

    sucInit=(data)=>{
        console.log(data)
    // [cards:"AQ93.T9632.T7.73 6.K7.K984.AQJ964 K42.AQ5.AJ3.KT85 JT875.J84.Q652.2",dealer:'E',players:[["111 1111 1111", "S", 7],["222 2222 2222", "N", 8],["333 3333 3333", "E", 9],["444 4444 4444", "W", 10]],vulnerable:"NS"]
        this.originData = data; 
        data.players.map(item=>{    //存储‘我’的方位
            if(item[0]===session.get_name()){
                return this.myseat = item[1]
            }
		})
        this.setState({     //north, east, south, west 即界面中看到的“上，下，左，右”，根据此方位存储每个方位对应的牌手名称
            user:{
                east: data.players.filter(item=>{if(item[1]==='E')return item})[0][0], 
                south: data.players.filter(item=>{if(item[1]==='S')return item})[0][0], 
                west: data.players.filter(item=>{if(item[1]==='W')return item})[0][0], 
                north: data.players.filter(item=>{if(item[1]==='N')return item})[0][0]
            }
        });
        this.TableFunc.transfer(this.myseat);  //根据我的方位，计算界面中“上下左右”对应的实际方位
        console.log(this.state.lastState)
        // if(this.state.lastState){
        //     this.re_init();
        // }else{
        //     console.log('￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥')
        //     this.splitCards(this.originData); 
        // } 
        // Models.polling(this.sucPolling,this.failPolling,this.pollingId); 
    }

    // sucPolling=(data)=>{
    //     console.log(data)
    //     if(data.length && data.slice(-1)[0]['id']!==this.pollingId && data[data.length-1].message.body.indexOf('data-oe-id')===-1){
    //         //准备遍历消息
    //         this.dealMsg(data);
    //     }
    //     if(!this.state.toResult){
    //         Models.polling(this.sucPolling,this.failPolling,this.pollingId)
    //     }
    // }
    // failPolling=()=>{console.log('fail polling')}

    // dealMsg = (data) =>{
    //         this.pollingId=data.slice(-1)[0]['id']
    //         console.log(this.pollingId)
    //         let body = data[data.length-1].message.body;    //"<p>{'board_id': 44, 'number': 1, 'name': u'1S', 'pos': u'S'}</p>"
    //         console.log(body.substring(3,body.length-4))
    //         if(body.substring(3,body.length-4)==='all ready'){
    //         // if(this.state.lastState&&(this.state.lastState.state==='start playing'||this.state.lastState.state==='calling ready')&&body.substring(3,body.length-4)==='all ready'){
    //             console.log(this.originData)
    //             console.log('all readyall readyall readyall readyall ready')
    //             this.splitCards(this.originData)
    //         }else if(body.substring(3,body.length-4)==='claim agreed'){
    //                 this.setState({scene:2});
    //                 this.addChatMsg('系统消息','庄家claim成功，正在为您计算本副牌成绩...')
    //                 Models.claim(this.sucClaim,this.failClaim,this.board_id,this.state.claimnum.pos,this.channel_id);
    //         }else{
    //             body = body.replace(/u'/g,"'").replace(/ /g,'')
    //             body = eval('('+body.substring(3,body.length-4)+')')
    //         }
    //         console.log(body);
    //         // if(body.cards&&body.players&&body.dealer&&body.vulnerable){
    //         //     this.originData = body
    //         // }
    //         if(body.pos&&body.send_msg){         //收到聊天消息  {pos:'W',send_msg:'msg'}
    //             this.addChatMsg(body.pos,body.send_msg)
    //         }
    //         if(body.board_id&&body.name&&body.pos&&body.number){  //收到叫牌消息   {board_id: 44, number: 1, name: '1S', pos: 'S'}
    //             let nextBidder = Table.seats[this.state.userdir.indexOf(body.pos)+1]||Table.seats[this.state.userdir.indexOf(body.pos)-3]
    //             this.timing(nextBidder,10,()=>{})   //提示下一个叫牌人
    //             this.validatePass(body)
    //         }
    //         if(body.dummy&&body.openlead&&body.declarer){   //收到叫牌结果信息   {dummy:'N',openlead:'W',declarer:'S',nextplayer:'W',contract:'1S'}
    //             // this.timing(Table.seats[this.state.userdir.indexOf(body.openlead)],10,()=>{});      //提示下一个出牌人  
    //             ReactDOM.unmountComponentAtNode(document.querySelector('#clock'));
    //             this.setState({
    //                 nextplayer:body.nextplayer
    //             })
    //             this.playRules(body.nextplayer,null,null);      //根据打牌规则提示
    //             this.setState({
    //                 cards:this.state.cards,
    //                 contract:body.contract,
    //                 declarer:body.declarer,
    //                 dummy:body.dummy,
    //                 scene:2
    //             })
    //         }
    //         if(body.number&&body.rank&&body.card&&body.number!==this.state.playCardNumber){    //收到打牌消息 {ns_win:0,number:1,rank:'5',pos:'W',suit:'C',nextplayer:'W',card:'C5',ew_win:0}
    //             this.state.playCardNumber = body.number
    //             // this.setState({lastTrick:false})
    //             if(this.state.lastTrick){this.lastTrick(false)};
    //             this.dummyCards = this.cards[Table.dir.indexOf(this.state.dummy)];       //拿到明手的牌
    //             this.dummySeat = Table.seats[this.state.userdir.indexOf(this.state.dummy)]   //计算明手的方位
    //             if(body.number===1){this.testDummy(this.dummySeat,this.dummyCards)}
    //             if(body.number%4===1){  this.playSuit = body.suit; }
    //             //验证打牌规则，根据打牌规则进行提示
    //             this.playRules(body.nextplayer,this.playSuit,body.number);    
    //             if(body.pos===this.state.declarer){this.claimtrick = this.claimtrick-1;}       //计算当前庄家可claim的墩数
    //             // this.timing(Table.seats[this.state.userdir.indexOf(body.nextplayer)],10,()=>{});        //提示下一个出牌人  
    //             const card = body.card.split('')[1]+body.card.split('')[0]      // 对收到的牌处理成‘5C’的格式
    //             console.log(card)
    //             const playSeatCard = this.state.cards[this.state.userdir.indexOf(body.pos)]     //拿到当前出牌人对应的牌，应为XXXXXXXXXXXXX
    //             console.log(playSeatCard)
    //             let last = 0
    //             playSeatCard.map(item=>{
    //                 if(item.card.split('')[0]==='X'&&last===0&&item['animation']['left']!==this.width / 2){  //保证只从未出的牌中设置
    //                     last=1
    //                     item.card = card
    //                     console.log('last:   '+last)
    //                 }
    //             })
    //             console.log(playSeatCard)
                
    //             playSeatCard.map((item1,index1)=>{      //动画，将当前出牌人出的牌放到board中，即表现为出牌
    //                 if(item1.card===card){
    //                     console.log(item1)
    //                     this.lastTrickPos.push(body.pos)
    //                     this.board.push(item1);
    //                     console.log(this.board)
    //                     console.log(this.lastTrickPos)
    //                     item1['animation']['left'] = this.seat[item1.seat][1].x;
    //                     item1['animation']['top'] = this.seat[item1.seat][1].y;
    //                     item1['animation']['delay'] = 0;
    //                     item1['zIndex'] = this.zindex++
    //                 }
    //                 Sound.play('play');
    //             }) 

    //             let index = this.state.userdir.indexOf(body.pos)
    //             let seat = Table.seats[index]
    //             let rotate = 0
    //             const offset = this.csize * 0.7 / 2
    //             let [x, y] = [this.seat[seat][0].x, this.seat[seat][0].y]
    //             x = x + this.width / 16 /5; y = y + this.width / 16 /5; // margin
    //             if ('02'.indexOf(index) !== -1) rotate = -90;
                
    //             playSeatCard.map(item=>{
    //                 if(item['animation']['left']!==this.width / 2 && item['animation']['top'] !== this.seat[item.seat][1].y){  //保证只从未出的牌中设置
    //                     item.animation = {
    //                         top: y,
    //                         left: x,
    //                         delay: (item.key % 13) * 80,
    //                         duration: 300,
    //                         rotate: rotate,
    //                         transformOrigin: `${offset}px ${offset}px`
    //                     }
    //                     item.active = 2; 
    //                     item.onclick =  () => false;
    //                     if ('02'.indexOf(index) !== -1) y = y + this.csize * 0.15;
    //                     else x = x + this.csize * 0.39;
    //                 }
    //             })

    //             this.setState({
    //                 cards: this.state.cards,
    //                 ew_win:body.ew_win,
    //                 ns_win:body.ns_win,
    //             })
    //             if (this.board.length === 4){    //当board中有4张牌时，清理桌面
    //                 this.lastTrickCard = {pos:this.lastTrickPos,card:this.board};
    //                 // this.setState({lastTrick:false})
    //                 setTimeout(this.clearBoard, 1000)
    //             } 
    //             this.setState({
    //                 nextplayer:body.nextplayer
    //             })
    //             if(body.number===52){   //当52张牌全部出完后，查询当前这幅牌的成绩
    //                 if(this.board_id_list.indexOf(this.board_id)<=this.board_id_list.length-1){
    //                     Models.board_points(this.sucBoardPoints,this.failBoardPoints,this.board_id)
    //                 }
    //             }
    //         }
    //         if(body.pos&&body.num&&body.board){   //收到庄家claim消息  {pos:'W', num:3, board:['SQ','ST']}
    //             console.log(body)
    //             // this.claimnum = body
    //             this.setState({claimnum:body})
    //             if(this.myseat!==body.pos){
    //                 //展示庄家的牌
    //                 let claimCard = this.state.cards[this.state.userdir.indexOf(body.pos)].splice(13-body.board.length,body.board.length);  
    //                 claimCard.map((item1,index1)=>{
    //                     item1.card = body.board[index1].split('')[1]+body.board[index1].split('')[0];
    //                     this.state.cards[this.state.userdir.indexOf(body.pos)].push(item1)
    //                 })
    //                 this.setState({
    //                     scene:3,
    //                     cards: this.state.cards,
    //                 });
    //             } 
    //         }
    //         if(body.pos&&body.agreeClaim){   //收到防守方是否同意
    //             const agreeClaimPos = Table.dirAll[Table.dir.indexOf(body.pos)]
    //             if(body.agreeClaim==='false'){  //当有防守方拒绝claim时，继续打牌过程
    //                 this.addChatMsg('系统消息',this.state.user[agreeClaimPos]+' 拒绝庄家的claim请求，请继续打牌')
    //                 this.setState({scene:2, claimnum:{pos:null, num:0}, claiming:0, claimingState:[]});
    //                 this.playRules(this.state.nextplayer,this.playSuit,null);
    //             }
    //             else if(body.agreeClaim==='true'){
    //                 this.state.claimingState.push(body.pos)
    //                 this.setState({claimingState:this.state.claimingState})
    //                 this.addChatMsg('系统消息',this.state.user[agreeClaimPos]+' 同意了庄家的claim请求')
    //             }
    //         }
            
    //         if(body.pos&&body.state==='ready'){
    //             const readyState=this.state.ready
    //             const seat = Table.seats[this.state.userdir.indexOf(body.pos)]
    //             this.state.ready[seat]='R'
    //             if(body.next_board){this.state.ready['next_board']+=1}
    //             this.setState({ready:this.state.ready})
    //             console.log(this.state.ready)
    //         }
    // }

    // bidCall=(card)=>{   //牌手的叫牌事件，发送叫牌消息
    //     console.log(card)
    //     Models.bid(this.sucBid,this.failBid,this.board_id,this.myseat,card,this.channel_id);
    // }
    // sucBid=(data)=>{console.log(data)}
    // failBid=(data)=>{console.log(data)}

    // //查询叫牌结果的回调事件
    // sucCall = (data)=>{console.log(data)} 
    // failCall=()=>{console.log('fail call')}

    // /** 出牌 * 从这里可以看出 item 确实是引用。非常方便。 */
    // // 为避免出牌后收到的出牌消息提示错误的问题，采用先发送出牌消息，再查询出牌结果的方式
    // play = (item) => {      //牌手的出牌事件，发送出牌消息
    //     return () => {
    //         if (this.board.length === 4)return false;
    //         const card = item.card.split('')[1]+item.card.split('')[0];
    //         Models.play(this.sucPlay,this.failPlay,this.board_id,this.myseat,card);   //发送出牌消息
    //     }
    // }
    // sucPlay=(data)=>{
    //     Models.sendplay(this.sucSearchPlay,this.failSearchPlay, this.board_id, data, this.channel_id);  //查询出牌结果
    // }
    // failPlay=()=>{console.log('fail play')}

    // sucSearchPlay=(data)=>{console.log(data)}
    // failSearchPlay=()=>{}

    // sucBoardPoints=(data)=>{    //查询当前牌成绩的成功回调，调取展示成绩模块进行展示
    //     this.showResult(data);
    // }
    // failBoardPoints=()=>{console.log('fail Board points')}
    //   /*
    //     考虑增加参数为 seat
    // */
    // claim = () =>{  //庄家点击“摊牌”事件
    //     this.setState({ scene:3 })
    //     console.log(this.state.playCardNumber)
    //     console.log(this.state.playCardNumber===0)
    // }
    // handleClaim = (data) =>{    //庄家发送claim消息
    //     console.log(data)
    //     if(data){
    //         Models.claim1(this.sucClaim1,this.failClaim1,this.board_id,this.myseat,data,this.channel_id);
    //         Models.claiming(this.sucClaiming,this.failClaiming,this.board_id,'C',data);
    //     }
    // }
    // sucClaim1=(data)=>{ console.log(data) }
    // failClaim1=()=>{console.log('fail claim')}
    // sucClaiming=(data)=>{ console.log(data) }
    // failClaiming=()=>{console.log('fail claiming')}

    // cancelClaim = (data)=>{     //庄家取消claim事件，继续打牌
    //     this.setState({ scene:2 })
    //     Models.claiming(this.sucClaiming,this.failClaiming,this.board_id,'N',data);
    // }
    // handleClaimMsg = (data) =>{     //收到防守对庄家claim 的同意或拒绝消息
    //     const msg={
    //         pos:this.myseat,
    //         agreeClaim:data.toString()
    //     }
    //     Models.send_message(this.sucSend,this.failSend,this.channel_id,msg);
    //     if(data){
    //         Models.ask_claim(this.sucAskClaim,this.failAskClaim,this.board_id,this.myseat,'C')
    //     }else{
    //         Models.ask_claim(this.sucAskClaim,this.failAskClaim,this.board_id,this.myseat,'N')
    //     }
    // }
    // sucAskClaim=(data)=>{console.log(data)}
    // failAskClaim=()=>{console.log('fail ask_claim')}
 
    // sucClaim=(data)=>{  //当两个防守均同意claim消息后，claim成功的回调函数
    //     Models.board_points(this.sucBoardPoints,this.failBoardPoints,this.board_id);
    // }
    // failClaim=()=>{}

    // handleReady = (se) => {     //收到牌手的准备消息
    //     Models.call_ready(this.sucReady,this.failReady,this.board_id,this.myseat);
    // }

    // sucReady=(data)=>{
    //     const seat = Table.seats[this.state.userdir.indexOf(this.myseat)]
    //     this.state.ready[seat]='R'
    //     this.setState({ready:this.state.ready,nextBoard:false})
    //     const msg = {
    //         pos: this.myseat,
    //         state: 'ready',
    //         next_board:'',
    //     }
    //     Models.send_message(this.sucSend,this.failSend,this.channel_id,msg);
    // }
    // failReady=(data)=>{console.log(data)}

   
    /**
    * _initSeat 初始化 发牌位置 出牌位置的坐标。 
    * center   桌子的中心
    *          以body 为父元素计算。
    * offset   是四张牌叠放需要错开的空间。（长 - 宽）/ 2
    * this.seat[key][0] 四个座位发牌坐标xy
    * this.seat[key][1] 四个作为出牌坐标xy
    *          出牌坐标计算依据：1）扑克牌的中心点和左上角位置差固定。
    *          因此可以以中心点考虑四个方位的位移 再加减相同的 位置差即可。
    *          注：0.7 是扑克的横竖比例。
    */
    _initSeat() {
        const center = { x: 0, y: 0 };
        center.x = this.ref.board.current.offsetTop +
            parseInt(this.ref.board.current.style.height.slice(0, -2)) / 2
        center.y = this.ref.board.current.offsetLeft +
            parseInt(this.ref.board.current.style.width.slice(0, -2)) / 2
        this.center = center;
        const offset = this.csize * 0.7 / 2
        for (let key in this.seat) {
            this.seat[key][0]['y'] = this.ref[key].current.offsetTop;
            this.seat[key][0]['x'] = this.ref[key].current.offsetLeft;
            if (key === 'east') {
                this.seat[key][0]['y'] = this.seat[key][0]['y'] + this.width * 0.06
                // 下面是处理　牌的叠放顺序　联合参考：dealCards
                //this.seat[key][0]['y'] = this.seat[key][0]['y'] + this.width * 0.4
                this.seat[key][1]['y'] = center.y - offset
                this.seat[key][1]['x'] = center.x - offset
            } else if (key === 'south') {
                this.seat[key][0]['x'] = this.seat[key][0]['x'] //+ this.width * 0.21
                //this.seat[key][1]['y'] = center.y + offset - this.csize / 2;
                this.seat[key][1]['y'] = center.y - offset
                this.seat[key][1]['x'] = center.x - this.csize * 0.7 / 2;
            } else if (key === 'west') {
                this.seat[key][0]['y'] = this.seat[key][0]['y'] + this.width * 0.06
                this.seat[key][1]['y'] = center.y - offset
                this.seat[key][1]['x'] = center.x + offset - this.csize;
            } else {
                this.seat[key][0]['x'] = this.seat[key][0]['x'] // + this.width * 0.21
                this.seat[key][1]['y'] = center.y + offset - this.csize;
                this.seat[key][1]['x'] = center.x - this.csize * 0.7 / 2;
            }
        }
    }

    /**
     * initCards 从 this.deals 初始化成 Cards 组件为渲染输出做准备，返回到 this.cards
     * TODO：把一手牌 变成
     */
    initCards() {
        const suits = Card.suits                    //['S', 'H', 'D', 'C'];
        const deals = this.deals.split(' ')
        let index = 0;                              // 复位index 可以让四个人的牌同时发出来
        const cards = [[], [], [], []];             // 初始化二维数组 保存四个方位的牌
        //deals. [XXXXXXXXXXXXX,QJ98.A5.J853.QT4,XXXXXXXXXXXXX,XXXXXXXXXXXXX]
        deals.forEach((item, index1) => {
            const suit = item.split('.')
            suit.forEach((s, index2) => {           // index2 四个花色  s 'QJ98' 牌点字串
                //cards[index1][index2] = [];
                for (var i = 0; i < s.length; i++) {
                    cards[index1].push({
                        onclick: () => false,              // onclick 必须是个函数
                        active: 0,
                        index: index,
                        key: index++,
                        seat: Table.seats[index1],       // 这张牌是那个方位的
                        //table: this,
                        size: this.csize,                // 牌的大小
                        card: s[i] + suits[index2],
                        position: { x: this.width / 2, y: this.width * 2 }     // 考虑一个默认位置。
                    })
                }
            });
        });
        return cards;
    }
    //计算每个人所坐的位置
    _shift(seat) {
        // const offset = Table.seats.indexOf(this.myseat) 
        const offset = Table.dir.indexOf(this.myseat)-1||Table.dir.indexOf(this.myseat)+3
        const index = Table.seats.indexOf(seat)
        return Table.seats[(index + offset) % 4-1]||Table.seats[(index + offset) % 4+3]
    }
    //从未打出去的牌中验证打牌规则  可提出公共部分？？？？？？
    // playRules=(nextplayer,suit,number)=>{   
    //     this.state.cards.map(item=>{
    //         console.log('...........................')
    //         item.map(item1=>{
    //             item1.onclick =  () => false;
    //             item1.active = 2;
    //         })
    //     });
    //     if(nextplayer&&nextplayer!==this.state.dummy&&this.myseat===nextplayer){
    //         console.log('**********************')
    //         let haveSuit = 0;
    //         this.state.cards[1].map((item,index)=>{
    //             if(item['animation']['top']===(this.seat['south'][0]['y']+this.width / 16 / 5)){
    //                 if(suit!==null&&suit!==item.card.split('')[1]){
    //                     item.active=0;
    //                 }else{
    //                     haveSuit+=1;
    //                     item.onclick =  this.play(item);
    //                 }
    //             }
    //             return haveSuit;
    //         }) 
    //         if(haveSuit===0||number%4===0&&number){this.state.cards[1].map(item=>{item.active=2;item.onclick =  this.play(item);})}
    //     }else if(nextplayer===this.state.dummy&&this.myseat===this.state.declarer){
    //         let haveSuit = 0;
    //         this.state.cards[3].map((item,index)=>{
    //             if(item['animation']['top']===(this.seat['north'][0]['y']+this.width / 16 / 5)){
    //                 if(suit!==null&&suit!==item.card.split('')[1]){
    //                     item.active=0;
    //                 }else{
    //                     haveSuit+=1;
    //                     item.onclick =  this.play(item);
    //                 }
    //             }
    //         })  
    //         if(haveSuit===0||number%4===0&&number){this.state.cards[3].map(item=>{item.active=2;item.onclick =  this.play(item);})}
    //     }
    //     this.setState({cards:this.state.cards})
    // }
 
    // validatePass=(body)=>{
    //     this.call(body.pos,body.name)   //展示叫牌人及叫品
    //     this.setState({
    //         bidCard:body.name,
    //         calldata:this.state.calldata,
    //     });
    //     console.log(this.state.calldata)
    //     body.name==='Pass'?this.callResult ++ : this.callResult = 0;    //计算当前‘Pass’的次数，判断是否叫牌结束
    //     if(this.callResult===3&&body.number!==3&&body.name==='Pass'){
    //         Models.call_result(this.sucCall,this.failCall,this.board_id,this.channel_id);
    //         this.callResult=0
    //     }else if(this.callResult===3&&body.number!==3&&body.name!=='Pass'){
    //         this.callResult=0
    //     }else if(this.callResult===4&&body.number===4){ 
    //         if(this.board_id_list.indexOf(this.board_id)===this.board_id_list.length-1){
    //             this.setState({toResult:true})
    //             this.props.toResult(this.table_id);
    //             console.log('#########################')
    //         }else if(this.board_id_list.indexOf(this.board_id)<this.board_id_list.length-1){
    //             console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
    //             this.state.cards.map(itemSeat=>{
    //                 itemSeat.map(item=>{
    //                     item.position.x = this.width / 2;
    //                     item.position.y = -this.width / 2;
    //                 })
    //             })
    //             this.setState({
    //                 cards:this.state.cards,
    //                 scene: 1,    // 0 准备阶段 1 叫牌阶段 2 出牌阶段 3 claim 等待，4 claim 确认
    //                 calldata:[],
    //                 bidCard: null,
    //                 lastState:null
    //             })
    //             this.state.cards = this.initCards();
    //             this.board_id=this.board_id_list[this.board_id_list.indexOf(this.board_id)+1]
    //             Toast.info('叫牌失败，即将进入下一副牌', 1, Models.init_board(this.sucInit,this.failInit,this.board_id), true);
    //         }
    //         this.callResult=0;
    //     }
    // }

    // addChatMsg=(seat,msg)=>{
    //     const elMsg = document.querySelector('#message')
    //     elMsg.innerHTML = 
    //         "<div>" + seat + ' : ' + msg + "</div>" + elMsg.innerHTML
    // }

    // transfer=(pos)=>{   //根据“我”的方位按照“右，下，左，上”的顺序计算对应的实际方位
    //     if(pos==='N')this.setState({userdir:['W','N','E','S']})
    //     if(pos==='E')this.setState({userdir:['N','E','S','W']})
    //     if(pos==='S')this.setState({userdir:['E','S','W','N',]})
    //     if(pos==='W')this.setState({userdir:['S','W','N','E']})
    // }

    splitCards=(data)=>{
        console.log(data)
        this.cards = data.cards.split(' ');
        this.dealer=data.dealer;
        this.timing(Table.seats[this.state.userdir.indexOf(data.dealer)],10,()=>{console.log('clockclockclockclockclockclock')});
        console.log(Table.seats[this.state.userdir.indexOf(data.dealer)])
        this.deals = 'XXX.XX.XXXX.XXXX '+ data.cards.split(' ')[Table.dir.indexOf(this.myseat)] +' XXX.XX.XXXX.XXXX XXX.XX.XXXX.XXXX';
        this.state.cards = this.initCards()
        this.deal();
        this.setState({scene:1})  
        console.log('*****************')
        console.log(this.state.lastState)
    }

    // re_init=()=>{
    //     //未准备，准备阶段，叫牌阶段，打牌阶段，claim中，claim完成，
    //     const lastState=this.state.lastState;
    //     console.log(lastState);
    //     // 1 叫牌阶段 2 出牌阶段 3 claim 等待，4 claim 确认
    //     ReactDOM.unmountComponentAtNode(document.querySelector('#clock'));
    //     if(lastState.state==='calling ready'||lastState.state==='start playing'){
    //         if(this.myseat==='S'){
    //             this.setState({
    //                 ready: {east: lastState['east_ready'], south: lastState['south_ready'], west: lastState['west_ready'], north: lastState['north_ready'] }
    //             })
    //         }
    //         if(this.myseat==='N'){
    //             this.setState({
    //                 ready: {east: lastState['west_ready'], south: lastState['north_ready'], west: lastState['east_ready'], north: lastState['south_ready'] }
    //             })
    //         }
    //         if(this.myseat==='W'){
    //             this.setState({
    //                 ready: {east: lastState['south_ready'], south:lastState['west_ready'], west:lastState['north_ready'], north: lastState['east_ready'] }
    //             })
    //         }
    //         if(this.myseat==='E'){
    //             this.setState({
    //                 ready: {east:lastState['north_ready'], south: lastState['east_ready'], west: lastState['south_ready'], north: lastState['west_ready'] }
    //             })
    //         }
    //         if(lastState['east_ready']&&lastState['north_ready']&&lastState['south_ready']&&lastState['west_ready']){
    //             console.log('&&&&&&&&&&&&&&&&&')
    //             this.splitCards(this.originData)
    //         }
    //     }

    //     if(lastState.state==='biding'){     //叫牌阶段断线
    //         this.splitCards(this.originData)
    //         if(lastState.bidder){
    //             let nextBidder = Table.seats[this.state.userdir.indexOf(lastState.bidder)]
    //             console.log(nextBidder)
    //             this.timing(nextBidder,10,()=>{});
    //         }
    //         lastState.call_info.map(item=>{     //{board_id: 44, number: 1, name: '1S', pos: 'S'}
    //             let body = {board_id:this.board_id, number:item[0], name:item[2], pos:item[1]}
    //             this.validatePass(body)
    //             this.setState({
    //                 ready:{east:'R',west:'R',north:'R',south:'R'}
    //             });
    //         });
    //     }
    //     if(lastState.state==='playing'){       //打牌阶段断线恢复
            
    //         console.log('in playing')
    //         this.setState({
    //             scene: 2, 
    //             contract:lastState.contract,
    //             declarer:lastState.declarer,
    //             dummy:lastState.dummy,
    //             ns_win:lastState.ns_win,
    //             ew_win:lastState.ew_win,
    //             nextplayer:lastState.player,    //设置下一个出牌人
    //         })

    //         let countClaim = 0;
    //         lastState.unplayed_card.map(item1=>{    //设置可claim的墩数
    //             if(item1[0]===this.state.declarer){
    //                 countClaim += 1;
    //             }
    //         });
    //         this.claimtrick = countClaim;

    //         if(lastState.unplayed_card.length===52){
    //             this.splitCards(this.originData);
    //             ReactDOM.unmountComponentAtNode(document.querySelector('#clock'));
    //             this.setState({scene:2})
    //         }else{
    //             const mycards = [[],[],[],[]];       /*恢复自己的牌 */
    //             let mycardslength = 0;
    //             let addXX = ['X','X','X','X','X','X','X','X','X','X','X','X','X'];
    //             this.state.lastState.unplayed_card.map(item=>{
    //                 if(item[0]===this.myseat){
    //                     addXX.pop();
    //                     mycardslength += 1;
    //                     if(item[1].split('')[0]==='S'){mycards[0]+=item[1].split('')[1]}
    //                     if(item[1].split('')[0]==='H'){mycards[1]+=item[1].split('')[1]}
    //                     if(item[1].split('')[0]==='D'){mycards[2]+=item[1].split('')[1]}
    //                     if(item[1].split('')[0]==='C'){mycards[3]+=item[1].split('')[1]}
                        
    //                 }
    //             })
    //             this.deals = 'XXX.XX.XXXX.XXXX '+ mycards.join('.') + addXX.join('') +' XXX.XX.XXXX.XXXX XXX.XX.XXXX.XXXX';
    //             this.state.cards = this.initCards()
    //             this.deal();
    
    //             /*恢复明手的牌 */
    //             if(lastState.unplayed_card.length!==52){
    //                 this.state.playCardNumber = 52-lastState.unplayed_card.length
    //                 this.dummyCards = this.cards[Table.dir.indexOf(this.state.dummy)];       //拿到明手的牌
    //                 this.testdummyCards=['','','',''];
    //                 this.dummySeat = Table.seats[this.state.userdir.indexOf(this.state.dummy)]
    //                 lastState.unplayed_card.map(item=>{
    //                     if(item[0]===lastState.dummy){
    //                         if(item[1].split('')[0]==='S'){this.testdummyCards[0]+=item[1].split('')[1]}
    //                         if(item[1].split('')[0]==='H'){this.testdummyCards[1]+=item[1].split('')[1]}
    //                         if(item[1].split('')[0]==='D'){this.testdummyCards[2]+=item[1].split('')[1]}
    //                         if(item[1].split('')[0]==='C'){this.testdummyCards[3]+=item[1].split('')[1]}
                            
    //                     }
    //                 });
    //                 this.testDummy(this.dummySeat,this.testdummyCards.join('.'))
    //             }
                
                
    //             if(lastState.board_claim){
    //                 //恢复庄家的牌
    //                 if(lastState.unplayed_card.length!==52){
    //                     const testDeclarerCards=['','','',''];      
    //                     const declarerSeat = Table.seats[this.state.userdir.indexOf(this.state.declarer)]
    //                     lastState.unplayed_card.map(item=>{
    //                         if(item[0]===lastState.declarer){
    //                             if(item[1].split('')[0]==='S'){testDeclarerCards[0]+=item[1].split('')[1]}
    //                             if(item[1].split('')[0]==='H'){testDeclarerCards[1]+=item[1].split('')[1]}
    //                             if(item[1].split('')[0]==='D'){testDeclarerCards[2]+=item[1].split('')[1]}
    //                             if(item[1].split('')[0]==='C'){testDeclarerCards[3]+=item[1].split('')[1]}
                                
    //                         }
    //                     });
    //                     console.log(testDeclarerCards)
    //                     this.testDummy(declarerSeat,testDeclarerCards.join('.'))
    //                 }
    //                 //恢复防守的牌
    //                 const guardSeat = [];
    //                 this.state.userdir.map(item=>{
    //                     if(item!==this.myseat&&item!==this.state.declarer&&item!==this.state.dummy){  guardSeat.push({pos:item,num:13}); }
    //                 });
    //                 guardSeat.map(item=>{
    //                     lastState.unplayed_card.map(item1=>{
    //                         if(item1[0]===item.pos){ item.num--;  }
    //                     });
    //                 });
    //                 this.state.cards.map(item=>{
    //                     guardSeat.map(item1=>{
    //                         item.map(item2=>{
    //                             if(item2.seat===Table.seats[this.state.userdir.indexOf(item1.pos)]){
    //                                 if(item1.num){
    //                                     item2['animation']['left'] = this.width / 2;
    //                                     item2['animation']['top'] = -this.width * 2;
    //                                     item1.num--;
    //                                 }
    //                             }
    //                         });
    //                     });
    //                 });
    //             }else{
    //                 //恢复防守的牌
    //                 const guardSeat = [];
    //                 this.state.userdir.map(item=>{
    //                     if(item!==this.myseat&&item!==this.state.dummy){  guardSeat.push({pos:item,num:13}); }
    //                 });
    //                 guardSeat.map(item=>{
    //                     lastState.unplayed_card.map(item1=>{
    //                         if(item1[0]===item.pos){ item.num--;  }
    //                     });
    //                 });
    //                 this.state.cards.map(item=>{
    //                     guardSeat.map(item1=>{
    //                         item.map(item2=>{
    //                             if(item2.seat===Table.seats[this.state.userdir.indexOf(item1.pos)]){
    //                                 if(item1.num){
    //                                     item2['animation']['left'] = this.width / 2;
    //                                     item2['animation']['top'] = -this.width * 2;
    //                                     item1.num--;
    //                                 }
    //                             }
    //                         });
    //                     });
    //                 });
    //             }
    //             //恢复上一墩
    //             if(lastState.last_trick.length===4&&lastState.current_trick.length!==4){
    //                 lastState.last_trick.map(item=>{
    //                     const card = item[1].split('')[1]+item[1].split('')[0]      // 对收到的牌处理成‘5C’的格式
    //                     const playSeatCard = this.state.cards[this.state.userdir.indexOf(item[0])]
    //                     console.log(playSeatCard)
    //                     let last = 0
    //                     playSeatCard.map(item=>{
    //                         if(item.card.split('')[0]==='X'&&last===0){
    //                             item.card=card
    //                             last=1
    //                         }
    //                     })
    //                     if(playSeatCard[0].card.split('')[0]==='X'){
    //                         playSeatCard[0].card=card
    //                     }
    //                     playSeatCard.map((item1,index1)=>{      //动画，将当前出牌人出的牌放到board中，即表现为出牌
    //                         if(item1.card===card){
    //                             console.log(item[1])
    //                             this.lastTrickPos.push(item[0]);
    //                             this.board.push(item1);
    //                             item1['animation']['left'] = this.width / 2;
    //                             item1['animation']['top'] = -this.width * 2;
    //                             item1['zIndex'] = this.zindex++
    //                             item1['active'] = 3;
    //                         }
    //                         Sound.play('play');
    //                     });
    //                 });
    //                 this.lastTrickCard = {pos:this.lastTrickPos,card:this.board};
    //                 this.lastTrickPos=[];
    //                 this.board=[]
    //             }
    
    //             //恢复当前墩
    //             lastState.current_trick.map(item=>{
    //                 const card = item[2].split('')[1]+item[2].split('')[0]      // 对收到的牌处理成‘5C’的格式
    //                 const playSeatCard = this.state.cards[this.state.userdir.indexOf(item[1])]     //拿到当前出牌人对应的牌，应为XXXXXXXXXXXXX
    //                 console.log(playSeatCard)
    //                 console.log(this.state.cards)
    //                 let last = 0
    //                 playSeatCard.map(item=>{
    //                     if(item.card.split('')[0]==='X'&&last===0){
    //                         item.card=card
    //                         last=1
    //                     }
    //                 })
    //                 playSeatCard.map((item1,index1)=>{      //动画，将当前出牌人出的牌放到board中，即表现为出牌
    //                     if(item1.card===card){
    //                         this.lastTrickPos.push(item[1])
    //                         this.board.push(item1);
    //                         item1['animation']['left'] = this.seat[item1.seat][1].x;
    //                         item1['animation']['top'] = this.seat[item1.seat][1].y;
    //                         item1['animation']['delay'] = 0;
    //                         item1['zIndex'] = this.zindex++
    //                     }
    //                     Sound.play('play');
    //                 });
    //             })
    
    
    //             if(this.board.length===4){
    //                 this.lastTrickCard = {pos:this.lastTrickPos,card:this.board};
    //                 // this.setState({lastTrick:false})
    //                 // this.lastTrick(true)
    //                 setTimeout(this.clearBoard, 300)
    //             }
    
    //             //恢复自己的牌，去掉已出的牌
    //             this.state.cards[this.state.userdir.indexOf(this.myseat)].map(item=>{
    //                 if(item.card.split('')[0]==='X'){
    //                     item['animation']['left'] = this.width / 2;
    //                     item['animation']['top'] = -this.width * 2;
    //                     item['active'] = 3;
    //                 }
    //             })
    //         }
            
    //         /* 恢复验证规则 */
    //         if(lastState.current_trick.length===4||lastState.current_trick.length===0){
    //             this.playRules(this.state.nextplayer,null,null);
    //         }else{
    //             this.playSuit = lastState.current_trick.slice(0,1)[0][2].split('')[0];
    //             this.playRules(this.state.nextplayer,this.playSuit,null);
    //         }
    //     }

    //     if(lastState.state==='claiming'){       //claim阶段断线恢复
    //         console.log('in claiming')
    //         this.setState({
    //             contract:lastState.contract,
    //             declarer:lastState.declarer,
    //             dummy:lastState.dummy,
    //             // lastTrick:false,
    //             ns_win:lastState.ns_win,
    //             ew_win:lastState.ew_win,
    //             nextplayer:lastState.player,    //设置下一个出牌人
    //         });
    //         this.playSuit = lastState.current_trick.slice(0,1)[0][2].split('')[0];
    //         // this.lastTrick(true)
            

    //         let countClaim = 0;
    //         lastState.unplayed_card.map(item1=>{    //设置可claim的墩数
    //             if(item1[0]===this.state.declarer){
    //                 countClaim += 1;
    //             }
    //         });
    //         this.claimtrick = countClaim;

    //         if(lastState.unplayed_card.length===52){
    //             this.splitCards(this.originData);
    //             this.setState({scene:2})
    //         }else{
    //             const mycards = [[],[],[],[]];       /*恢复自己的牌 */
    //             let mycardslength = 0;
    //             let addXX = ['X','X','X','X','X','X','X','X','X','X','X','X','X'];
    //             this.state.lastState.unplayed_card.map(item=>{
    //                 if(item[0]===this.myseat){
    //                     addXX.pop();
    //                     mycardslength += 1;
    //                     if(item[1].split('')[0]==='S'){mycards[0]+=item[1].split('')[1]}
    //                     if(item[1].split('')[0]==='H'){mycards[1]+=item[1].split('')[1]}
    //                     if(item[1].split('')[0]==='D'){mycards[2]+=item[1].split('')[1]}
    //                     if(item[1].split('')[0]==='C'){mycards[3]+=item[1].split('')[1]}
                        
    //                 }
    //             })
    //             this.deals = 'XXX.XX.XXXX.XXXX '+ mycards.join('.') + addXX.join('') +' XXX.XX.XXXX.XXXX XXX.XX.XXXX.XXXX';
    //             this.state.cards = this.initCards()
    //             this.deal();
    
    //             /*恢复明手的牌 */
    //             if(lastState.unplayed_card.length!==52){
    //                 this.state.playCardNumber = 52-lastState.unplayed_card.length
    //                 // this.dummyCards = this.cards[Table.dir.indexOf(this.state.dummy)];       //拿到明手的牌
    //                 this.testdummyCards=['','','',''];
    //                 this.dummySeat = Table.seats[this.state.userdir.indexOf(this.state.dummy)]
    //                 lastState.unplayed_card.map(item=>{
    //                     if(item[0]===lastState.dummy){
    //                         if(item[1].split('')[0]==='S'){this.testdummyCards[0]+=item[1].split('')[1]}
    //                         if(item[1].split('')[0]==='H'){this.testdummyCards[1]+=item[1].split('')[1]}
    //                         if(item[1].split('')[0]==='D'){this.testdummyCards[2]+=item[1].split('')[1]}
    //                         if(item[1].split('')[0]==='C'){this.testdummyCards[3]+=item[1].split('')[1]}
    //                     }
    //                 });
    //                 this.testDummy(this.dummySeat,this.testdummyCards.join('.'))
    //             }

    //             //恢复防守的牌
    //             const guardSeat = [];
    //             this.state.userdir.map(item=>{
    //                 if(item!==this.myseat&&item!==this.state.declarer&&item!==this.state.dummy){  guardSeat.push({pos:item,num:13}); }
    //             });
    //             guardSeat.map(item=>{
    //                 lastState.unplayed_card.map(item1=>{
    //                     if(item1[0]===item.pos){ item.num--;  }
    //                 });
    //             });
    //             this.state.cards.map(item=>{
    //                 guardSeat.map(item1=>{
    //                     item.map(item2=>{
    //                         if(item2.seat===Table.seats[this.state.userdir.indexOf(item1.pos)]){
    //                             if(item1.num){
    //                                 item2['animation']['left'] = this.width / 2;
    //                                 item2['animation']['top'] = -this.width * 2;
    //                                 item1.num--;
    //                             }
    //                         }
    //                     });
    //                 });
    //             });

    //             //恢复庄家的牌
    //             if(lastState.unplayed_card.length!==52){
    //                 const testDeclarerCards=['','','',''];      
    //                 const declarerSeat = Table.seats[this.state.userdir.indexOf(this.state.declarer)]
    //                 lastState.unplayed_card.map(item=>{
    //                     if(item[0]===lastState.declarer){
    //                         if(item[1].split('')[0]==='S'){testDeclarerCards[0]+=item[1].split('')[1]}
    //                         if(item[1].split('')[0]==='H'){testDeclarerCards[1]+=item[1].split('')[1]}
    //                         if(item[1].split('')[0]==='D'){testDeclarerCards[2]+=item[1].split('')[1]}
    //                         if(item[1].split('')[0]==='C'){testDeclarerCards[3]+=item[1].split('')[1]}
                            
    //                     }
    //                 });
    //                 console.log(testDeclarerCards)
    //                 this.testDummy(declarerSeat,testDeclarerCards.join('.'))
    //             }
                
    //             //恢复上一墩
    //             if(lastState.last_trick.length===4&&lastState.current_trick.length!==4){
    //                 lastState.last_trick.map(item=>{
    //                     const card = item[1].split('')[1]+item[1].split('')[0]      // 对收到的牌处理成‘5C’的格式
    //                     const playSeatCard = this.state.cards[this.state.userdir.indexOf(item[0])]
    //                     console.log(playSeatCard)
    //                     let last = 0
    //                     playSeatCard.map(item=>{
    //                         if(item.card.split('')[0]==='X'&&last===0){
    //                             item.card=card
    //                             last=1
    //                         }
    //                     })
    //                     if(playSeatCard[0].card.split('')[0]==='X'){
    //                         playSeatCard[0].card=card
    //                     }
    //                     playSeatCard.map((item1,index1)=>{      //动画，将当前出牌人出的牌放到board中，即表现为出牌
    //                         if(item1.card===card){
    //                             console.log(item[1])
    //                             this.lastTrickPos.push(item[0]);
    //                             this.board.push(item1);
    //                             item1['animation']['left'] = this.width / 2;
    //                             item1['animation']['top'] = -this.width * 2;
    //                             item1['zIndex'] = this.zindex++
    //                             item1['active'] = 3;
    //                         }
    //                         Sound.play('play');
    //                     });
    //                 });
    //                 this.lastTrickCard = {pos:this.lastTrickPos,card:this.board};
    //                 this.lastTrickPos=[];
    //                 this.board=[]
    //             }
    
    //             //恢复当前墩
    //             lastState.current_trick.map(item=>{
    //                 const card = item[2].split('')[1]+item[2].split('')[0]      // 对收到的牌处理成‘5C’的格式
    //                 const playSeatCard = this.state.cards[this.state.userdir.indexOf(item[1])]     //拿到当前出牌人对应的牌，应为XXXXXXXXXXXXX
    //                 console.log(playSeatCard)
    //                 console.log(this.state.cards)
    //                 let last = 0
    //                 playSeatCard.map(item=>{
    //                     if(item.card.split('')[0]==='X'&&last===0){
    //                         item.card=card
    //                         last=1
    //                     }
    //                 })
    //                 playSeatCard.map((item1,index1)=>{      //动画，将当前出牌人出的牌放到board中，即表现为出牌
    //                     if(item1.card===card){
    //                         this.lastTrickPos.push(item[1])
    //                         this.board.push(item1);
    //                         item1['animation']['left'] = this.seat[item1.seat][1].x;
    //                         item1['animation']['top'] = this.seat[item1.seat][1].y;
    //                         item1['animation']['delay'] = 0;
    //                         item1['zIndex'] = this.zindex++
    //                     }
    //                     Sound.play('play');
    //                 });
    //             })
                
             
    
    //             if(this.board.length===4){
    //                 this.lastTrickCard = {pos:this.lastTrickPos,card:this.board};
    //                 // this.setState({lastTrick:false})
    //                 // this.lastTrick(true)
    //                 setTimeout(this.clearBoard, 300)
    //             }
    
    //             //恢复自己的牌，去掉已出的牌
    //             this.state.cards[this.state.userdir.indexOf(this.myseat)].map(item=>{
    //                 if(item.card.split('')[0]==='X'){
    //                     item['animation']['left'] = this.width / 2;
    //                     item['animation']['top'] = -this.width * 2;
    //                     item['active'] = 3;
    //                 }
    //             })

                
    //         }
            
    //         this.setState({scene:3, claiming:1, claimnum:{pos:this.state.declarer, num:lastState.claim_result}})
    //         // this.claimnum = {pos:this.state.declarer, num:lastState.claim_result}
    //         if(lastState.north_claim)this.setState({claimingState:['N']})
    //         if(lastState.south_claim)this.setState({claimingState:['S']})
    //         if(lastState.west_claim)this.setState({claimingState:['W']})
    //         if(lastState.east_claim)this.setState({claimingState:['E']})

    //         this.playRules();
    //         // if(lastState.north_claim||lastState.south_claim||lastState.west_claim||lastState.east_claim){
    //         //     this.agreeClaim++;
    //         // }
    //         // else{
    //         //     // this.setState({scene:2})
    //         //     /* 恢复验证规则 */
    //         //     if(lastState.current_trick.length===4||lastState.current_trick.length===0){
    //         //         this.playRules(this.state.nextplayer,null,null);
    //         //     }else{
    //         //         this.playSuit = lastState.current_trick.slice(0,1)[0][2].split('')[0];
    //         //         this.playRules(this.state.nextplayer,this.playSuit,null);
    //         //     }
    //         // }

    //         // this.playRules();
    //     }
    // }

    deal = () => {
        const cards = this.dealCards()
        this.setState({
            cards: cards
        });
    }
    /**
     * 发牌
     * 算法注解：
     *  1） 东西方向牌是横向的，因此要确定旋转的圆心。旋转后保证左上角坐标就是牌
     *      的左上角如果按照中心旋转则还需要计算偏移量。利用 transformOrigin
     *  2） 出牌的位置 东西南北 四个位置之前计算好的。
     *  3） xy+5 目的是避免靠近牌桌边缘。
     *  4） delay 是每张牌发出来的延迟时间。按照牌编号进行计算。出牌时应清零
     *  5） '02'.indexOf(index) 东西的牌 rotate 旋转90度
     *  6） .onclick=this.onclick(item2) onclick 函数引用
     *      this.onclick(item2) 仍然返回一个函数 用来处理点击事件，传入item2
     */
    dealCards(statecards) {
        const cards = statecards||this.state.cards;
        const offset = this.csize * 0.7 / 2
        cards.forEach((item, index) => {
            let rotate = 0;
            let seat = Table.seats[index]
            let [x, y] = [this.seat[seat][0].x, this.seat[seat][0].y]
            if ('02'.indexOf(index) !== -1) rotate = -90;
            x = x + this.width / 16 / 5; y = y + this.width / 16 / 5; // margin
            item.forEach((item1, index1) => {

                cards[index][index1].animation = {
                    top: y,
                    left: x,
                    delay: (item1.key % 13) * 80,
                    duration: 300,
                    rotate: rotate,
                    transformOrigin: `${offset}px ${offset}px`
                }
                cards[index][index1].active = 2; 
                cards[index][index1].onclick =  this.play(item1);
                // cards[index][index1].onclick =  () => false;
                if ('02'.indexOf(index) !== -1) y = y + this.csize * 0.15;
                else x = x + this.csize * 0.39;

            });
        })
        Sound.play('deal');
        return cards;
    }

    // 发送聊天消息，展示聊天消息
    // testChat = () => {
    //     const elSay = document.querySelector('#say')
    //     const msg ={
    //         pos:this.myseat,
    //         send_msg:elSay.value
    //     }
    //     if(this.state.scene===0){   //当scene===0，即处于准备状态时，用公共频道聊天；其他状态时，均用私有频道进行聊天
    //         Models.send_message(this.sucSend,this.failSend,this.channel_id,msg);
    //     }else{
    //         Models.send_message(this.sucSend,this.failSend,this.my_channel_id,msg);
    //     }
    // }
    // sucSend=(data)=>{
    //     const elSay = document.querySelector('#say')
    //     elSay.value=null;
    //     console.log(data)
    // }
    // failSend=()=>{console.log('fail send')}

    // // 展示叫牌消息
    // call = (seat,bid) =>{
    //     const calldata = this.state.calldata
    //     if(calldata.length === 0){
    //         calldata.push(Array(4).fill(null))
    //         calldata[0][Table.dir.indexOf(seat)] = bid;
    //     }else if(seat === 'N'){
    //         calldata.push(Array(4).fill(null))
    //         calldata[calldata.length-1][Table.dir.indexOf(seat)] = bid;
    //     }else{
    //         calldata[calldata.length-1][Table.dir.indexOf(seat)] = bid;
    //     }
    // }
    //  /**
    //  * 打开明手的牌。
    //  * 从 Models 获得数据。
    //  * 修改 seat 方位可以打开不同方位的牌。
    //  */
    // testDummy = (seat1,dummycards) => {
    //     console.log(seat1)
    //     console.log(dummycards)
	// 	// console.log(this.state.cards)
    //     const seat = seat1;
    //     let index = 0
    //     const dCards = dummycards.split('.');
    //     let cards = this.state.cards[Table.seats.indexOf(seat)];
    //     dCards.forEach((item1, index1) => {
    //         item1.split('').forEach((item2, index2) => {
    //             cards[index].card = item2 + Card.suits[index1]
    //             cards[index].onclick = this.play(cards[index]);
    //             // cards[index]['active'] = 1;
    //             // console.log(cards[index]['active'])
    //             index++;
    //         })
    //     })
    //     cards.map(item=>{
    //         console.log(item);
    //         if(item['card'].split('')[0]==='X'){
    //             item['animation']['left'] = this.width / 2;
    //             item['animation']['top'] = -this.width * 2;
    //             item['animation']['delay']=0;
    //         }
    //     })
    //     this.setState({
    //         cards: this.state.cards
    //     })
    // }
    
    // /**
    //  * 显示上墩牌
    //  * todo：明确了数据接口再改写。
    //  * 定位还存在问题。
    //  */
    // lastTrick = (data) => {
    //     // 在模型里 应该先判断当前 trick 编号。然后决定是否能看lasttrick
    //     console.log(this.lastTrickCard)
    //     console.log(this.state.lastTrick)
    //     if(this.lastTrickCard){
    //         if(data){
    //             console.log(this.lastTrickCard)
    //             let show = true;
    //             if(this.state.lastTrick) show = false;
    //             console.log(show)
    
    //             // if(data){show=false}
    
    //             const lt = this.lastTrickCard;
    //             let card = null;
    //             lt.pos.map((item,index)=>{
    //                 card = this._cardIndexOf(lt.card[index].index);
    //                 console.log(lt.card[index].index)
    //                 console.log(card)
    //                 card['animation']['left'] = (show === true) ?
    //                     this.seat[Table.seats[this.state.userdir.indexOf(item)]][1].x - this.width / 2.9
    //                     : this.width / 2;
    //                 card['animation']['top'] = (show === true) ?
    //                     this.seat[Table.seats[this.state.userdir.indexOf(item)]][1].y - this.width / 2.9
    //                     : -this.width * 2;
    //                 card['zIndex']=this.zindex++
    //                 card['animation']['delay']=0;
    //             })
            
    //             this.setState({
    //                 cards: this.state.cards,
    //                 lastTrick:!this.state.lastTrick
    //             })
    //         }else{
    //             const lt = this.lastTrickCard;
    //             let card = null;
    //             lt.pos.map((item,index)=>{
    //                 card = this._cardIndexOf(lt.card[index].index);
    //                 card['animation']['left'] = this.width / 2;
    //                 card['animation']['top'] = -this.width * 2;
    //                 card['zIndex']=this.zindex++
    //                 card['animation']['delay']=0;
    //             })
    //             this.setState({
    //                 cards: this.state.cards,
    //                 lastTrick:false
    //             })
    //         }
    //     }
    // }
    /**
     * 通过一张牌的索引，获得具体的 牌数据引用
     * @param {*} index 
     */
    _cardIndexOf(index) {
        const i1 = Math.floor(index / 13);
        const i2 = index % 13;
        return this.state.cards[i1][i2];
    }
    /**
     * 清理桌面上的牌
     * 定位参考：
     *  -this.width * 0.2;  计分位置
     */
    // clearBoard = () => {
    //     this.state.cards.map(item=>{
    //         item.map(item1=>{
    //             item1.onclick =  () => false;
    //             item1.active = 2;
    //         })
    //     });
    //     const board = this.board;
    //     for (let i = 0; i < board.length; i++) {
    //         console.log(board)
    //         board[i].animation.left = this.width / 2;
    //         board[i].animation.top = -this.width * 2;
    //         board[i].active = 3;
    //     }
    //     this.setState({
    //         cards: this.state.cards
    //     }, () => {this.board = [];this.lastTrickPos=[]; this.playRules(this.state.nextplayer,null,null);});
    //     Sound.play('clear');
    // }
    /**
     * 给某一个座位倒计时
     * 为了降低组件的耦合性。将本组件动态挂载到 DOM 上。
     * 利用 unmountComponentAtNode 进行卸载。
     * p, offset 都是闹钟出现位置的微调。
     */
    // timing = (seat, time, callback) => {
    //     ReactDOM.unmountComponentAtNode(document.querySelector('#clock'));
    //     const p = this.width * 0.25;
    //     const offset = {
    //         east: { x: p, y: 0 },
    //         south: { x: 0, y: p },
    //         west: { x: -p * 0.66, y: 0 },
    //         north: { x: 0, y: -p * 0.66 }
    //     }
    //     const top = this.seat[seat][1]['y'] + offset[seat].y;
    //     const left = this.seat[seat][1]['x'] + offset[seat].x;
    //     const style = {
    //         position: 'absolute',
    //         top: top,
    //         left: left,
    //         width: '10%',
    //         zIndex:6
    //     }
    //     const clock = (
    //         <div style={style}>
    //             <Clock time={time} callback={callback} />
    //         </div>
    //     );
    //     ReactDOM.render(
    //         clock,
    //         document.querySelector('#clock')
    //     )
    // }
 
    // showResult = (data) => {
    //     let result = null ;
    //     this.state.cards.map(itemSeat=>{
    //         itemSeat.map(item=>{
    //             item.position.x = this.width / 2;
    //             item.position.y = -this.width / 2;
    //         })
    //     })
    //     this.setState({cards:this.state.cards})
    //     data.ew_points?result = data.result+'  EW '+data.ew_points:result = data.result+'  NS '+data.ns_points;
    //     const re = <div className='result' style={this.css.result}>
    //         <img src='/cards/medal.svg' width="20%" />
    //         <div style={{lineHeight:this.width * 0.12+'px',}}>{result}</div>
    //         {/* <button onClick={this.hideResult}>下一局</button> */}
    //         <button disabled={true} >即将进入下一局</button>
    //     </div>;
    //     ReactDOM.unmountComponentAtNode(document.querySelector('#result'));
    //     ReactDOM.render(
    //         re,
    //         document.querySelector('#result')
    //     )
    //     setTimeout(this.hideResult,1000)
    //     // Models.join_channel(this.sucChannel,this.failChannel,this.table_id);
    // }
    // hideResult = () => {
    //     if(this.board_id_list.indexOf(this.board_id)<this.board_id_list.length-1){
    //         this.setState({
    //             scene: 0,    // 0 准备阶段 1 叫牌阶段 2 出牌阶段 3 claim 等待，4 claim 确认
    //             calldata:[],
    //             bidCard: null,
    //             contract:null,
    //             declarer:null,
    //             ns_win:null,
    //             ew_win:null,
    //             lastTrick:false,
    //             debug: false,
    //             lastTrick:false,
    //             // lastState: null,
    //             claimnum:{pos:null, num:0},
    //             ready:{east: null, south: null, west: null, north: null ,next_board:0},
    //             claiming:0,
    //             claimingState:[],
    //             // nextBoard:true,
    //         })
    //         this.state.cards = this.initCards();
    //         // this.claimnum = 0;      //claim的墩数、方位、庄家剩余的牌
    //         this.agreeClaim = 0;    //claim时，对防守方是否同意claim计数
    //         this.claimtrick = 13;    //可claim的数目
    //         this.originData = null;
    //         this.board = [];
    //         this.lastTrickCard = []; 
    //         this.lastTrickPos = []; 
    //         this.dummyCards = null;
    //         this.dummySeat = null;
    //         Models.join_channel(this.sucChannel,this.failChannel,this.table_id);
    //         ReactDOM.unmountComponentAtNode(document.querySelector('#result'));
    //     }
    //     if(this.board_id_list.indexOf(this.board_id)===this.board_id_list.length-1){
    //         this.props.toResult(this.table_id);
    //     }
    // }

    play=(item)=>{
        return () => {
            item['animation']['left'] = this.seat[item.seat][1].x;
            item['animation']['top'] = this.seat[item.seat][1].y;
            item['animation']['delay'] = 0;
            item['zIndex'] = this.zindex++
            this.setState({ cards: this.state.cards})
            Sound.play('play');
        }
    }

    openDebug=()=>{
        this.setState({debug:!this.state.debug})
    }

    // clickToPlay=()=>{
    //     this.state.cards.map(item=>{
    //         console.log('...........................')
    //         item.map(item1=>{
    //             item1.onclick =  this.play(item1)
    //             // item1.active = 2;
    //         })
    //     });
    //     // this.play()
    // }

    render() {
        const css = this.css;
        // const stat = Object.values(this.state.user).map(e => e.ready)
        // cards 从 state.cards 遍历获得。不要重复构造，而所有操作只操作数据。
        const cards = this.state.cards.map((item1, index1) => {
            return item1.map((item2, index2) => {

                return <Card
                    active={item2.active}
                    onClick={item2.onclick}
                    key={item2.key}
                    index={item2.key}
                    seat={item2.seat}
                    animation={item2.animation || ''}
                    card={item2.card}
                    size={item2.size}
                    position={item2.position}
                    zIndex={item2.zIndex}
                />

            });
        });
        return (
            /**
             * 设计分析：
             * 桌面布局写在一起，他们是固定不变的。
             * 而所有的card 不要到 布局的子元素里。这样看起来好像父子关系明确。
             * 但实际上：桌子 和 牌在不同的 zIndex 上。因此应该分开来写更加清晰。
             * 牌本身定位 不一定在桌子上，因此应该增加 最外层div
             * 
             * 定位：需要参考 布局的位置。可以取到布局的坐标。然后进行定位。
             *      注意父子组件的 position 设置。
             * 
             * <Card size='80' card='3S' rotate='0' position={{x:0,y:550}} />
             *      size        高度，宽=高×0.7
             *      card        具体那张牌 小写字母代表反面
             *      rotate      横向还是纵向摆放 0 纵向 90 横向
             *      position    定位，以父元素为参考进行绝对定位。
             * 
             */
            <div>
                <div id='table' className='match_table' style={css.table}>
                    
                    <div id='header' className='header' style={css.header}>
                        <div className='re' style={css.re}><Imps /></div>
                        <div className='re' style={css.re}  
                        onClick={this.openDebug}
                        >
                        <Seats 
                        dealer={Table.seats[this.state.userdir.indexOf(this.dealer)]} 
                        board_id={this.board_id_list?this.board_id_list.indexOf(this.board_id)+1:null}
                        />
                        </div>
                        <div className='re' style={css.re} onClick={this.lastTrick}>
                        <Tricks 
                        contract={this.state.contract}
                        declarer={this.state.declarer}
                        vertical={this.myseat==='N'||this.myseat==='S'?this.state.ns_win:this.state.ew_win}
                        transverse={this.myseat==='N'||this.myseat==='S'?this.state.ew_win:this.state.ns_win}
                        />
                        </div>
                        {this.state.declarer===this.myseat?<button onTouchEnd={this.state.playCardNumber===0?null:this.claim} className="claimbtn">摊牌</button>:null}
                        <div id='result' style={css.re}>结果</div> 
                        <div id='sound'></div>
                    </div>
                    <div id='body' className='body' style={css.body}>
                        {/* {!this.state.online?<div className='mask' style={css.body}><p style={{marginTop:80,fontSize:20,fontWeight:'bold'}}>牌手{this.state.offlinePlayer}已掉线，请耐心等待......</p></div>:null} */}
                        {this.state.lastTrick ? <div id='lastTrick' className='lastTrick'></div> : null}
                        {(this.state.scene === 1) ?
                            <div className='panel' style={css.panel}>
								<BidPanel 
								calldata={this.state.calldata} 
								bidCard={this.state.bidCard}
								bidCall={this.bidCall}
								/>
                            </div> : null
                        }
                        {this.state.scene===3 ? 
                        <Claim 
                        claimseat={this.state.declarer===this.myseat?0:2}
                        isDummy={this.state.dummy===this.myseat}
                        claimnum={this.state.claimnum}
                        active={this.state.claimingState.indexOf(this.myseat)>-1}
                        // claimnum={this.claimnum}
                        claiming={this.state.claiming}
                        number={this.claimtrick} 
                        onSubmit={this.handleClaim} 
                        onSubmit1={this.handleClaimMsg}
                        cancelClaim={this.cancelClaim} /> 
                        : null}
                        <div id='clock'></div>
                        <div id='east' className='east' style={css.east} ref={this.ref.east}>east</div>
                        <div id='west' className='west' style={css.west} ref={this.ref.west}>west</div>
                        <div id='south' className='pan_south' style={css.south} ref={this.ref.south}>south</div>
                        <div id='north' className='pan_north' style={css.north} ref={this.ref.north}>north</div>
                        <div id='board' className='board' style={css.board} ref={this.ref.board}>
                        <div className='userTag'>
                            <div className='seat' style={{backgroundColor: this.state.nextplayer===this.state.userdir[0]?'#ee88ee':'#ffff55'}}>
                                {this.state.declarer===this.state.userdir[Table.seats.indexOf('east')]?'(庄) ':null}
                                {Table.seatscn[ Table.seats.indexOf(this._shift('east')) ]}:
                                {this.state.user[this._shift('east')]}</div>
                        </div>
                        <div className='userTag'>
                            <div className='seat'  style={{backgroundColor: this.state.nextplayer===this.state.userdir[1]?'#ee88ee':'#ffff55'}}>
                                {this.state.declarer===this.state.userdir[Table.seats.indexOf('south')]?'(庄) ':null}
                                {Table.seatscn[Table.seats.indexOf(this._shift('south'))]}:
                                {this.state.user[this._shift('south')]}</div>
                        </div>
                        <div className='userTag'>
                            <div className='seat'  style={{backgroundColor: this.state.nextplayer===this.state.userdir[2]?'#ee88ee':'#ffff55'}}>
                                {this.state.declarer===this.state.userdir[Table.seats.indexOf('west')]?'(庄) ':null}
                                {Table.seatscn[Table.seats.indexOf(this._shift('west'))]}:
                                {this.state.user[this._shift('west')]}</div>
                        </div>
                        <div className='userTag'>
                            <div className='seat'  style={{backgroundColor: this.state.nextplayer===this.state.userdir[3]?'#ee88ee':'#ffff55'}}>
                                {this.state.declarer===this.state.userdir[Table.seats.indexOf('north')]?'(庄) ':null}
                                {Table.seatscn[Table.seats.indexOf(this._shift('north'))]}:
                                {this.state.user[this._shift('north')]}</div>
                        </div>
                        {this.state.scene === 0 ? <Prepare readyState={this.state.ready} handleReady={this.handleReady} /> : null}
                        </div>
                        {cards}
                    </div>
                    {this.state.debug ? <Debug o={this} /> : null}
                    <div id='message' className='message'></div>
                    <div id='footer' className='footer' style={css.footer}>
                        <input id='say' type='text' />
                        <input type='button' value='发送' onClick={this.testChat}/>
                    </div>
                </div>
            </div >
        );
    }
}
Table.seats = ['east', 'south', 'west', 'north']    
Table.dir = ['N','E','S','W']
Table.dirAll = ['north','east','south','west']
Table.seatscn = ['东', '南', '西', '北']
//export default Table
export default Table