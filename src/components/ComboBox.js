import React, { Component } from 'react'
import '../css/Common.css'
import '../css/Input.css'
import {_byId} from '../utils/ComponentUtil'

class ComboBox extends Component {
    constructor(props) {
        super(props);
        this.handleOnChange = () => {
            if (this.props.onChange){
                this.props.onChange(_byId(this.props.id).value);
                console.log("x x x CHANGED VALUE: ",_byId(this.props.id).value);
            }
            else {
                console.log("Not supported");
            }
        }

    }

    componentDidMount() {
        if (this.props.value) {
            _byId(this.props.id).value = this.props.value;
        }
    }

    render() {
        let options = [];
        if (this.props.options) {
            options = this.props.options;
        }
        return (
            // <div className="input-field ">
            <select defaultValue={this.props.defaultValue ? this.props.defaultValue : ""} className="rounded" id={this.props.id}
                onChange={this.handleOnChange} >
                {options.map(
                    option => { return <option key={"opt" + option.value} value={option.value}>{option.text}</option> }
                )}
            </select>
            //  </div>
        )
    }
}

export default ComboBox;