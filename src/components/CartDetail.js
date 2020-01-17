import React, { Component } from 'react'
import '../css/Common.css'
import '../css/Cart.css'
import ContentTitle from './ContentTitle';
import * as stringUtil from '../utils/StringUtil'
import InstantTable from './InstantTable';

class CartDetail extends Component {
    constructor(props) {
        super(props);

    }

    componentWillMount() {
        document.title = "My Cart";
        this.props.setMenuCode('cart');
    }

    render() {
        let cart = this.props.cart;
        let grandTotalPrice = 0;
        let cartRows = [
            { values: ["No", "Name", "Qty", "@Price", "Total Price"] }
        ]
        let number = 0;
        for (let i = 0; i < cart.length; i++) {
            let cartItem = cart[i];
            if (!cartItem.product) {
                continue;
            }

            const name = cartItem.product.name;
            const count = (cartItem.count);
            const price = (cartItem.product.price);
            let totalPrice = price * count;

            totalPrice = (totalPrice);

            grandTotalPrice += totalPrice;
            number++;
            cartRows.push({
                values: [
                    number, name, stringUtil.beautifyNominal(count),
                    stringUtil.beautifyNominal(price),
                    stringUtil.beautifyNominal(totalPrice)
                ]
            })
        }

        cartRows.push({
            values: [
                "Total Price", stringUtil.beautifyNominal(grandTotalPrice)
            ],
            CS: [4, 1]
        })

        let cartItemList = cart.length > 0 ? <InstantTable style={{width:'100%'}} rows={cartRows} /> :
            <h3 style={{ margin: 'auto' }}>You don't have any list</h3>;

        return (
            <div className="section-container">
                <ContentTitle title="My Cart" />
                <div className="cart-container" >
                    {cartItemList}
                </div>
            </div>
        )
    }
}

export default CartDetail;