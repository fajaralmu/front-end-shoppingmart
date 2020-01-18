import React, { Component } from 'react'
import '../css/Cart.css'
import '../css/Common.css'
import Label from './Label';

class CartInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstLoad: true,
            detail: false
        }

        this.showCartList = (e) => {
            this.setState({ detail: true })
        }
        this.hideCartList = (e) => {
            this.setState({ detail: false })
        }
        this.handleClick = (e) => {
            if(this.props.onClick){
                this.props.onClick();
            }
        }
    }

    render() { 

        let cart = this.props.cart;

        let count = 0;
        for (let i = 0; i < cart.length; i++) {
            const cartItem = cart[i];
            count += cartItem.count
        }

        let content = <div><Label text="Listed Product" />
            <span style={{ margin: '5px' }} className="quantity-label">{count}</span></div>

        if(this.state.detail){
            content = <h3 style={{paddingLeft:'5px'}}>See Detail</h3>
        }

        return (
            <div onClick={this.handleClick} onMouseOver={this.showCartList} onMouseLeave={this.hideCartList} className="cart-info" >
                {content}


            </div>
        )
    }
}

export default CartInfo;