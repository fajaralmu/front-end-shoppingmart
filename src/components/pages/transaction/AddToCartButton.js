import React, { Component } from 'react'   
import ActionButton from '../../buttons/ActionButton';
 

class AddToCartButton extends Component {

    render(){
        return <ActionButton status="info btn-lg" text={<i className="fa fa-cart-plus"></i>} onClick={this.props.onClick} />
     }

}
export default AddToCartButton;