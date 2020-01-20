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
                this.props.onKeyUp(_byId(this.props.id).value, this.props.id);
        }

        this.onChange = () => {
            if (this.props.type == "date") {
                this.handleKeyup();
            }
            if (this.props.id && this.props.type == "checkbox") {
                this.props.onChange(this.props.id);
            }
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
        let name = this.props.name ? this.props.name : "";
        let style = this.props.style ? this.props.style : {}; 

        let inputField = <input style={style}
            className="rounded"
            name={name}
            key={"KEY-input-" + this.props.id}
            id={this.props.id}
            type={type}
            onKeyUp={this.handleKeyup}
            placeholder={placeholder}
            checked={this.props.checked} 
            
            />;

        if (this.props.disabled == true) {
            inputField = <input style={style}
                className="rounded"
                onChange={this.onChange}
                name={name} key={"KEY-input-" + this.props.id}
                checked={this.props.checked}
                id={this.props.id}
                type={type} onKeyUp={this.handleKeyup}
                placeholder={placeholder}
                 
                disabled />
        }

        if (type == "textarea") {
            inputField = <textarea style={style}
                className="rounded"
                name={name}
                key={"KEY-input-" + this.props.id}
                id={this.props.id}
                type={type}
                onKeyUp={this.handleKeyup}
                placeholder={placeholder}
               
                checked={this.props.checked} />
        }

        return (
            <div className="input-field ">
                {inputField}
                {this.props.type == "radio" || this.props.type == "checkbox" ? this.props.text : ""}
            </div>
        )
    }
}

export default InputField;