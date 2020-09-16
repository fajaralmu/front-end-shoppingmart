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
    let content = <div><Label text={<span><i class="fas fa-shopping-cart"></i>Listed Product</span>} />
            <span style={{ margin: '5px' }} className="quantity-label">{count}</span>
            <span style={{ margin: '5px', color: 'yellow', backgroundColor: 'blue' }}
                className="quantity-label">{totalPrice}</span>
        </div>

        if (this.state.detail) {
            content = <h3 style={{ paddingLeft: '5px' }}>See Detail</h3>
        }

        return (
            <div onClick={this.handleClick} onMouseOver={this.showCartList} onMouseLeave={this.hideCartList} className="cart-info" >
                {content}


            </div>
        )
    }
}

export default CartInfo;