export default class Func{
    constructor(props){
        this.props=props
    }

    re_transfer=(val,num1,num2,y)=>{
        let add = y ? `\n` :''; 
        if(val.split('')[num1]==='S'){val = val.split('')[num2]+add+'♠'}
        if(val.split('')[num1]==='H'){val = val.split('')[num2]+add+'♥'}
        if(val.split('')[num1]==='D'){val = val.split('')[num2]+add+'♦'}
        if(val.split('')[num1]==='C'){val = val.split('')[num2]+add+'♣'}
        return val;
    }

    call_cards=(direct,card,dataSource)=>{   //展示叫牌信息
        let calls=dataSource;
        let count = calls.length-1;
        if(direct==='N'){
            if(!calls[count].N&&!calls[count].E&&!calls[count].S&&!calls[count].W){ calls[count].N=this.re_transfer(card,1,0,false);}else{ count++; calls.push({ key:count, N:'', E:'', S:'', W:'',}); calls[count].N=this.re_transfer(card,1,0,false);}
        }
        if(direct==='E'){
            if(!calls[count].E&&!calls[count].S&&!calls[count].W){ calls[count].E=this.re_transfer(card,1,0,false);}else{ count++; calls.push({ key:count, N:'', E:'', S:'', W:'',}); calls[count].E=this.re_transfer(card,1,0,false);}
        }
        if(direct==='S'){
            if(!calls[count].S&&!calls[count].W){ calls[count].S=this.re_transfer(card,1,0,false);}else{ count++; calls.push({ key:count, N:'', E:'', S:'', W:'',}); calls[count].S=this.re_transfer(card,1,0,false);}
        }
        if(direct==='W'){
            if(!calls[count].W){ calls[count].W=this.re_transfer(card,1,0,false);}else{ count++; calls.push({ key:count, N:'', E:'', S:'', W:'',}); calls[count].W=this.re_transfer(card,1,0,false);}
        }
        return calls
    }

    playOrder=(data,i)=>{   //展示出牌顺序
        let piers = data.slice(4*i,4*(i+1));
        console.log(piers);

        let plays;
        if(piers[0][1]==='S'){
            plays={
                key:i,
                pier:i+1,
                east:'',
                south:this.re_transfer(piers[0][2],0,1,false),
                west:this.re_transfer(piers[1][2],0,1,false),
                north:this.re_transfer(piers[2][2],0,1,false),
                east_next:this.re_transfer(piers[3][2],0,1,false),
                south_next:'',
                west_next:'',
            }
        }
        if(piers[0][1]==='W'){
            plays={
                key:i,
                pier:i+1,
                east:'',
                south:'',
                west:this.re_transfer(piers[0][2],0,1,false),
                north:this.re_transfer(piers[1][2],0,1,false),
                east_next:this.re_transfer(piers[2][2],0,1,false),
                south_next:this.re_transfer(piers[3][2],0,1,false),
                west_next:'',
            }
        }
        if(piers[0][1]==='N'){
            plays={
                key:i,
                pier:i+1,
                east:'',
                south:'',
                west:'',
                north:this.re_transfer(piers[0][2],0,1,false),
                east_next:this.re_transfer(piers[1][2],0,1,false),
                south_next:this.re_transfer(piers[2][2],0,1,false),
                west_next:this.re_transfer(piers[3][2],0,1,false),
            }
        }
        if(piers[0][1]==='E'){
            plays={
                key:i,
                pier:i+1,
                east:this.re_transfer(piers[0][2],0,1,false),
                south:this.re_transfer(piers[1][2],0,1,false),
                west:this.re_transfer(piers[2][2],0,1,false),
                north:this.re_transfer(piers[3][2],0,1,false),
                east_next:'',
                south_next:'',
                west_next:'',
            }
        }
        return plays
    }
}