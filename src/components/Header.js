import React, { Component } from 'react';
import '../css/Header.css'

class Header extends Component{

    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="App-header">
                {this.props.title}
            </div>
        )
    }

}

export default Header;