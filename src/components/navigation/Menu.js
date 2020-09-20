import React, { Component } from 'react'
import './Menu.css'
import * as url from '../../constant/Url'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
import { connect } from 'react-redux'

class Menu extends Component {
    constructor(props) {
        super(props);
        this.fontColor = this.props.applicationProfile.fontColor;
        this.backgroundColor = this.props.applicationProfile.color;

    }

    componentDidUpdate() { }

    render() {
        let userLink = <></>;
        if (this.props.loggedUser != null) {
            userLink = 
            <li id="user-link">
                <Avatar user={this.props.loggedUser} /> 
                <div style={{ color: this.fontColor }} className="fill" >Welcome, {this.props.loggedUser.displayName} </div>
            </li>
        }

        let renderedMenus = [];
        if (this.props.menus != null) {
            renderedMenus = this.props.menus;
        }

        return (

            <div className="side-menu" >
                <ul className="menu-ul " style={{ backgroundColor: this.backgroundColor }}>
                    {userLink}
                    {
                        renderedMenus.map(
                           ( menu, i) => {
                                return <MenuItem
                                    key={"menu_"+i}
                                    
                                    fontColor={this.fontColor}
                                    backgroundColor={this.backgroundColor} 
                                    menu={menu}
                                    activeCode={this.props.activeCode}
                                    handleMenuCLick={this.props.handleMenuCLick} />
                            }
                        )
                    } </ul>

            </div>

        )
    }
}

function Avatar(props) {
    const style = {
        margin: 'auto',
        textAlign: 'center',
        backgroundImage: 'url(' + url.baseImageUrl + "/" + props.user.profileImage + ')',
        backgroundSize: '50px 50px',
        width: '50px', height: '50px', borderRadius: '25px'
    };
    return <div style={{padding: '5px'}}><div style={style}></div></div>
}

function MenuItem(props) {
    let menuClass = "fa fa-store-alt";
    const menu = props.menu;
    const fillStyle = {
        color: props.fontColor
    }
    const isActive = props.activeCode == menu.code;
    const liStyle = isActive ? { backgroundColor: props.fontColor } : {};
    if (isActive) {
        fillStyle.color = props.backgroundColor;
    }
    if (menu.menuClass) {
        menuClass = menu.menuClass;
    }
    if (menu.url == "#") {
        return (<li style={liStyle} onClick={() => props.handleMenuCLick(menu)} className={isActive ? "active" : ""} key={menu.name}
            id={menu.name}> <Link key={menu.name} className="App-link"
                to="#" ><div style={fillStyle} className="fill" ><i className={menuClass}></i>&nbsp;{menu.name} </div></Link></li >)
    }

    return (<li style={liStyle} className={isActive ? "menu-active" : ""} key={menu.name}
        id={menu.name}> <Link key={menu.name} className="App-link"
            to={menu.url} ><div style={fillStyle} className="fill" ><i className={menuClass}></i>&nbsp;{menu.name} </div></Link></li >
    )
}

const mapStateToProps = state => { 
    return {
        applicationProfile: state.userState.applicationProfile,
    }
}

export default (connect(
    mapStateToProps
)(Menu));