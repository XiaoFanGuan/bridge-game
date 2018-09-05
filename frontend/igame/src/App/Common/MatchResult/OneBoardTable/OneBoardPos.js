import React from 'react';
import './OneBoardPos.css'
const OneBoardPos = ({ direction }) => {
    console.log('dir', direction);
    let eArr = [];
    let sArr = [];
    let nArr = [];
    let wArr = [];
    let vulnerable = '';
    let dealer = '';
    let datum = 0;
    if (direction) {
        const { E, S, N, W } = direction[0];
        eArr = E.split('.');
        sArr = S.split('.');
        nArr = N.split('.');
        wArr = W.split('.');
        dealer = direction[1].dealer;
        vulnerable = direction[1].vulnerable;
        datum = direction[2].Datum;
    }
    const ComponentDirection = (direction) => {
        console.log(direction)
        const srcimge = [
            "/Images/001.png",
            "/Images/002.png",
            "/Images/003.png",
            "/Images/004.png",
        ]
        return direction.map((child, index) => {
            return <li key={index}>
                <img
                    src={srcimge[index]}
                    style={{ width: 8, height: 8 }}
                />
                {child}

            </li>
        })
    }
    return (
        <div className="Oopen">
            <div className="Oopenbox">
                <div className="Onorth">
                    <ul>
                        {ComponentDirection(nArr)}
                    </ul>
                </div>
                <div className="Odealer">
                    <ul>
                        <li>发牌：{dealer}</li>
                        <li>局况：{vulnerable}</li>
                    </ul>
                </div>
                <div className="Omiddle">
                    <div className="Owestern">
                        <ul>
                            {ComponentDirection(wArr)}
                        </ul>
                    </div>
                    <div className="Otable">
                        <div className="Otablebox">
                            <div className="Onor">N</div>
                            <div className="Owes">W</div>
                            <div className="Oease">E</div>
                            <div className="Osou">S</div>
                        </div>
                    </div>
                    <div className="Oeast">
                        <ul>
                            {ComponentDirection(eArr)}
                        </ul>
                    </div>
                </div>
                <div className="Osouth">
                    <ul>
                        {ComponentDirection(sArr)}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default OneBoardPos;
