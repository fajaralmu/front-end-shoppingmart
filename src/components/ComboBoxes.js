import React, { Component } from 'react'
import '../css/Common.css'
import '../css/Input.css'
import ComboBox from './ComboBox';

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
                    <ComboBox defaultValue={comboBox.defaultValue ? comboBox.defaultValue : ""}
                        key={"key_" + comboBox.id} id={comboBox.id}
                        onChange={comboBox.handleOnChange}
                        options={options} />
                )
            })}

        </div>)
    }
}

export default ComboBoxes;