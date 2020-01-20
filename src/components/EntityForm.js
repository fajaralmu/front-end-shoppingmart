import React, { Component } from 'react'
import '../css/Entity.css'
import '../css/Common.css'
import Label from './Label'
import InputField from './InputField';
import ActionButtons from './ActionButtons';
import { _byId } from '../utils/ComponentUtil'
import * as stringUtil from '../utils/StringUtil'

class EntityForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            managedEntity: null,
            activeId: null,
            formValues: {}
        }

        this.handleSubmit = () => {
            const updateMode = this.props.managedEntity != null;
            if (updateMode) {
                console.log("WILL UPDATE(props):", this.props.managedEntity);
                if (this.props.updateEntity) {
                    this.props.updateEntity(this.props.entityConfig.entityName, this.props.managedEntity, "update");
                }
            }

            const addNewMod = this.state.managedEntity != null;
            if(addNewMod){
                console.log("WILL SUBMIT NEW(state):", this.state.managedEntity);
                if (this.props.updateEntity) {
                    this.props.updateEntity(this.props.entityConfig.entityName, this.state.managedEntity, "addNew");
                }
            } 
            this.clear();
        }

        this.focusActiveId = () => {
            if (_byId(this.state.activeId)) {
                _byId(this.state.activeId).focus();
            }
        }

        this.onKeyUp = (value, id, propName) => {
            this.setState({ activeId: id });
            if (this.props.managedEntity) {
                this.props.managedEntity[propName] = value;
            } else {
                let managedEntity = this.state.managedEntity;
                if (!managedEntity) managedEntity = {};
                managedEntity[propName] = value;
                this.setState({ managedEntity: managedEntity });
            }

        }

        this.clear = () => {
            this.setState({ managedEntity: null });
            if (this.props.removeManagedEntity) {
                this.props.removeManagedEntity();
            }
        }
    }

    componentDidUpdate() {
        this.focusActiveId();
    }

    render() {

        let formData = this.props.entityConfig && this.props.entityConfig.formData ? this.props.entityConfig.formData : [];

        const entityExist = this.props.managedEntity != null || this.state.managedEntity;

        let formFields = <div className="entity-form  paper-shadow">
            {formData.map(
                data => {
                    let value = null;
                    if (entityExist) {
                        const entity = this.props.managedEntity ? this.props.managedEntity : this.state.managedEntity;
                        const propName = data.name;
                        if (propName.split(".").length > 1) {
                            value = entity[propName.split(".")[0]] ?
                                entity[propName.split(".")[0]][propName.split(".")[1]] : null;
                        } else {
                            value = entity[propName];
                        }
                    }

                    return (
                        <div key={"FORM-FIELD-" + stringUtil.uniqueId()}>
                            <Label text={data.lableName} />
                            <InputField onKeyUp={(value, id) => { this.onKeyUp(value, id, data.name) }} id={"input-for-" + data.name} value={value} type={data.inputType} placeholder={data.lableName} />
                        </div>
                    )
                }
            )}
            <ActionButtons buttonsData={[
                {
                    text: "Submit",
                    onClick: this.handleSubmit
                },
                {
                    text: "Clear",
                    onClick: this.clear
                }
            ]} />
        </div>

        return (
            <div className="entity-form-wrapper">
                {formFields}
            </div>
        )
    }
}
export default EntityForm;