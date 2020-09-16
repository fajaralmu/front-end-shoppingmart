import React, { Component } from 'react'
import './Entity.css'
import { _byId } from '../../../utils/ComponentUtil'
import * as stringUtil from '../../../utils/StringUtil'
import { withRouter } from 'react-router'
import * as actions from '../../../redux/actionCreators'
import { connect } from 'react-redux'
import * as url from '../../../constant/Url'
import InputDropdown from '../../inputs/InputDropdown'
import InputField from '../../inputs/InputField'
import InputFile from '../../inputs/InputFile'
import InputFileMultiple from '../../inputs/InputFileMultiple'
import Label from '../../container/Label'
import ActionButtons from '../../buttons/ActionButtons'

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
            base64Data: {},
            base64DataMultiple: {},
            updated: new Date()
        }

        /**
         * valudate before submit
         */
        this.validateEntity = (entity) => {
            const result = entity;
            for (let key in entity) {
                console.log(key);
                const formDataItem = this.getFormDataItemStartWith(key);
                if (formDataItem) {
                    if (formDataItem.inputType == "singleImage") {
                        /**
                         * handle single Image
                         */
                        if (entity[key] && !entity[key].includes("base64")) {
                            result[key] = null;
                        }
                    } else if (formDataItem.inputType == "multipleImage") {
                        /**
                         * handle MULTIPLE Image
                         */

                        if (entity[key]) {
                            let arrayOfValues = entity[key].split("~");
                            let resultValue = new Array();
                            for (let i = 0; i < arrayOfValues.length; i++) {
                                const element = arrayOfValues[i];
                                /**
                                 * if not modified
                                 */
                                if (!this.state.base64DataMultiple[key] ||
                                    !this.state.base64DataMultiple[key][i]) {
                                    resultValue.push("{ORIGINAL>>" + element + "}");
                                } else
                                    /**
                                     * if modified
                                     */
                                    if (this.state.base64DataMultiple[key] &&
                                        this.state.base64DataMultiple[key][i]) {
                                        const updatedValue = this.state.base64DataMultiple[key][i];
                                        resultValue.push("{ORIGINAL>>" + element + "}" + updatedValue);
                                    }

                            }

                            if (this.state.base64DataMultiple[key] && this.state.base64DataMultiple[key].length > arrayOfValues.length) {
                                for (let i = arrayOfValues.length - 1; i < this.state.base64DataMultiple[key].length; i++) {
                                    const element = this.state.base64DataMultiple[key][i];
                                    if (element && element.includes("base64")) {
                                        resultValue.push(element);
                                    }
                                }
                            }

                            if (resultValue.length > 0)
                                result[key] = resultValue.join("~");
                        }
                    }
                }
            }

            return result;
        }

        this.refresh = () => {
            this.setState({ updated: new Date() })
        }

        this.handleSubmit = () => {
            const updateMode = this.props.managedEntity != null;
            if (updateMode) {
                console.log("WILL UPDATE(props):", this.props.managedEntity);
                if (this.props.updateEntity) {
                    this.props.updateEntity(this.props.entityConfig.entityName,
                        this.validateEntity(this.props.managedEntity), "update");
                }
            }

            const addNewMod = this.state.managedEntity != null;
            if (addNewMod) {
                console.log("WILL SUBMIT NEW(state):", this.state.managedEntity);
                if (this.props.updateEntity) {
                    this.props.updateEntity(this.props.entityConfig.entityName,
                        this.validateEntity(this.state.managedEntity), "addNew");
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
            this.updateSelectedEntity(propName, value);

        }

        this.clear = () => {
            this.setState({
                managedEntity: null,
                dropdownList: {},
                dropdownValues: {},
                selectedEntities: {},
                base64Data: {},
                base64DataMultiple: {}
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

        this.addMoreImage = (propName) => {
            if (this.props.managedEntity) {
                let currentValue = this.props.managedEntity[propName];
                if (currentValue) {
                    currentValue = currentValue.trim() + "~DEFAULT.BMP";
                    this.updateSelectedEntity(propName, currentValue);
                }
            } else {
                let managedEntity = this.state.managedEntity;
                let currentValue;
                if (!managedEntity) {
                    managedEntity = {};
                    currentValue = "";
                } else
                    currentValue = managedEntity[propName] + "~";
                currentValue = currentValue.trim() + "DEFAULT.BMP";
                this.updateSelectedEntity(propName, currentValue);
            }
        }

        this.updateSelectedEntity = (propName, value) => {
            if (this.props.managedEntity) {
                this.props.managedEntity[propName] = value;
                this.refresh();
            } else {
                let managedEntity = this.state.managedEntity;
                if (!managedEntity) managedEntity = {};
                managedEntity[propName] = value;
                this.setState({ managedEntity: managedEntity });
            }

        }

        this.getFormDataItemStartWith = (propName) => {
            if (this.props.entityConfig && this.props.entityConfig.formData) {
                const formDataList = this.props.entityConfig.formData;
                for (let i = 0; i < formDataList.length; i++) {
                    const formDataItem = formDataList[i];
                    if (formDataItem.name == propName) {
                        return formDataItem;
                    }
                    if (formDataItem.name.split(".").length > 1) {
                        if (formDataItem.name.split(".")[0] == propName) {
                            return formDataItem;
                        }
                    }
                }
            }
            return null;
        }

        this.handleRemoveImage = (propName) => {

            let base64Data = this.state.base64Data;
            base64Data[propName] = null;

            this.updateSelectedEntity(propName, null);
            this.setState({ base64Data: base64Data });
        }

        this.handleChangeBase64Image = (base64, propName) => {

            let base64Data = this.state.base64Data;
            base64Data[propName] = base64;

            this.updateSelectedEntity(propName, base64);
            this.setState({ base64Data: base64Data });
        }

        this.handleChangeBase64MultipleImage = function (base64, propNameRaw, i) {
            let base64DataMultiple = this.state.base64DataMultiple;
            const propName = propNameRaw.split(".")[0];
            if (!base64DataMultiple[propName]) {
                base64DataMultiple[propName] = new Array();
            }
            base64DataMultiple[propName][i] = base64;

            this.setState({ base64DataMultiple: base64DataMultiple });

        }

        this.removeElementAtPosition = (array, index) => {
            let result = new Array();
            for (let i = 0; i < array.length; i++) {
                if (i != index) {
                    result.push(array[i])
                }
            }

            return result;
        }

        this.handleRemoveMultipleImage = (propNameRaw, i) => {
            let base64DataMultiple = this.state.base64DataMultiple;
            const propName = propNameRaw.split(".")[0];
            if (!base64DataMultiple[propName]) {
                base64DataMultiple[propName] = new Array();
            }
            base64DataMultiple[propName][i] = null;

            this.setState({ base64DataMultiple: base64DataMultiple });
            if (this.props.managedEntity) {
                let currentValue = this.props.managedEntity[propName];
                if (currentValue) {
                    let newArrayValue = this.removeElementAtPosition(currentValue.split("~"), i);
                    this.updateSelectedEntity(propName, newArrayValue.join("~"));
                }
            } else {
                let managedEntity = this.state.managedEntity;
                if (!managedEntity) {
                    return;
                }
                let currentValue = managedEntity[propName];
                if (currentValue) {
                    let newArrayValue = this.removeElementAtPosition(currentValue.split("~"), i);
                    this.updateSelectedEntity(propName, newArrayValue.join("~"));

                }
            }
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

            this.updateSelectedEntity(displayPropName, selectedOption.entity);
            this.setState({ activeId: null, dropdownList: currentDropdownList, dropdownValues: dropdownValues, selectedEntities: selectedEntities });
        }

        this.form = () => {

            let formData = this.props.entityConfig && this.props.entityConfig.formData ? this.props.entityConfig.formData : [];

            const entityExist = this.props.managedEntity != null || this.state.managedEntity;

            return (<div className="entity-form  ">
                {formData.map(
                    data => {
                        const parentPropName = data.name.split(".")[0];
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
                                placeholder={data.lableName}
                                value={value}
                                dropdownList={this.state.dropdownList[data.name]}
                                onKeyUp={(value, id) => { this.onKeyUpDynamicDropdown(value, id, data.name, data.reffEntity) }} />

                        } else if (data.inputType == "singleImage") {
                            /**
                             * handle image single
                             */
                            inputComponent = <InputFile
                                onChange={(base64) => this.handleChangeBase64Image(base64, data.name)}
                                value={value && value.includes("base64") ? value : value ? url.baseImageUrl + value : null}
                                id={inputId}
                                removeImage={() => this.handleRemoveImage(data.name)}

                            />

                        } else if (data.inputType == "multipleImage") {
                            /**
                             * handle multiple single
                             */
                            let valueSplit = value ? value.split("~") : [];

                            let imagesData = new Array();
                            for (let i = 0; i < valueSplit.length; i++) {
                                let valueSplitItem = valueSplit[i];
                                if (this.state.base64DataMultiple[parentPropName] &&
                                    this.state.base64DataMultiple[parentPropName][i]
                                    && this.state.base64DataMultiple[parentPropName][i].includes("base64")) {
                                    valueSplitItem = this.state.base64DataMultiple[parentPropName][i];
                                }
                                imagesData.push({
                                    value: valueSplitItem,
                                    onChange: (base64) => {
                                        this.handleChangeBase64MultipleImage(base64, data.name, i);
                                    },
                                    removeImage: () => this.handleRemoveMultipleImage(data.name, i)

                                })
                            }
                            inputComponent = <InputFileMultiple
                                addMoreImage={() => this.addMoreImage(data.name)}
                                inputFilesData={imagesData}

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
                {this.actionButtons()}
            </div>);

        }
    }

    componentDidUpdate() {
        this.focusActiveId();
    }

    actionButtons() {

        if (!this.props.entityConfig.disabled) {
            return (<ActionButtons buttonsData={[
                {
                    text: this.props.managedEntity ? "Update" : "Add Record",
                    onClick: this.handleSubmit,
                    status: "success"
                },
                {
                    text: "Clear",
                    status: "warning",
                    onClick: this.clear
                }
            ]} />)
        }

        return <></>;
    }

    render() { 
        return (
            <div className="entity-form-wrapper">
                <this.form />
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