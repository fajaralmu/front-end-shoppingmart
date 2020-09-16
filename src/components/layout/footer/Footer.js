import React, { Component } from 'react';
import '../footer/Footer.css'

class Footer extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const year = new Date().getFullYear();
        const profile = this.props.applicationProfile ? this.props.applicationProfile : {};
        return (
            <div className="App-footer">
                <span class="fas fa-coffee"></span>&nbsp;&nbsp;{profile.name} {year}
            </div>
        )
    }

}

export default Footer;