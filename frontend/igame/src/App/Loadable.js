import React from 'react';
// import ReactDOM from 'react-dom';
import Loadable from 'react-loadable';
import {Icon} from 'antd-mobile'
/**
 * 本页面定义若干 模块/页面。
 * 
 */



// 定义加载时 如何显示。可以考虑动画。
// const Loading = () => { return <div>Loading...</div> };
// function loadingToast() {
//     Toast.loading('Loading...', 1, null);
//     return <div>载入完毕</div>
// }

const loading1 = <div style={{
    fontSize: '14px',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingTop:20,
    borderRadius:'5px',
    width:100,
    height:100,
    margin:'auto',
    textAlign:'center',
    position: 'relative',
    top: 200,
    left: "2%",
    zIndex:10000,
}} >
    <Icon type='loading' size='lg' />
    <div style={{color:'white'}} >Loading...</div>
</div>;


export const Site = Loadable({
    loader: () => import('./Site/Index'),
    loading: () => loading1
});
export const App2 = Loadable({
    // 赛事列表入口
    // loader: () => import('./App2/Index2'),
    loader: () => import('./Game/game/Game'),
    loading: () => loading1,
});
export const Learn = Loadable({
    //比赛入口
    loader: () => import('./SingleGame/game/Game'),
    // loader: () => import('./Game/Index'),
    loading: () => loading1,
});
export const My = Loadable({
    //‘我’入口
    loader: () => import('./My/Index'),
    loading: () => loading1,
});
export const TeamAdd = Loadable({
    //我-->创建赛队入口
    loader: () => import('./My/MyTeam/AddTeam/Index'),
    loading: () => loading1,
});
export const TeamMine = Loadable({
    //我-->我的赛队入口
    loader: ()=> import('./My/MyTeam/Mine'),
    loading: ()=>loading1,
})


export const NewTeamSign = Loadable({
    loader: () => import('./App2/Sign/NewTeamForm'),
    // loading:() => <div>Loading...</div>,
    loading:() => loading1,
});

export const ExistTeamSign = Loadable({
    loader: () => import('./App2/Sign/ExistTeamForm'),
    // loading:() => <div>Loading...</div>,
    loading:() => loading1,
});

// const App = {
//     'App1':App1,
//     'App2':App2
// }
