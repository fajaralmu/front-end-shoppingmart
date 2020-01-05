import React, { Component } from 'react'
import '../css/Menu.css'
import '../css/Common.css'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'

class Menu extends Component {
    constructor(props) {
        super(props);

    }

    componentDidUpdate() {
        console.log("Menus props: ", this.props.menus)
    }

    render() {
        let userLink = "";
        if (this.props.loggedUser != null) {
            userLink = <li id="user-link">
                <div className="fill" >Welcome, {this.props.loggedUser.displayName} </div>
            </li>
        }

        let renderedMenus = [];
        if (this.props.menus != null) {
            renderedMenus = this.props.menus;
        }
        console.log("Menu props: ", this.props.menus);
        return (

            <div className="side-menu" >
                < ul className="menu-ul " >
                    {userLink}
                    {
                        renderedMenus.map(
                            e => {
                                if (e.url == "#") {
                                    return (<li onClick={() => this.props.handleMenuCLick(e)} className={this.props.activeCode == e.code ? "active" : ""} key={e.name}
                                        id={e.name}> <Link key={e.name}
                                            className="App-link"
                                            to="#" ><div className="fill" >{e.name} </div></Link></li >
                                    )
                                }
                                return (<li className={this.props.activeCode == e.code ? "active" : ""} key={e.name}
                                    id={e.name}> <Link key={e.name}
                                        className="App-link"
                                        to={e.url} ><div className="fill" >{e.name} </div></Link></li >
                                )
                            }
                        )
                    } </ul>

            </div>

        )
    }
}

export default Menu;