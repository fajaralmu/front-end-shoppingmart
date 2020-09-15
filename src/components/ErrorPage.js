import React, { Component } from 'react'
import '../css/Error.css'
import '../css/Common.css'

class ErrorPage extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        document.title = "Error Page";
        return (
            <div className="section-container">
                <h2>{this.props.message}</h2>
            </div>
        )
    }
}
export default ErrorPage;