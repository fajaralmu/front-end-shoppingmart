import React, { Component } from 'react'
import '../css/Input.css'
import '../css/Common.css'
import * as stringUtil from '../utils/StringUtil'
import * as componentUtil from '../utils/ComponentUtil'
import * as url from '../constant/Url'

class InputFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            base64Data: null
        }

        this.onChange = (e) => {
            componentUtil.toBase64(e.target, this, function (result, referer) {
                referer.setState({ base64Data: result });

            });
        }
    }

    componentDidUpdate() {
        if (this.props.onChange) {
            this.props.onChange(this.state.base64Data);
        }
    }

    render() {

        let displayImage = null;
        if (this.state.base64Data) {
            displayImage = <div className="input-image-wrapper">
                <img src={this.state.base64Data} width="60" height="60" />
            </div>;
        }
        if (this.props.value && this.props.value.trim() != "") {
            console.log("--this.props.value--",this.props.value);
            displayImage = <div className="input-image-wrapper">
                <img src={this.props.value} width="60" height="60" />
            </div>;
        }

        return (
            <div className="input-field" >
                <input onChange={this.onChange} type="file" key={"input_file_" + stringUtil.uniqueId()} />
                {displayImage}
            </div>
        )
    }
}

export default InputFile;

