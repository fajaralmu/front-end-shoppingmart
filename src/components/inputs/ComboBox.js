import React, { Component } from 'react'
import { byId } from '../../utils/ComponentUtil'
import * as stringUtil from '../../utils/StringUtil'

class ComboBox extends Component {
    constructor(props) {
        super(props);
        this.handleOnChange = () => {
            if (this.props.onChange) {
                this.props.onChange(byId(this.props.id).value);
                console.log("x x x CHANGED VALUE: ", byId(this.props.id).value);
            }
            else {
                console.log("Not supported");
            }
        }

    }

    componentDidMount() {
        if (this.props.value) {
            byId(this.props.id).value = this.props.value;
        }
    }

    render() {
        let options = [];
        if (this.props.options) {
            options = this.props.options;
        }
        console.log("this.props.defaultValue: ", this.props.defaultValue)
        return (
            <div className="input-field ">
                <select value={this.props.defaultValue ? this.props.defaultValue : ""} 
                    className="form-control" id={this.props.id}
                    onChange={this.handleOnChange} >
                    {options.map(
                        option => {
                            return <option key={"opt_" + stringUtil.uniqueId()} value={option.value} >{option.text}</option>
                        }
                    )}
                </select>
            </div>
        )
    }
}

export default ComboBox;