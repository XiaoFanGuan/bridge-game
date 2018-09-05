import Card from '../game/Card'
import Table from '../game/Table'

export default class pureFunc{
    constructor(props){
        this.props=props;
        console.log(this.props)
    }
    setBoardId=(data,board_id)=>{
        this.props.my_channel_id = data[2];
        if(this.props.board_id_list){
            this.props.channel_id = data[0];
            this.props.board_id = this.props.board_id_list[this.props.board_id_list.indexOf(this.props.board_id)+1];
        }else{
            this.props.board_id_list = data[1];
            this.props.channel_id = data[0];
            this.props.board_id = board_id||data[1][0];
        }
    }

    transfer=(pos)=>{   //根据“我”的方位按照“右，下，左，上”的顺序计算对应的实际方位
        if(pos==='N')this.props.setState({userdir:['W','N','E','S']})
        if(pos==='E')this.props.setState({userdir:['N','E','S','W']})
        if(pos==='S')this.props.setState({userdir:['E','S','W','N',]})
        if(pos==='W')this.props.setState({userdir:['S','W','N','E']})
    }

    splitCards=(data)=>{
        this.props.cards = data.cards.split(' ');
        this.props.dealer=data.dealer;
        this.props.timing(Table.seats[this.props.state.userdir.indexOf(data.dealer)],10,()=>{console.log('clockclockclockclockclockclock')});
        this.props.deals = 'XXX.XX.XXXX.XXXX '+ data.cards.split(' ')[Table.dir.indexOf(this.props.myseat)] +' XXX.XX.XXXX.XXXX XXX.XX.XXXX.XXXX';
        this.props.state.cards = this.props.initCards()
        this.props.deal();
        this.props.setState({scene:1})  
    }
}

// export default {setBoardId}