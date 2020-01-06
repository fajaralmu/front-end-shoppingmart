import React, { Component } from 'react'
import '../css/NavButton.css'

class NavButton extends Component{

    constructor(props){
        super(props);

    }

    render(){

        let className = "nav-button";
        if(this.props.active){
            className = className+" active";
        }
        return(
            <button id={"btn-"+this.props.value} className={className} onClick={this.props.buttonClick}>{this.props.text }</button>
        )
    }

}

export default NavButton;