import Card from '../game/Card'
import Table from '../game/Table'

export default class pureFunc{
    constructor(props){
        this.props=props;
        console.log(this.props)
    }


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
        center.x = this.props.ref.board.current.offsetTop +
            parseInt(this.props.ref.board.current.style.height.slice(0, -2)) / 2
        center.y = this.props.ref.board.current.offsetLeft +
            parseInt(this.props.ref.board.current.style.width.slice(0, -2)) / 2
        this.props.center = center;
        const offset = this.props.csize * 0.7 / 2
        for (let key in this.props.seat) {
            this.props.seat[key][0]['y'] = this.props.ref[key].current.offsetTop;
            this.props.seat[key][0]['x'] = this.props.ref[key].current.offsetLeft;
            if (key === 'east') {
                this.props.seat[key][0]['y'] = this.props.seat[key][0]['y'] + this.props.width * 0.06
                // 下面是处理　牌的叠放顺序　联合参考：dealCards
                //this.props.seat[key][0]['y'] = this.props.seat[key][0]['y'] + this.props.width * 0.4
                this.props.seat[key][1]['y'] = center.y - offset
                this.props.seat[key][1]['x'] = center.x - offset
            } else if (key === 'south') {
                this.props.seat[key][0]['x'] = this.props.seat[key][0]['x'] //+ this.props.width * 0.21
                //this.props.seat[key][1]['y'] = center.y + offset - this.props.csize / 2;
                this.props.seat[key][1]['y'] = center.y - offset
                this.props.seat[key][1]['x'] = center.x - this.props.csize * 0.7 / 2;
            } else if (key === 'west') {
                this.props.seat[key][0]['y'] = this.props.seat[key][0]['y'] + this.props.width * 0.06
                this.props.seat[key][1]['y'] = center.y - offset
                this.props.seat[key][1]['x'] = center.x + offset - this.props.csize;
            } else {
                this.props.seat[key][0]['x'] = this.props.seat[key][0]['x'] // + this.props.width * 0.21
                this.props.seat[key][1]['y'] = center.y + offset - this.props.csize;
                this.props.seat[key][1]['x'] = center.x - this.props.csize * 0.7 / 2;
            }
        }
    }

    /**
     * initCards 从 this.deals 初始化成 Cards 组件为渲染输出做准备，返回到 this.cards
     * TODO：把一手牌 变成
     */
    initCards() {
        const suits = Card.suits                    //['S', 'H', 'D', 'C'];
        const deals = this.props.deals.split(' ')
        console.log(deals)
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
                        size: this.props.csize,                // 牌的大小
                        card: s[i] + suits[index2],
                        position: { x: this.props.width / 2, y: this.props.width * 2 }     // 考虑一个默认位置。
                    })
                }
            });
        });
        return cards;
    }


   
}