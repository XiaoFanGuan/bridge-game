import React, { Component } from 'react';
import './card.css'
/**
 * 一张牌应该有的属性和状态
 * 属性：
 *      花色：props.suit  花色大写 为正面，小写为背面
 *      点数：props.pip
 * 
 * 关于样式的考虑
 * 
 *      这里采用的是 react 的方式。把样式定义为对象。好处是：可以灵活的对样式进行
 *      编程。灵活控制样式的变化。
 * 
 * 构造函数
 *      Card('D1') 内部解析 D1 转换为样式。 D1 是对象属性。但是所有样式应该是静态
 *      属性。
 * 
 */




class Card extends Component {
    /**
     * one react props name eg.: D5
     * 
     * object property:
     *  current card pip  2-14
     *  current card suit
     */
    constructor(props) {
        super(props);
        this.pip = props.name.slice(1);
        this.suit = props.name.slice(0, 1);
    }
    render() {
        const color = ("HDhd".indexOf(this.suit) != -1) ? 'red' : 'black';
        const s = ("schd".indexOf(this.suit) != -1) ? 0 : 1;
        const side = ['url(/imgs/card-back.png)', 'url(/imgs/card-front.png)'][s]
        const style = {
            width: '91px',
            height: '130px',
            position:'absolute',
            backgroundImage: side
        }
        return (
            <div style={style}>
                <div style={(s)?{'display':''}:{'display':'none'}}>
                    <Card.Suit suit={this.suit} size='s' />
                    <Card.Suit suit={this.suit} size='b' />
                    <Card.Pip color={color} pip={this.pip} />
                </div>
            </div>
        );
    }
}
// 点数
Card.pips = [2,3,4,5,6,7,8,9,10,11,12,13,14]
Card.suits = ['S','H','D','C']
Card.Pip = function (props) {
    const color = props.color;
    const pip = '-' + props.pip;
    const size = '18px';
    const pipImg = 'url(/imgs/' + color + pip + '.png)';
    const style = {
        width: size,
        height: size,
        position: 'absolute',
        top: '35px',
        left: '5px',
        backgroundImage: pipImg,
        backgroundSize: size + ' ' + size
    }
    return <div style={style}></div>
}
// 花色
Card.Suit = function (props) {
    const size = (props.size == 's') ? '_s' : '';
    //const imgSize = (props.size == 's') ? '18px' : '62px';
    const suitImgs = {
        S: 'url(/imgs/spade' + size + '.png)',
        H: 'url(/imgs/heart' + size + '.png)',
        D: 'url(/imgs/diamond' + size + '.png)',
        C: 'url(/imgs/club' + size + '.png)'
    }
    const style = {
        width: (props.size == 's') ? '18px' : '62px',
        height: (props.size == 's') ? '28px' : '62px',
        position: 'absolute',
        top: (props.size == 's') ? '5px' : '35px',
        left: (props.size == 's') ? '5px' : '15px',
        backgroundImage: suitImgs[props.suit],
        backgroundRepeat: 'no-repeat',
        //backgroundSize: imgSize + ' ' + imgSize
    }
    return <div style={style}></div>
}

export default Card;