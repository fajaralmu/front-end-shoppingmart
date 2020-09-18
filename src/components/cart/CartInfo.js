import React, { Component } from 'react'
import * as cartCss from './Cart.css'
import Label from '../container/Label';
import * as stringUtil from '../../utils/StringUtil'

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
            if (this.props.onClick) {
                this.props.onClick();
            }
        }

        this.caculateTotalPrice = () => {
            let totalPrice = 0;

            let cart = this.props.cart;
            for (let i = 0; i < cart.length; i++) {
                if (cart[i].product == null) continue;

                totalPrice += (cart[i].product.price * cart[i].count);
            }
            return stringUtil.beautifyNominal(totalPrice) + ",-";
        }
    }

    render() {

        let cart = this.props.cart;

        let count = 0;
        for (let i = 0; i < cart.length; i++) {
            const cartItem = cart[i];
            count += cartItem.count
        }
        let totalPrice = this.caculateTotalPrice(); 

        return (
            <div onClick={this.handleClick} onMouseOver={this.showCartList} onMouseLeave={this.hideCartList} className="cart-info" >
               <CartInfoContent detail={this.state.detail} count={count} totalPrice={totalPrice} />
            </div>
        )
    }
}

function CartInfoContent(props) {
    let content;

    if (props.detail) {
        content = <h3 style={{ paddingLeft: '5px' }}>See Detail</h3>
    } else {
        content = <div>
            <Label text={<span><i className="fas fa-shopping-cart"></i>Listed Product</span>} />
            <span style={{ margin: '5px' }} className="quantity-label">{props.count}</span>
            <span style={{ margin: '5px', color: 'yellow', backgroundColor: 'blue' }} className="quantity-label">{props.totalPrice}</span>
        </div>
    }

    return content;
}

export default CartInfo;