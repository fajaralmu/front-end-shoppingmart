import React, { Component } from 'react';
import './Header.css'
import CartInfo from '../../cart/CartInfo';
import { connect } from 'react-redux'

class Header extends Component {

    constructor(props) {
        super(props);
        
        this.handleClick = () => {

        }
    }

    render() {
        let cartInfo = this.props.enableShopping ?
            <CartInfo mainAppUpdated={this.props.mainAppUpdated} onClick={this.handleClick} /> :
            null;  
        return (
            <div className="App-header" style={{color:this.props.applicationProfile.color}}>
                <h2>{this.props.applicationProfile.name}</h2>
                {cartInfo}
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        applicationProfile: state.userState.applicationProfile,
    }
}

export default (connect(
    mapStateToProps
)(Header));