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

        let formData = this.props.entityConfig && this.props.entityConfig.formData ? this.props.entityConfig.formData : [];

        const entityExist = this.props.managedEntity != null;

        let formFields = <div className="entity-form  paper-shadow">
            {formData.map(
                data => {

                    let value = null;

                    if(entityExist){
                       
                        const entity = this.props.managedEntity;
                        const propName = data.name;
                         if(propName.split(".").length>1){
                             value = entity[propName.split(".")[0]]?
                                entity[propName.split(".")[0]][propName.split(".")[1]]:null;
                         }else{
                            value = entity[propName];
                         } 
                         console.log("PROPNAME: ",propName,"VALUE:",value)
                    }
                   
                    return (
                        <div>
                            <Label text={data.lableName} />
                            <InputField value={value} type={data.inputType} placeholder={data.lableName} />
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