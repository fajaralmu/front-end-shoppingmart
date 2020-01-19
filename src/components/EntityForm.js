import React, { Component } from 'react'
import '../css/Entity.css'
import '../css/Common.css'
import Label  from './Label'
import InputField from './InputField';
import ActionButtons from './ActionButtons';

class EntityForm extends Component {
    constructor(props) {
        super(props);

    }

    render() {

        let formData = this.props.formData ? this.props.formData : [];

        let formFields = <div class="entity-form  paper-shadow">
            {formData.map(
                data => {
                    return (
                        <div>
                            <Label text={data.lableName} />
                            <InputField type={data.inputType} placeholder={data.lableName} />
                        </div>
                    )
                }
            )}
            <ActionButtons buttonsData={[
                {
                    text:"Submit"
                },
                {
                    text:"Clear"
                }
            ]}/>
        </div>

        return (
            <div className="entity-form-wrapper">
                {formFields}
            </div>
        )
    }
}
export default EntityForm;