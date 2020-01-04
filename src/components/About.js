import React, { Component } from 'react'
import '../css/About.css'
import '../css/Common.css'

class About extends Component {

    constructor(props) {
        super(props)

    }

    render() {
        return (
            <div className="section-container about-section">
                <h2>About Us</h2> 
                <p>Universal good shop</p>
                <p>Friendly shopping mart application</p>
                <p>Trikarso, Sruweng, Kebumen</p>
                <p>fajaralmunawwar@yahoo.com</p>
            </div>
        )
    }
}

export default About;