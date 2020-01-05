import React, { Component } from 'react'
import '../css/Common.css'
import '../css/Input.css'

class ActionButton extends Component {
    constructor(props) {
        super(props);

        this.onClick = () => {
            if(this.props.onClick){
                this.props.onClick();
            }
        }
    }

    render() {
        return (
            <div className="action-button-wrapper"  >
                <button className="action-button rounded" id={this.props.id} onClick={this.onClick}>{this.props.text}</button>
            </div>
        )
    }

}

export default ActionButton;