import React, { Component } from 'react';
import './Header.css'
import { connect } from 'react-redux'

class Header extends Component {

    constructor(props) {
        super(props);

        this.handleClick = () => { }
    }

    render() {

        return (
            <div className="App-header" style={{ color: this.props.applicationProfile.color }}>
                {this.props.showOptionButton ? 
                <button style={{position:'fixed', left:'0'}} onClick={this.props.showMenu} className="btn"><i className="fa fa-align-justify"></i>  </button> : 
                <button style={{position:'fixed', left:'0'}} onClick={this.props.hideMenu} className="btn"><i className="fa fa-angle-double-left"></i>  </button>}
                <h2>{this.props.applicationProfile.name}</h2>
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