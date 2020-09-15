import React, { Component } from 'react'  
import * as stringUtil from '../../utils/StringUtil'
import * as componentUtil from '../../utils/ComponentUtil'   
import ActionButton from '../ActionButton';

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

        this.removeImage = () => {
            if(this.props.removeImage){
                this.props.removeImage();
            }
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
            
            displayImage = <div className="input-image-wrapper">
                <img src={this.props.value} width="60" height="60" />
                <ActionButton text="cancel" status="danger" onClick={this.removeImage} />
            </div>;
        }

        return (
            <div className="input-field" >
                <input className="form-control" accept="image/*" onChange={this.onChange} 
                    type="file" key={"input_file_" + stringUtil.uniqueId()} />
                {displayImage}
            </div>
        )
    }
}

export default InputFile;

