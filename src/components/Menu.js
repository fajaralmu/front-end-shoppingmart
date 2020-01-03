import React, { Component } from 'react'
import './Menu.css'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'

class Menu extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        console.log("Menu props: ", this.props.menus);
        return (
            
                <div className="side-menu">
                    <ul className="menu-ul">
                        {this.props.menus.map(
                            e => {
                                return (
                                   <li key={e.name} id={e.name}><Link key={e.name} className="App-link" to={e.url}>{e.name}</Link></li>
                                )
                            }
                        )}
                    </ul>

                </div>
            
        )
    }
}

export default Menu;