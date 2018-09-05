import React from 'react';
import TweenOne from 'rc-tween-one';

/**
 * props 说明
 *      animation   和 TweenOne 的 animation 同步
 *      position    非动画定位
 *      size        大小
 *      card        5S 黑桃5
 *      zIndex      叠放顺序
 *      onClick     点击绑定到图片上
 *      active      0,1,2  0 灰色不能点，1 亮色不能点，2 亮色能点
*/
class Card extends React.Component {
    render() {
        const getStyle = () => {
            let style = { position: 'absolute' }
            if (this.props.position) {
                style['top'] = this.props.position.y + 'px'
                style['left'] = this.props.position.x + 'px'
            }
            if (this.props.size) {
                style['height'] = this.props.size * 1;
                style['width'] = this.props.size * 0.7;
            }
            return style;
        }
        if(this.props.active === 3) {
            this.props.animation && ( this.props.animation.onComplete = () => {
                
                // 这张牌消失，非受控，不建议。
                // let cCard = document.querySelector('#card'+this.props.index);
                // cCard.style.display = 'none';
            } )
        }
        if(this.props.active === 0)
            this.props.animation && ( this.props.animation['brightness'] = 0.6 )
        if(this.props.active === 1)
            this.props.animation && ( this.props.animation['brightness'] = 1 )
        let onclick = ()=>false;
        if(this.props.active === 2){
            onclick = this.props.onClick;
            this.props.animation && ( this.props.animation['brightness'] = 1 )
        }
        const card = this.props.card.slice(0,1) === 'X' ? 
            'back' : this.props.card;
        return (
            <div id={'card'+this.props.index}  // TODO: 这个div定位不理想，只是起到了 zIndex 作用。
                style={{
                    position: 'absolute',
                    zIndex: this.props.zIndex,
                }}
            >
                <TweenOne
                    animation={{
                        ...this.props.animation,
                        ease: 'easeOutQuint',       // 缓动参数 参考蚂蚁手册 easeOutExpo
                    }}
                    style={getStyle()}
                >
                    <img onClick={onclick}
                        src={`/cards/${card}.svg`}
                        style={{
                            position: 'absolute',
                            width: "100%",
                            height: "100%",
                            zIndex: this.props.zIndex,
                        }}
                    />
                </TweenOne>
            </div>
        )
    }
}
Card.suits = ['S', 'H', 'D', 'C'];
/**
 * 
 * @param {*} deals 字符串 一手牌，比如：J95.K862.J97.643
 * 顺序为：黑桃，红桃，方片，梅花
 * @param {*} order 这张牌的序号基数 饕餮鱼
 */
// Card.crateCards = function(deals,order){
//     let index = order;
//     const suits = deals.split('.')
//     suits.map((item,index)=>{
//         item.split('').map((item1)=>{
//             return {
//                 onclick:()=>false,
//                 active:0,
//                 key:index++,

//             }
//         })
//     })
// }
export default Card