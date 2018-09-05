import React, { Component } from 'react';
import settings from '../game/settings';



class Game{
    constructor(){
        this.user = this.getUser();
        this.isAllReady = false;
    }
    // 通过  session 获得用户 json
    getUser(){
        return {
            uid:1,
            uname:201
        }
    }
}


class Table extends Component {
    constructor(props){
        super(props);
        this.width = window.screen.width;
        this.height = window.screen.height;
        console.log('width:'+this.width)
        console.log('height:'+this.height)
        if(this.width < 400) settings.scale = 0.5;
    }
    render(){
        const style = {
            width:'800px',
            height:'600px',
            backgroundImage:'url(/imgs/bg1.png)'
        }
        return(
            <div id='table' style={style}>{this.props.children}</div>
        );
    }
}

//export default Table
export default Game