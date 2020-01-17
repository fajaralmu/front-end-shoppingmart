import React, { Component } from 'react';
import '../css/Header.css'
import CartInfo from './CartInfo';

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
                {this.props.title}
                {cartInfo}
            </div>
        )
    }

}

export default Header;