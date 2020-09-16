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
                                let menuClass = "fa fa-store-alt";
                                if (e.menuClass) {
                                    menuClass = e.menuClass;
                                }
                                if (e.url == "#") {
                                    return (<li onClick={() => this.props.handleMenuCLick(e)} className={this.props.activeCode == e.code ? "active" : ""} key={e.name}
                                        id={e.name}> <Link key={e.name} className="App-link"
                                            to="#" ><div className="fill" ><i class={menuClass}></i>&nbsp;{e.name} </div></Link></li >
                                    )
                                }
                                return (<li className={this.props.activeCode == e.code ? "menu-active" : ""} key={e.name}
                                    id={e.name}> <Link key={e.name} className="App-link"
                                        to={e.url} ><div className="fill" ><i class={menuClass}></i>&nbsp;{e.name} </div></Link></li >
                                )
                            }
                        )
                    } </ul>

            </div>

        )
    }
}

export default Menu;