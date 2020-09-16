import React, { Component } from 'react'
import './Menu.css'
import * as url from '../../constant/Url'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom' 

class Menu extends Component {
    constructor(props) {
        super(props);

    }

    componentDidUpdate() {
    }

    render() {
        let userLink = "";
        if (this.props.loggedUser != null) {
            userLink = <li id="user-link">
                <div style={{
                    margin: 'auto',
                    textAlign: 'center',
                    backgroundImage: 'url('+url.baseImageUrl + "/" + this.props.loggedUser.profileImage +')',
                    backgroundSize: '50px 50px',
                    width: '50px', height: '50px', borderRadius: '25px'
                }}> </div>
                <div className="fill" >Welcome, {this.props.loggedUser.displayName} </div>
            </li>
        }

        let renderedMenus = [];
        if (this.props.menus != null) {
            renderedMenus = this.props.menus;
        }

        return (

            <div className="side-menu" >
                < ul className="menu-ul " >
                    {userLink}
                    {
                        renderedMenus.map(
                            e => {
                               return <MenuItem menu={e} activeCode={this.props.activeCode} handleMenuCLick={this.props.handleMenuCLick} />
                            }
                        )
                    } </ul>

            </div>

        )
    }
}

function MenuItem(props){
    let menuClass = "fa fa-store-alt";
    const menu = props.menu;
    if (menu.menuClass) {
        menuClass = menu.menuClass;
    }
    if (menu.url == "#") {
        return (<li onClick={() => props.handleMenuCLick(menu)} className={props.activeCode == menu.code ? "active" : ""} key={menu.name}
            id={menu.name}> <Link key={menu.name} className="App-link"
                to="#" ><div className="fill" ><i class={menuClass}></i>&nbsp;{menu.name} </div></Link></li >)
    }
    return (<li className={ props.activeCode == menu.code ? "menu-active" : ""} key={menu.name}
        id={menu.name}> <Link key={menu.name} className="App-link"
            to={menu.url} ><div className="fill" ><i class={menuClass}></i>&nbsp;{menu.name} </div></Link></li >
    )
}

export default Menu;