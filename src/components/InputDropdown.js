import React, { Component } from 'react'
import '../css/Common.css'
import '../css/Input.css'

/**
 * JUST FOR INPUT !!!
 */
class InputDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            focus:true
        }

        this.handleKeyup = () => {
            if (this.props.onKeyUp && this.props.id)
                this.props.onKeyUp(document.getElementById(this.props.id).value);
        }

        this.onBlur = () => {
            console.log("blur");
        }

        this.onSelect = (dataValue) => {
            console.log("select value:", dataValue);
            if (this.props.onSelect) { this.props.onSelect(dataValue); }
        }
    }

    componentDidMount() {
        if (this.props.value && this.props.id) {
            document.getElementById(this.props.id).value = this.props.value;
        }
    }

    render() {
        let dropdownList = [];
        let dropdownComponent = "";
        if (this.state.focus && this.props.dropdownList && this.props.dropdownList.length > 0) {
            dropdownList = this.props.dropdownList;
            dropdownComponent = <div className="dropdown">
                {dropdownList.map(
                    data => {
                        return (<div onClick={() => this.onSelect(data.value)} className="dropdown-item clickable">{data.text}</div>)
                    })}
            </div>
        }
        let type = this.props.type ? this.props.type : "text";
        let placeholder = this.props.placeholder ? this.props.placeholder : "";

        return (
            <div onBlur={this.onBlur} className="dropdown-wrapper input-field">
                <input onFocus={()=>this.setState({focus:true})} id={this.props.id} type={type} onKeyUp={this.handleKeyup} placeholder={placeholder} />
                {dropdownComponent}
            </div>
        )
    }
}

export default InputDropdown;