import React, { Component } from 'react'
import '../css/Common.css'
import '../css/Input.css'
import { _byId } from '../utils/ComponentUtil'

/**
 * JUST FOR INPUT !!!
 */
class InputField extends Component {
    constructor(props) {
        super(props);
        this.handleKeyup = () => {
            if (this.props.onKeyUp && this.props.id)
                this.props.onKeyUp(_byId(this.props.id).value);
        }

        this.onChange = () => {
            if (this.props.onChange && this.props.id) {
                this.props.onChange();
            }
        }

    }

    componentDidMount() {
        if (this.props.value && this.props.id) {
            _byId(this.props.id).value = this.props.value;
        }
    }

    render() {
        let type = this.props.type ? this.props.type : "text";
        let placeholder = this.props.placeholder ? this.props.placeholder : "";
        return (
            <div className="input-field ">
                {this.props.disabled == true ?
                    <input className="rounded" name={this.props.name?this.props.name:""}  id={this.props.id} type={type} onKeyUp={this.handleKeyup} placeholder={placeholder} disabled />
                    : <input onChange={this.onChange} name={this.props.name?this.props.name:""} id={this.props.id} type={type} onKeyUp={this.handleKeyup} placeholder={placeholder} />}
                {this.props.type == "radio" ? this.props.text : ""}
            </div>
        )
    }
}

export default InputField;