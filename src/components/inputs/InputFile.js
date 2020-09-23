import React, { Component } from 'react'
import * as stringUtil from '../../utils/StringUtil'
import * as componentUtil from '../../utils/ComponentUtil'
import ActionButton from '../buttons/ActionButton';

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
            if (this.props.removeImage) {
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
            displayImage =
                <DisplayedImage enableRemove={false} value={this.state.base64Data} />
        }
        if (this.props.value && this.props.value.trim() != "") {
            displayImage = <DisplayedImage enableRemove={true} value={this.props.value} removeImage={this.removeImage} />

        }

        return (
            <div className="row" >
                <div className="col-12">
                    <input className="form-control" accept="image/*" onChange={this.onChange}
                        type="file" key={"input_file_" + stringUtil.uniqueId()} />
                </div>
                <div className="col-12">
                    {displayImage}
                </div>
            </div>
        )
    }
}


function DisplayedImage(props) {
    return (<div className="input-image-wrapper row">
        <div className="col-6">
            <img src={props.value} width="60" height="60" />
        </div>
        <div className="col-6">
            {props.enableRemove ? <ActionButton text={<i className="fas fa-minus-circle" ></i>} status="danger btn-sm" onClick={props.removeImage} /> : null}
        </div></div>)
}

export default InputFile;

