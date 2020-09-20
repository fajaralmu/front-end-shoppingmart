import React, { Component } from 'react';
import './Header.css' 
import CartInfo from '../../cart/CartInfo';

class Header extends Component{

    constructor(props){
        super(props);
        this.handleClick = ()=> {
            
        }
    }

    render(){
        let cartInfo = this.props.enableShopping ? 
        <CartInfo onClick={this.handleClick} cart={this.props.cart} />:
        null;

        return (
            <div className="App-header">
                <h2>{this.props.applicationProfile.name}</h2>
                {cartInfo}
            </div>
        )
    }

}

export default Header;