import React, { Component } from 'react' 
import { byId } from '../../utils/ComponentUtil'

/**
 * JUST FOR INPUT !!!
 */
class InputField extends Component {
    constructor(props) {
        super(props);
        this.handleKeyup = (e) => {
            if(!this.validateNumber(e.target.value)){
                e.target.value = null;
                return;
            }
            if( this.props.id){
                var value = byId(this.props.id).value;

                if(this.props.type == "number"){
                    value = parseInt(value);
                }

                if(this.props.onEnterPress && e.keyCode == 13) {
                    this.props.onEnterPress(value, this.props.id);
                }else if (this.props.onKeyUp) {
                    this.props.onKeyUp(value, this.props.id);
                }
            }
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

    validateNumber(value) {
        if(this.props.type != "number"){
            return true;
        }
        console.log("value:", value, " isNaN(value): ",  isNaN(value));
        return value != "" && isNaN(value) == false;
    }

    componentDidMount() { 
        if (this.props.value && this.props.id) { 
            byId(this.props.id).value = this.props.value;
        }
    }

    render() {
        const type = this.props.type ? this.props.type : "text";
        const placeholder = this.props.placeholder ? this.props.placeholder : "";
        const name = this.props.name ? this.props.name : "";
        const style = this.props.style ? this.props.style : {};
        let className = type == 'checkbox'? '':"form-control";
        if(type == "number"){
            className = "form-control custom-input-number";
        }
        let inputField = <input style={style}
            className= {className}
            name={name}
            key={"KEY-input-" + this.props.id}
            id={this.props.id}
            type={type}
            onKeyUp={this.handleKeyup}
            placeholder={placeholder}
            checked={this.props.checked}
            onChange={this.onChange}

        />;

        if (this.props.disabled == true) {
            inputField = <input style={style}
                className="form-control"
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
                className="form-control"
                name={name}
                key={"KEY-input-" + this.props.id}
                id={this.props.id}
                type={type}
                onKeyUp={this.handleKeyup}
                placeholder={placeholder}
                onChange={this.onChange}
                checked={this.props.checked} />
        }

       
        return (
            <div className={"input-field "+(this.props.className?this.props.className:'')}>
                {inputField}
                {this.props.type == "radio" || this.props.type == "checkbox" ?
                 <span style={{ fontSize: '0.9em', margin:'4px'}}>{this.props.text} </span> : ""}
            </div>
        )
    }
}

export default InputField;