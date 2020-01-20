import React, { Component } from 'react'
import '../css/Entity.css'
import '../css/Common.css'
import Label from './Label'
import InputDropdown from './InputDropdown'
import InputField from './InputField';
import ActionButtons from './ActionButtons';
import { _byId } from '../utils/ComponentUtil'
import * as stringUtil from '../utils/StringUtil'
import { withRouter } from 'react-router';
import * as actions from '../redux/actionCreators'
import { connect } from 'react-redux'
import InputFile from './InputFile'
import * as url from '../constant/Url'

class EntityForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            managedEntity: null,
            activeId: null,
            formValues: {},
            dropdownList: {},
            dropdownValues: {},
            selectedEntities: {},
            base64Data: {}
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
            if (addNewMod) {
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
            this.setState({
                managedEntity: null,
                dropdownList: {},
                dropdownValues: {},
                selectedEntities: {},
                base64Data: {}
            });
            if (this.props.removeManagedEntity) {
                this.props.removeManagedEntity();
            }
        }

        this.populateDropdown = (entityname, fieldname, fieldvalue) => {
            const request = {
                entityName: entityname,
                fieldName: fieldname.split(".")[1],
                fieldValue: fieldvalue
            }
            this.props.getEntitiesWithCallback(request, this, function (data, referer) {
                console.log("DATA FOR DROPDOWN: ", data);
            });

        }

        this.onKeyUpDynamicDropdown = (value, id, propName, reffEntity) => {
            if (value == null || value.trim() == "") { return; }
            const request = {
                entityName: reffEntity,
                fieldName: 'name',
                fieldValue: value
            }
            this.props.getEntitiesWithCallback(request, this, function (data, referer) {
                console.log("LIST FOR DROPDOWN: ", data.entities)
                referer.populateDropdownValues(data.entities, propName);
            });
            let currentDropdownValue = this.state.dropdownValues;
            currentDropdownValue[propName] = value;
            this.setState({ activeId: id, dropdownValues: currentDropdownValue });
        }

        this.populateDropdownValues = (entities, propName) => {
            console.log("ENTITIES:", entities)
            let options = new Array();
            const formDataItem = this.getFormDataItem(propName);
            if (null == formDataItem) {
                console.log("FORM DATA NOT FOUND");
                return;
            }

            for (let i = 0; i < entities.length; i++) {
                const entity = entities[i];
                options.push({
                    value: entity[formDataItem.idField],
                    text: entity[formDataItem.displayField],
                    entity: entity
                })
            }
            let currentDropdownList = this.state.dropdownList;
            currentDropdownList[propName] = options;
            //  this.setState({ dropdownList: currentDropdownList })
            return options;
        }

        this.getSelectedDropdownItem = (value, propName) => {
            if (this.state.dropdownList[propName] == null) {
                return null;
            }
            const dropdownList = this.state.dropdownList[propName];
            for (let i = 0; i < dropdownList.length; i++) {
                const option = dropdownList[i];
                if (option.value == value) {
                    return option;
                }

            }
            return null;
        }

        this.getFormDataItem = (propName) => {
            if (this.props.entityConfig && this.props.entityConfig.formData) {
                const formDataList = this.props.entityConfig.formData;
                for (let i = 0; i < formDataList.length; i++) {
                    const formDataItem = formDataList[i];
                    if (formDataItem.name == propName) {
                        return formDataItem;
                    }
                }
            }
            return null;
        }

        this.handleChangeBase64Image = (base64, propName) => {
            console.log("__base64__:", base64)

            let base64Data = this.state.base64Data;
            base64Data[propName] = base64;
            if (this.props.managedEntity) {
                this.props.managedEntity[propName] = base64;
            } else {
                let managedEntity = this.state.managedEntity;
                if (!managedEntity) managedEntity = {};
                managedEntity[propName] = base64;
                this.setState({ managedEntity: managedEntity });
            }
            this.setState({ base64Data: base64Data });
        }

        this.selectFromDynamicDropdown = (value, propName) => {
            console.log(propName, ":", value);
            const currentDropdownList = this.state.dropdownList;
            const dropdownValues = this.state.dropdownValues;
            const selectedEntities = this.state.selectedEntities;

            const selectedOption = this.getSelectedDropdownItem(value, propName);
            if (null == selectedOption) {
                return;
            }

            dropdownValues[propName] = selectedOption.text;
            currentDropdownList[propName] = [];
            selectedEntities[propName] = selectedOption.entity;

            /**
             * time to modify entity
             */
            const displayPropName = propName.split(".")[0];

            if (this.props.managedEntity) {
                this.props.managedEntity[displayPropName] = selectedOption.entity;
            } else {
                let managedEntity = this.state.managedEntity;
                if (!managedEntity) managedEntity = {};
                managedEntity[displayPropName] = selectedOption.entity;
                this.setState({ managedEntity: managedEntity });
            }

            this.setState({ activeId: null, dropdownList: currentDropdownList, dropdownValues: dropdownValues, selectedEntities: selectedEntities });
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

                        if (propName.split(".").length > 1 && this.state.activeId != "input-for-" + data.name) {
                            const valueAsObject = entity[propName.split(".")[0]];
                            const objectPropName = propName.split(".")[1];

                            value = valueAsObject ? valueAsObject[objectPropName] : null;
                        } else {
                            value = entity[propName];
                        }
                    }

                    let inputComponent = null;
                    const inputId = "input-for-" + data.name;

                    if (data.inputType == "dynamicDropdown") {
                        /**
                         * if dynamic dropDown
                         */

                        if (null == value) {
                            value = this.state.dropdownValues[data.name]
                        }

                        inputComponent = <InputDropdown
                            onSelect={(value) => this.selectFromDynamicDropdown(value, data.name)}
                            id={inputId}
                            value={value}
                            dropdownList={this.state.dropdownList[data.name]}
                            onKeyUp={(value, id) => { this.onKeyUpDynamicDropdown(value, id, data.name, data.reffEntity) }} />

                    } if (data.inputType == "singleImage") {
                        /**
                         * handle image single
                         */
                        inputComponent = <InputFile
                            onChange={(base64) => this.handleChangeBase64Image(base64, data.name)}
                            value={value && value.includes("base64") ? value : value ? url.baseImageUrl + value : null}
                            id={inputId}

                        />
                    }

                    else {
                        /**
                         * regular
                         */
                        inputComponent = <InputField
                            onKeyUp={(value, id) => { this.onKeyUp(value, id, data.name) }}
                            id={inputId} value={value}
                            type={data.inputType} placeholder={data.lableName} />;
                    }

                    return (
                        <div key={"FORM-FIELD-" + stringUtil.uniqueId()}>
                            <Label text={data.lableName} />
                            {inputComponent}
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

const mapStateToProps = state => {
    return {}
}

const mapDispatchToProps = dispatch => ({
    getEntitiesWithCallback: (request, referer, callback) => dispatch(actions.getEntitiesWithCallback(request, referer, callback)),


})
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(EntityForm))