console.log('in playing')
            this.setState({
                scene: 2, 

                // contract:lastState.contract,
                // declarer:lastState.declarer,
                // dummy:lastState.dummy,
                // ns_win:lastState.ns_win,
                // ew_win:lastState.ew_win,
                // nextplayer:lastState.player,    //设置下一个出牌人
            })

            // let countClaim = 0;
            // lastState.unplayed_card.map(item1=>{    //设置可claim的墩数
            //     if(item1[0]===this.state.declarer){
            //         countClaim += 1;
            //     }
            // });
            // this.claimtrick = countClaim;

            // if(lastState.unplayed_card.length===52){
            //     this.splitCards(this.originData);
                ReactDOM.unmountComponentAtNode(document.querySelector('#clock'));
            //     this.setState({scene:2})
            // }
            // else{
            //     const mycards = [[],[],[],[]];       /*恢复自己的牌 */
            //     let mycardslength = 0;
            //     let addXX = ['X','X','X','X','X','X','X','X','X','X','X','X','X'];
            //     this.state.lastState.unplayed_card.map(item=>{
            //         if(item[0]===this.myseat){
            //             addXX.pop();
            //             mycardslength += 1;
            //             if(item[1].split('')[0]==='S'){mycards[0]+=item[1].split('')[1]}
            //             if(item[1].split('')[0]==='H'){mycards[1]+=item[1].split('')[1]}
            //             if(item[1].split('')[0]==='D'){mycards[2]+=item[1].split('')[1]}
            //             if(item[1].split('')[0]==='C'){mycards[3]+=item[1].split('')[1]}
                        
            //         }
            //     })
            //     this.deals = 'XXX.XX.XXXX.XXXX '+ mycards.join('.') + addXX.join('') +' XXX.XX.XXXX.XXXX XXX.XX.XXXX.XXXX';
            //     this.state.cards = this.initCards()
            //     this.deal();
    
                /*恢复明手的牌 */
                // if(lastState.unplayed_card.length!==52){
                //     this.state.playCardNumber = 52-lastState.unplayed_card.length
                    this.dummyCards = this.cards[Table.dir.indexOf(this.state.dummy)];       //拿到明手的牌
                //     this.testdummyCards=['','','',''];
                //     this.dummySeat = Table.seats[this.state.userdir.indexOf(this.state.dummy)]
                //     lastState.unplayed_card.map(item=>{
                //         if(item[0]===lastState.dummy){
                //             if(item[1].split('')[0]==='S'){this.testdummyCards[0]+=item[1].split('')[1]}
                //             if(item[1].split('')[0]==='H'){this.testdummyCards[1]+=item[1].split('')[1]}
                //             if(item[1].split('')[0]==='D'){this.testdummyCards[2]+=item[1].split('')[1]}
                //             if(item[1].split('')[0]==='C'){this.testdummyCards[3]+=item[1].split('')[1]}
                            
                //         }
                //     });
                //     this.testDummy(this.dummySeat,this.testdummyCards.join('.'))
                // }
                
                
                if(lastState.board_claim){
                    //恢复庄家的牌
                    // if(lastState.unplayed_card.length!==52){
                    //     const testDeclarerCards=['','','',''];      
                    //     const declarerSeat = Table.seats[this.state.userdir.indexOf(this.state.declarer)]
                    //     lastState.unplayed_card.map(item=>{
                    //         if(item[0]===lastState.declarer){
                    //             if(item[1].split('')[0]==='S'){testDeclarerCards[0]+=item[1].split('')[1]}
                    //             if(item[1].split('')[0]==='H'){testDeclarerCards[1]+=item[1].split('')[1]}
                    //             if(item[1].split('')[0]==='D'){testDeclarerCards[2]+=item[1].split('')[1]}
                    //             if(item[1].split('')[0]==='C'){testDeclarerCards[3]+=item[1].split('')[1]}
                                
                    //         }
                    //     });
                    //     console.log(testDeclarerCards)
                    //     this.testDummy(declarerSeat,testDeclarerCards.join('.'))
                    // }
                    //恢复防守的牌
                    // const guardSeat = [];
                    // this.state.userdir.map(item=>{
                    //     if(item!==this.myseat&&item!==this.state.declarer&&item!==this.state.dummy){  guardSeat.push({pos:item,num:13}); }
                    // });
                    // guardSeat.map(item=>{
                    //     lastState.unplayed_card.map(item1=>{
                    //         if(item1[0]===item.pos){ item.num--;  }
                    //     });
                    // });
                    // this.state.cards.map(item=>{
                    //     guardSeat.map(item1=>{
                    //         item.map(item2=>{
                    //             if(item2.seat===Table.seats[this.state.userdir.indexOf(item1.pos)]){
                    //                 if(item1.num){
                    //                     // item2['animation']['left'] = this.width / 2;
                    //                     // item2['animation']['top'] = -this.width * 2;
                    //                     this.moveToPlayed(item2);
                    //                     item1.num--;
                    //                 }
                    //             }
                    //         });
                    //     });
                    // });
                }else{
                    //恢复防守的牌
                    // const guardSeat = [];
                    // this.state.userdir.map(item=>{
                    //     if(item!==this.myseat&&item!==this.state.dummy){  guardSeat.push({pos:item,num:13}); }
                    // });
                    // guardSeat.map(item=>{
                    //     lastState.unplayed_card.map(item1=>{
                    //         if(item1[0]===item.pos){ item.num--;  }
                    //     });
                    // });
                    // this.state.cards.map(item=>{
                    //     guardSeat.map(item1=>{
                    //         item.map(item2=>{
                    //             if(item2.seat===Table.seats[this.state.userdir.indexOf(item1.pos)]){
                    //                 if(item1.num){
                    //                     // item2['animation']['left'] = this.width / 2;
                    //                     // item2['animation']['top'] = -this.width * 2;
                    //                     this.moveToPlayed(item2);
                    //                     item1.num--;
                    //                 }
                    //             }
                    //         });
                    //     });
                    // });
                }
                //恢复上一墩
            //     if(lastState.last_trick.length===4&&lastState.current_trick.length!==4){
            //         lastState.last_trick.map(item=>{
            //             const card = item[1].split('')[1]+item[1].split('')[0]      // 对收到的牌处理成‘5C’的格式
            //             const playSeatCard = this.state.cards[this.state.userdir.indexOf(item[0])]
            //             console.log(playSeatCard)
            //             let last = 0
            //             playSeatCard.map(item=>{
            //                 if(item.card.split('')[0]==='X'&&last===0){
            //                     item.card=card
            //                     last=1
            //                 }
            //             })
            //             if(playSeatCard[0].card.split('')[0]==='X'){
            //                 playSeatCard[0].card=card
            //             }
            //             playSeatCard.map((item1,index1)=>{      //动画，将当前出牌人出的牌放到board中，即表现为出牌
            //                 if(item1.card===card){
            //                     console.log(item[1])
            //                     this.lastTrickPos.push(item[0]);
            //                     this.board.push(item1);
            //                     // item1['animation']['left'] = this.width / 2;
            //                     // item1['animation']['top'] = -this.width * 2;
            //                     // item1['zIndex'] = this.zindex++
            //                     // item1['active'] = 3;
            //                     this.moveToPlayed(item1)
                             
            //                 }
            //                 // Sound.play('play');
            //             });
            //         });
            //         this.lastTrickCard = {pos:this.lastTrickPos,card:this.board};
            //         this.lastTrickPos=[];
            //         this.board=[]
            //     }
    
            //     //恢复当前墩
            //     lastState.current_trick.map(item=>{
            //         const card = item[2].split('')[1]+item[2].split('')[0]      // 对收到的牌处理成‘5C’的格式
            //         const playSeatCard = this.state.cards[this.state.userdir.indexOf(item[1])]     //拿到当前出牌人对应的牌，应为XXXXXXXXXXXXX
            //         console.log(playSeatCard)
            //         console.log(this.state.cards)
            //         let last = 0
            //         playSeatCard.map(item=>{
            //             if(item.card.split('')[0]==='X'&&last===0){
            //                 item.card=card
            //                 last=1
            //             }
            //         })
            //         playSeatCard.map((item1,index1)=>{      //动画，将当前出牌人出的牌放到board中，即表现为出牌
            //             if(item1.card===card){
            //                 this.lastTrickPos.push(item[1])
            //                 this.board.push(item1);
            //                 // item1['animation']['left'] = this.seat[item1.seat][1].x;
            //                 // item1['animation']['top'] = this.seat[item1.seat][1].y;
            //                 // item1['animation']['delay'] = 0;
            //                 // item1['zIndex'] = this.zindex++
            //                 this.playCard(item1)
            //             }
            //             // Sound.play('play');
            //         });
            //     })
    
    
            //     if(this.board.length===4){
            //         this.lastTrickCard = {pos:this.lastTrickPos,card:this.board};
            //         // this.setState({lastTrick:false})
            //         // this.lastTrick(true)
            //         setTimeout(this.clearBoard, 300)
            //     }
    
            //     //恢复自己的牌，去掉已出的牌
            //     this.state.cards[this.state.userdir.indexOf(this.myseat)].map(item=>{
            //         if(item.card.split('')[0]==='X'){
            //             // item['animation']['left'] = this.width / 2;
            //             // item['animation']['top'] = -this.width * 2;
            //             // item['active'] = 3;
            //             this.moveToPlayed(item)
            //         }
            //     })
            // }
            
            /* 恢复验证规则 */
            if(lastState.current_trick.length===4||lastState.current_trick.length===0){
                this.playRules(this.state.nextplayer,null,null);
            }else{
                this.playSuit = lastState.current_trick.slice(0,1)[0][2].split('')[0];
                this.playRules(this.state.nextplayer,this.playSuit,null);
            }