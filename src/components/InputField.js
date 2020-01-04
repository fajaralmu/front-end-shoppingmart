import React, { Component } from 'react'
import '../css/Common.css'
import '../css/Input.css'

class InputField extends Component {
    constructor(props) {
        super(props); 
        this.handleKeyup = () => {
            this.props.onKeyUp(document.getElementById(this.props.id).value);
        }
    }

    render() {
        let type = this.props.type ? this.props.type : "text"; 
        return (
            <div className="input-field">
                <input id={this.props.id} type={type} onKeyUp={this.handleKeyup} />
            </div>
        )
    }
}

export default InputField;