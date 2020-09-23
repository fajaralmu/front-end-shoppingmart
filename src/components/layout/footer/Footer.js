import React, { Component } from 'react';
import './Footer.css'
import { connect } from 'react-redux'

class Footer extends Component {

    constructor(props) {
        super(props);
        this.fontColor = this.props.applicationProfile.fontColor;
        this.backgroundColor = this.props.applicationProfile.color;
    }

    footerStyle() {
        return {
            color: this.fontColor,
            backgroundColor: this.backgroundColor
        };
    }

    render() {
        const year = new Date().getFullYear();
        const profile = this.props.applicationProfile ? this.props.applicationProfile : {};
        return (
            <div className="App-footer" style={this.footerStyle()}>
                <span className={profile.footerIconClassValue}></span>&nbsp;&nbsp;{profile.name} {year}
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
)(Footer));