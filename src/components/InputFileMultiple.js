import React, { Component } from 'react';
import * as url from '../constant/Url'
import * as stringUtil from '../utils/StringUtil'
import InputFile from './InputFile';
import ActionButton from './ActionButton';

class InputFileMultiple extends Component {
    constructor(props) {
        super(props);

        this.handleAddMoreFile = () => {
            if(this.props.addMoreImage){
                this.props.addMoreImage();
            }
        }

    }
    render() {

        let inputFields = [];
        if (this.props.inputFilesData) {
            inputFields = this.props.inputFilesData;
        }



        return (
            <div>
                {inputFields.map(
                    inputFileData => {
                        let value = inputFileData.value;
                        return (
                            <InputFile
                                key={stringUtil.uniqueId() + "_multiple_file_item"}
                                onChange={(base64) => {
                                    if (inputFileData.onChange)
                                        inputFileData.onChange(base64)
                                }}
                                value={value && value.includes("base64") ? value : value ?
                                    url.baseImageUrl + value : null}
                                id={inputFileData.inputId}
                                removeImage={() => {
                                    if (inputFileData.removeImage)
                                        inputFileData.removeImage()
                                }
                                }

                            />
                        )
                    }
                )}
                <ActionButton text="add more" onClick={this.handleAddMoreFile} />
            </div>
        )
    }
}

export default InputFileMultiple;