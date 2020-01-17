import React, { Component } from 'react'
import '../css/Cart.css'
import '../css/Common.css'
import Label from './Label';

class CartInfo extends Component {
    constructor(props) {
        super(props);
        this.state={
            firstLoad:true,
            detail:false
        }

        this.showCartList = (e) => {
            this.setState({detail:true})
        }
        this.hideCartList = (e) => {
            this.setState({detail:false})
        }
    } 

    render() {

        console.log("----show cart: ",this.state.detail);

        let cart = this.props.cart;

        let count = 0;
        for (let i = 0; i < cart.length; i++) {
            const cartItem = cart[i];
            count += cartItem.count
        } 
        let detail = null;

        if(this.state.detail){
            detail = <div class="cart-detail">
                {cart.map(
                    (cartItem, i) => {
                        if(!cartItem.product){
                           return null;
                        }
                        return(
                            <div style={{padding:'3px'}} key={"cart-item-"+i}>{cartItem.product.name}.{cartItem.count}</div>
                        )
                    }
                )}
            </div>
        }

        return (
            <div onMouseOver={this.showCartList} onMouseLeave={this.hideCartList}  className="cart-info" >
                <Label text="Listed Product" />
                <span style={{margin:'5px'}} className="quantity-label">{count}</span>
                {detail}
            </div>
        )
    }
}

export default CartInfo;