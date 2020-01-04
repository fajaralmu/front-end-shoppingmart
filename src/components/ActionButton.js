import React, { Component } from 'react'
import '../css/Common.css'
import '../css/Input.css'

class ActionButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="action-button">
                <button id={this.props.id} onClick={this.props.onClick}>{this.props.text}</button>
            </div>
        )
    }

}

export default ActionButton;