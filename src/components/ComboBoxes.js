import React, { Component } from 'react'
import '../css/Common.css'
import '../css/Input.css'

class ComboBoxes extends Component {
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
        let comboBoxes = [];
        if (this.props.values) { comboBoxes = this.props.values; }
        return (<div className="input-field ">
            {comboBoxes.map(comboBox => {
                let options = [];
                if (comboBox.options) { options = comboBox.options; }
                return (
                    <select defaultValue={comboBox.defaultValue ? comboBox.defaultValue : ""} className="rounded" 
                    key={comboBox.id} 
                    onChange={comboBox.handleOnChange?comboBox.handleOnChange:()=>console.log("not supported")} >
                        {options.map(
                            option => { return <option key={comboBox.id+"-k-"+option.value} value={option.value}>{option.text}</option> }
                        )}
                    </select>
                )
            })}

        </div>)
    }
}

export default ComboBoxes;