import React, { Component } from 'react'
import '../css/Common.css'
import '../css/Input.css'

class ComboBox extends Component {
    constructor(props) {
        super(props);
        this.handleOnChange = () => {
            if (this.props.onChange)
                this.props.onChange(document.getElementById(this.props.id).value);
        }

    }

    componentDidMount() {
        if (this.props.value) {
            document.getElementById(this.props.id).value = this.props.value;
        }
    }

    render() {
        let options = [];
        if (this.props.options) {
            options = this.props.options;
        }
        return (
            <div className="input-field ">
                <select defaultValue={this.props.defaultValue?this.props.defaultValue:""} className="rounded" id={this.props.id} onChange={this.handleOnChange} >
                    {options.map(
                        option => { return <option value={option.value}>{option.text}</option> }
                    )}
                </select>
            </div>
        )
    }
}

export default ComboBox;