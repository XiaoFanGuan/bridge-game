import React from 'react'
import {NavBar, Icon} from 'antd-mobile'

export default class EventNavBar extends React.Component{
    clickArrow=()=>{
        this.props.clickArrow();
    }
    render(){
        return(
            <NavBar
                mode="light"
                icon={<Icon type={this.props.left} />}
                onLeftClick={this.clickArrow}
                style={{marginTop:1}}
                >
                {this.props.eventName}
            </NavBar>
        )
    }
}