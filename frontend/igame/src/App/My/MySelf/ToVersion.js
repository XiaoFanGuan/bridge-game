import React from 'react';
import { NavBar, Icon, List } from 'antd-mobile';
const Item = List.Item;

class ToVersion extends React.Component {
    render() {
        return (
            <div>
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.toMySelf()}
                >版本号
            </NavBar>
                <List>
                    <Item extra="" arrow="horizontal" onClick={() => { }}>我的邮箱</Item>
                    <Item extra="v 1.0.0" arrow="horizontal" onClick={() => { }}>关于智赛桥牌</Item>
                </List>
            </div>
        )
    }
}
export default ToVersion;