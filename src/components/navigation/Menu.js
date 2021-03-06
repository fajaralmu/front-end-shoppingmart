import React, { Component } from 'react'
import './Menu.css'
import * as url from '../../constant/Url'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

class Menu extends Component {
    constructor(props) {
        super(props);
        this.fontColor = this.props.applicationProfile.fontColor;
        this.backgroundColor = this.props.applicationProfile.color;

    }

    componentDidUpdate() { }

    render() {
        let renderedMenus = [];
        if (this.props.menus != null) {
            renderedMenus = this.props.menus;
        }

        return (

            <div className="side-menu" >
                <ul className="menu-ul " style={{ backgroundColor: this.backgroundColor }}>
                    <UserLink loggedUser={this.props.loggedUser} fontColor={this.fontColor} />
                    {renderedMenus.map(
                        (menu, i) => {
                            return <MenuItem
                                key={"menu_" + i}

                                fontColor={this.fontColor}
                                backgroundColor={this.backgroundColor}
                                menu={menu}
                                cart={this.props.cart}
                                activeCode={this.props.activeCode}
                                handleMenuCLick={this.props.handleMenuCLick} />
                        }
                    )
                    } </ul>
            </div>
        )
    }
}

function UserLink(props) {
    if (props.loggedUser == null) {
        return <></>
    }
    return (<li id="user-link">
        <Avatar user={props.loggedUser} />
        <div style={{ color: props.fontColor }} className="fill" >Welcome, {props.loggedUser.displayName} </div>
    </li>);
}

function Avatar(props) {
    const style = {
        margin: 'auto',
        textAlign: 'center',
        backgroundImage: 'url(' + url.baseImageUrl + "/" + props.user.profileImage + ')',
        backgroundSize: '50px 50px',
        width: '50px', height: '50px', borderRadius: '25px'
    };
    return <div style={{ padding: '5px' }}><div style={style}></div></div>
}

function MenuItem(props) {
    let menuClass = "fa fa-store-alt";
    const menu = props.menu;
    const fillStyle = {
        color: props.fontColor
    }
    const isActive = props.activeCode == menu.code;
    const isCart = menu.code == 'cart';
    const liStyle = isActive ? { backgroundColor: props.fontColor } : {};
    if (isActive) {
        fillStyle.color = props.backgroundColor;
    }
    if (menu.menuClass) {
        menuClass = menu.menuClass;
    }

    const menuName = isCart ? <span>{menu.name}&nbsp;<span class="badge badge-warning">{cartCount(props.cart)} </span></span> : <span>{menu.name}</span>;

    if (menu.url == "#") {
        return (<li style={liStyle} onClick={() => props.handleMenuCLick(menu)} className={isActive ? "active" : ""} key={menu.name}
            id={menu.name}> <Link key={menu.name + "LINK"} className="App-link"
                to="#" ><div style={fillStyle} className="fill" ><i className={menuClass}></i>&nbsp;{menuName} </div></Link></li >)
    }

    return (<li style={liStyle} className={isActive ? "menu-active" : ""} key={menu.name}
        id={menu.name}> <Link key={menu.name + "LINK"} className="App-link"
            to={menu.url} ><div style={fillStyle} className="fill" ><i className={menuClass}></i>&nbsp;{menuName} </div></Link></li >
    )
}

function cartCount(cart) {
    let count = 0;
    for (let i = 0; i < cart.length; i++) {
        count += cart[i].count
    }
    return count;
}

const mapStateToProps = state => {
    return {
        applicationProfile: state.userState.applicationProfile,
        cart: state.shopState.cart,
        loggedUser: state.userState.loggedUser,
    }
}
export default (connect(
    mapStateToProps
)(Menu));