import React, { Component } from 'react'
import '../css/Menu.css'
import '../css/Common.css'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'

class Menu extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        console.log("Menu props: ", this.props.menus);
        return (

            <div className = "side-menu" >
            < ul className = "menu-ul " > {
                this.props.menus.map(
                    e => {
                        return ( <li className={this.props.activeCode == e.code ?"active":""} key = { e.name }
                            id = { e.name } > < Link key = { e.name }
                            className = "App-link"
                            to = { e.url } ><div className="fill" >{ e.name } </div></Link></li >
                        )
                    }
                )
            } </ul>

            </div>

        )
    }
}

export default Menu;