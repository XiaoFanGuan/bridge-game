import React from 'react'
import {WingBlank,Flex,WhiteSpace} from 'antd-mobile'
export default class CardSuit extends React.Component{
    state={
        vulnerable:null,
        cards:null,
        table_information:null
    }
    componentWillReceiveProps(newProps){
        console.log(newProps)
        this.setState({
            cards:newProps.cards,
            vulnerable:newProps.vulnerable,
            table_information:newProps.table_information
        })
    }
    render(){
        const card = this.state.cards?this.state.cards.split(' '):null;
        
        return(
            <WingBlank>
                <WhiteSpace/>
                <Flex>
                    <Flex.Item style={{height:140,border:'1px solid black',marginLeft:0,padding:5}}><p>局况</p><p>{this.state.vulnerable?this.state.vulnerable:null}</p></Flex.Item>
                    <Flex.Item style={{height:140,border:'1px solid black',marginLeft:0,padding:5}}>
                        <Flex>
                            <Flex.Item>♠ <span>{card?card[0].split('.')[0]:null}</span></Flex.Item>
                        </Flex>
                        <Flex>
                            <Flex.Item style={{color:'red'}}>♥ <span>{card?card[0].split('.')[1]:null}</span></Flex.Item>
                        </Flex>
                        <Flex>
                            <Flex.Item style={{color:'red'}}>♦ <span>{card?card[0].split('.')[2]:null}</span></Flex.Item>
                        </Flex>
                        <Flex>
                            <Flex.Item>♣ <span>{card?card[0].split('.')[3]:null}</span></Flex.Item>
                        </Flex>
                        <Flex>
                            <Flex.Item style={{textAlign:'center'}}>{this.state.table_information?this.state.table_information.map(item=>{
                                if(item[1]==="N")
                                return item[0]
                            }):null}</Flex.Item>
                        </Flex>
                    </Flex.Item>
                    <Flex.Item style={{height:140,border:'1px solid black',marginLeft:0,padding:5}}></Flex.Item>
                </Flex>
                <Flex>
                    <Flex.Item style={{height:140,border:'1px solid black',marginLeft:0,padding:5}}>
                        <Flex>
                            <Flex.Item>♠ <span>{card?card[1].split('.')[0]:null}</span></Flex.Item>
                        </Flex>
                        <Flex>
                            <Flex.Item style={{color:'red'}}>♥ <span>{card?card[1].split('.')[1]:null}</span></Flex.Item>
                        </Flex>
                        <Flex>
                            <Flex.Item style={{color:'red'}}>♦ <span>{card?card[1].split('.')[2]:null}</span></Flex.Item>
                        </Flex>
                        <Flex>
                            <Flex.Item>♣ <span>{card?card[1].split('.')[3]:null}</span></Flex.Item>
                        </Flex>
                        <Flex>
                            <Flex.Item style={{textAlign:'center'}}>{this.state.table_information?this.state.table_information.map(item=>{
                                if(item[1]==="E")
                                return item[0]
                            }):null}</Flex.Item>
                        </Flex>
                    </Flex.Item>
                    <Flex.Item style={{height:140,border:'1px solid black',marginLeft:0,padding:5}}>
                        <Flex style={{height:20}}>
                            <Flex.Item style={{textAlign:'center'}}>N</Flex.Item>
                        </Flex>
                        <Flex style={{height:60,lineHeight:60}}>
                            <Flex.Item>E</Flex.Item>
                            <Flex.Item style={{textAlign:'right'}}>S</Flex.Item>
                        </Flex>
                        <Flex style={{height:20}}>
                            <Flex.Item style={{textAlign:'center'}}>W</Flex.Item>
                        </Flex>
                    </Flex.Item>
                    <Flex.Item style={{height:140,border:'1px solid black',marginLeft:0,padding:5}}>
                        <Flex>
                            <Flex.Item>♠ <span>{card?card[2].split('.')[0]:null}</span></Flex.Item>
                        </Flex>
                        <Flex>
                            <Flex.Item style={{color:'red'}}>♥ <span>{card?card[2].split('.')[1]:null}</span></Flex.Item>
                        </Flex>
                        <Flex>
                            <Flex.Item style={{color:'red'}}>♦ <span>{card?card[2].split('.')[2]:null}</span></Flex.Item>
                        </Flex>
                        <Flex>
                            <Flex.Item>♣ <span>{card?card[2].split('.')[3]:null}</span></Flex.Item>
                        </Flex>
                        <Flex>
                            <Flex.Item style={{textAlign:'center'}}>{this.state.table_information?this.state.table_information.map(item=>{
                                if(item[1]==="W")
                                return item[0]
                            }):null}</Flex.Item>
                        </Flex>
                    </Flex.Item>
                </Flex>
                <Flex>
                    <Flex.Item style={{height:140,border:'1px solid black',marginLeft:0,padding:5}}></Flex.Item>
                    <Flex.Item style={{height:140,border:'1px solid black',marginLeft:0,padding:5}}>
                        <Flex>
                            <Flex.Item>♠ <span>{card?card[3].split('.')[0]:null}</span></Flex.Item>
                        </Flex>
                        <Flex>
                            <Flex.Item style={{color:'red'}}>♥ <span>{card?card[3].split('.')[1]:null}</span></Flex.Item>
                        </Flex>
                        <Flex>
                            <Flex.Item style={{color:'red'}}>♦ <span>{card?card[3].split('.')[2]:null}</span></Flex.Item>
                        </Flex>
                        <Flex>
                            <Flex.Item>♣ <span>{card?card[3].split('.')[3]:null}</span></Flex.Item>
                        </Flex>
                        <Flex>
                            <Flex.Item style={{textAlign:'center'}}>{this.state.table_information?this.state.table_information.map(item=>{
                                if(item[1]==="S")
                                return item[0]
                            }):null}</Flex.Item>
                        </Flex>
                    </Flex.Item>
                    <Flex.Item style={{height:140,border:'1px solid black',marginLeft:0,padding:5}}></Flex.Item>
                </Flex>
                <WhiteSpace/>
            </WingBlank>
        )
    }
}