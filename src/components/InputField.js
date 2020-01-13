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
        this.handleKeyup = (e) => {
            if (this.props.onKeyUp && this.props.id)
                this.props.onKeyUp(e.target.value, this.props.id);
        }

        this.onChange = (e) => {
            if (this.props.type == "date") {
                this.handleKeyup();
            }
            if(this.props.id && this.props.type=="checkbox"){
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
        let style=this.props.style?this.props.style:{};
        return (
            <div className="input-field ">
                {this.props.disabled == true ?
                    <input style={style} className="rounded" name={name} key={"KEY-input-" + this.props.id} id={this.props.id}
                        type={type} onKeyUp={this.handleKeyup} placeholder={placeholder} checked={this.props.checked} disabled />

                    : <input style={style}  onChange={this.onChange} name={name} key={"KEY-input-" + this.props.id} checked={this.props.checked} id={this.props.id}
                        type={type} onKeyUp={this.handleKeyup} placeholder={placeholder} />}
                {this.props.type == "radio" || this.props.type == "checkbox" ? this.props.text : ""}
            </div>
        )
    }
}

export default InputField;