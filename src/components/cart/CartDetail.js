import React, { Component } from 'react' 
import * as cartCss from './Cart.css' 
import ContentTitle from '../container/ContentTitle';
import * as stringUtil from '../../utils/StringUtil'
import InstantTable from '../container/InstantTable';
import { connect } from 'react-redux'
import * as url from '../../constant/Url'
import Label from '../container/Label';

class CartDetail extends Component {
    constructor(props) {
        super(props); 
    }

    componentWillMount() {
        document.title = "My Cart";
        this.props.setMenuCode('cart');
    }

    render() {
        let cart = this.props.enableShopping ? this.props.cart : [];  
       
        return (
            <div className="section-container">
                <ContentTitle title="My Cart" iconClass="fas fa-shopping-cart"/>
                <div className=" cart-bg">
                    <div className="cart-container paper-shadow" >
                       <CartItemList cart={cart} />
                    </div>
                </div>
            </div>
        )
    }
}

function CartItemList (props ) {
    let grandTotalPrice = 0;
    let cartRows = [
        { values: ["No", "Name", "Qty", "Unit", "@Price", "Total Price"] }
    ]
    let number = 0;
    const cart = props.cart;

    for (let i = 0; i < cart.length; i++) {
        let cartItem = cart[i];
        if (!cartItem.product) {
            continue;
        }

        const name = cartItem.product.name;
        const count = (cartItem.count);
        const price = (cartItem.product.price);
        const productImageUrl = cartItem.product.imageUrl;
        const imageUrl = url.baseImageUrl + productImageUrl.split("~")[0];
        let totalPrice = price * count;

        totalPrice = (totalPrice);

        grandTotalPrice += totalPrice;
        number++;
        cartRows.push({
            values: [
                number, 
               <div style={{textAlign:'center'}}><img src={imageUrl} width="50" height="50"/><Label text={name} /></div> , 
                stringUtil.beautifyNominal(count),
                cartItem.product.unit.name,
                stringUtil.beautifyNominal(price),
                stringUtil.beautifyNominal(totalPrice)
            ]
        })
    }

    cartRows.push({
        values: [
            "Total Price", <b>{stringUtil.beautifyNominal(grandTotalPrice)}</b>
        ],
        CS: [5, 1]
    })
    let cartItemList = cart.length > 0 ? <InstantTable style={{ fontFamily: 'Arial Narrow', width: '100%' }}
            rows={cartRows} /> :
            <h3 style={{ margin: 'auto' }}>You don't have any list</h3>;
    return cartItemList;
}

const mapStateToProps = state => {
    return { 
        cart: state.shopState.cart
    }
}
export default connect(
    mapStateToProps, 
)(CartDetail);