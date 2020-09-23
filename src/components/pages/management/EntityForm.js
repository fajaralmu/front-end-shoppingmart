import React, { Component } from 'react'
import './Entity.css'
import { byId } from '../../../utils/ComponentUtil'
import * as stringUtil from '../../../utils/StringUtil'
import { withRouter } from 'react-router'
import * as actions from '../../../redux/actionCreators'
import { connect } from 'react-redux'
import * as url from '../../../constant/Url'
import DynamicDropdown from '../../inputs/DynamicDropdown'
import InputField from '../../inputs/InputField'
import InputFile from '../../inputs/InputFile'
import InputFileMultiple from '../../inputs/InputFileMultiple'
import Label from '../../container/Label'
import ActionButtons from '../../buttons/ActionButtons'
import ComboBox from './../../inputs/ComboBox';

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
            console.info("validateEntity");
            const result = entity;
            for (let key in entity) {

                const element = this.getElementProperty(key);
                if (element) {
                    if (element.type == "img" && element.multiple == false) {
                        /**
                         * handle single Image
                         */
                        if (entity[key] && !entity[key].includes("base64")) {
                            result[key] = null;
                        }
                    } else if (element.type == "img" && element.multiple == true) {
                        /**
                         * handle MULTIPLE Image
                         */
                        console.info("this.state.base64DataMultiple[key] ", this.state.base64DataMultiple[key]);

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
                console.log(key, "=>", result[key]);
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
                    this.props.updateEntity(this.props.entityProperty.entityName,
                        this.validateEntity(this.props.managedEntity), "update");
                }
            }

            const addNewMod = this.state.managedEntity != null;
            if (addNewMod) {
                console.log("WILL SUBMIT NEW(state):", this.state.managedEntity);
                if (this.props.updateEntity) {
                    this.props.updateEntity(this.props.entityProperty.entityName,
                        this.validateEntity(this.state.managedEntity), "addNew");
                }
            }
            this.clear();
        }

        this.focusActiveId = () => {
            if (byId(this.state.activeId)) {
                byId(this.state.activeId).focus();
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

        this.onKeyUpDynamicDropdown = (value, inputPhysicalId, fieldId, reffEntity, optionItemName) => {
            if (value == null || value.trim() == "") { return; }
            const request = {
                entityName: reffEntity.toLowerCase(),
                fieldName: optionItemName,
                fieldValue: value
            }
            this.props.getEntitiesWithCallback(request, this, function (data, referer) {
                console.log("LIST FOR ", fieldId, " DROPDOWN: ", data.entities)
                referer.populateDropdownValues(data.entities, fieldId);
            });
            let currentDropdownValue = this.state.dropdownValues;
            currentDropdownValue[fieldId] = value;
            this.setState({ activeId: inputPhysicalId, dropdownValues: currentDropdownValue });
        }

        this.populateDropdownValues = (entities, fieldId) => {
            console.log("ENTITIES (", fieldId, "):", entities)
            let options = new Array();
            const element = this.getElementProperty(fieldId);
            if (null == element) {
                console.log("FORM DATA NOT FOUND");
                return;
            }

            for (let i = 0; i < entities.length; i++) {
                const entity = entities[i];
                options.push({
                    value: entity[element.optionValueName],
                    text: entity[element.optionItemName],
                    entity: entity
                })
            }
            let currentDropdownList = this.state.dropdownList;
            currentDropdownList[fieldId] = options;
            //  this.setState({ dropdownList: currentDropdownList })
            return options;
        }

        this.getSelectedDropdownItem = (value, fieldId) => {
            if (this.state.dropdownList[fieldId] == null) {
                return null;
            }
            const dropdownList = this.state.dropdownList[fieldId];
            for (let i = 0; i < dropdownList.length; i++) {
                const option = dropdownList[i];
                if (option.value == value) {
                    return option;
                }

            }
            return null;
        }

        this.getElementProperty = (fieldId) => {
            if (this.props.entityProperty) {
                const entityProperty = this.props.entityProperty;
                for (let i = 0; i < entityProperty.elements.length; i++) {
                    const element = entityProperty.elements[i];
                    if (element.id == fieldId) {
                        return element;
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
        this.handleRemoveImage = (fieldId) => {

            let base64Data = this.state.base64Data;
            base64Data[fieldId] = null;

            this.updateSelectedEntity(fieldId, null);
            this.setState({ base64Data: base64Data });
        }

        this.handleChangeBase64Image = (base64, fieldId) => {

            let base64Data = this.state.base64Data;
            base64Data[fieldId] = base64;

            this.updateSelectedEntity(fieldId, base64);
            this.setState({ base64Data: base64Data });
        }

        this.handleChangeBase64MultipleImage = function (base64, fieldId, i) {
            let base64DataMultiple = this.state.base64DataMultiple;
            const propName = fieldId;
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

        this.handleRemoveMultipleImage = (_fieldId, i) => {
            let base64DataMultiple = this.state.base64DataMultiple;
            const fieldId = _fieldId;
            if (!base64DataMultiple[fieldId]) {
                base64DataMultiple[fieldId] = new Array();
            }
            base64DataMultiple[fieldId][i] = null; //set to NULL

            this.setState({ base64DataMultiple: base64DataMultiple });

            if (this.props.managedEntity) {
                let currentValue = this.props.managedEntity[fieldId];
                if (currentValue) {
                    let newArrayValue = this.removeElementAtPosition(currentValue.split("~"), i);
                    this.updateSelectedEntity(fieldId, newArrayValue.join("~"));
                }
            } else {
                let managedEntity = this.state.managedEntity;
                if (!managedEntity) {
                    return;
                }
                let currentValue = managedEntity[fieldId];
                if (currentValue) {
                    let newArrayValue = this.removeElementAtPosition(currentValue.split("~"), i);
                    this.updateSelectedEntity(fieldId, newArrayValue.join("~"));

                }
            }
        }

        this.selectFromDynamicDropdown = (value, propName) => {
            console.log("Dynamic Dropdown ", propName, ":", value);
            const stateDropdownList = this.state.dropdownList;
            const stateDropdownValues = this.state.dropdownValues;
            const selectedEntities = this.state.selectedEntities;

            const selectedOption = this.getSelectedDropdownItem(value, propName);
            if (null == selectedOption) {
                return;
            }

            stateDropdownValues[propName] = selectedOption.text;
            stateDropdownList[propName] = [];
            selectedEntities[propName] = selectedOption.entity;

            /**
             * time to modify entity
             */
            const displayPropName = propName;

            this.updateSelectedEntity(displayPropName, selectedOption.entity);
            this.setState({ activeId: null, dropdownList: stateDropdownList, dropdownValues: stateDropdownValues, selectedEntities: selectedEntities });
            this.refresh();
        }

        this.selectFromFixedDropdown = (value, fieldId) => {
            console.log("FIXED Dropdown ", fieldId, ":", value);
            const stateDropdownList = this.state.dropdownList;
            const stateDropdownValues = this.state.dropdownValues;

            stateDropdownValues[fieldId] = value;
            const element = this.getElementProperty(fieldId);
            const optionValueName = element.optionValueName;
            const currentDropdownList = stateDropdownList[fieldId];

            for (let i = 0; i < currentDropdownList.length; i++) {
                const entity = currentDropdownList[i];
                if (entity[optionValueName] == value) {
                    console.info("update fieldId: ", entity);
                    this.updateSelectedEntity(fieldId, entity);
                    this.setState({ activeId: null, dropdownValues: stateDropdownValues });
                    this.refresh();
                    break;
                }
            }

        }
        this.selectFromPlainListDropdown = (value, fieldId) => {
            console.log("Plain Dropdown ", fieldId, ":", value);
            const stateDropdownList = this.state.dropdownList;
            const dropdownValues = this.state.dropdownValues;
            dropdownValues[fieldId] = value;
            const currentDropdownList = stateDropdownList[fieldId];

            for (let i = 0; i < currentDropdownList.length; i++) {
                const item = currentDropdownList[i];
                if (item.toString() == value.toString()) {
                    console.info("update fieldId: ", item);
                    this.updateSelectedEntity(fieldId, item);
                    this.setState({ activeId: null, dropdownValues: dropdownValues });
                    this.refresh();
                    break;
                }
            }

        }

        this.updateFixedListValues = (options, fieldId) => {

            const currentDropdownList = this.state.dropdownList;
            if (currentDropdownList[fieldId] != null && currentDropdownList[fieldId].length == options.length) return;
            currentDropdownList[fieldId] = options;
            this.setState({ dropdownList: currentDropdownList });
        }
        this.updatePlainListValues = (options, fieldId) => {

            const currentDropdownList = this.state.dropdownList;
            if (currentDropdownList[fieldId] != null && currentDropdownList[fieldId].length == options.length) return;
            currentDropdownList[fieldId] = options;
            this.setState({ dropdownList: currentDropdownList });
        }
    }

    componentDidUpdate() {
        this.focusActiveId();

        console.debug("props managedEntity: ", this.props.managedEntity);
        console.debug("state managedEntity: ", this.state.managedEntity);
    }

    render() {
        return (
            <div className="entity-form-wrapper">
                <div className="entity-form  ">
                    <FormElement
                        entityConfig={this.props.entityConfig}
                        managedEntity={this.props.managedEntity}
                        entityProperty={this.props.entityProperty}

                        app={this}

                        updated={this.state.updated}
                        stateManagedEntity={this.state.managedEntity}
                        dropdownValues={this.state.dropdownValues}
                        dropdownList={this.state.dropdownList}
                        base64DataMultiple={this.state.base64DataMultiple}

                    />
                    <FormActionButtons
                        entityConfig={this.props.entityConfig}
                        managedEntity={this.props.managedEntity}
                        handleSubmit={this.handleSubmit}
                        clear={this.clear} />
                </div>
            </div>
        )
    }
}

function FormActionButtons(props) {
    if (!props.entityConfig.disabled) {
        return (<ActionButtons buttonsData={[
            {
                text: props.managedEntity ? "Update" : "Add Record",
                onClick: props.handleSubmit,
                status: "success"
            },
            {
                text: "Clear",
                status: "warning",
                onClick: props.clear
            }
        ]} />)
    }

    return <></>;
}

function FormElement(_props) {
    const props = _props;
    const app = props.app;
    const entityExist = props.managedEntity != null || props.stateManagedEntity;
    const enityProperty = props.entityProperty;
    const elements = enityProperty.elements;

    return (<>
        {elements.map(
            element => {
                const elementId = element.id;
                let value = null;
                if (entityExist) {
                    const entity = props.managedEntity ? props.managedEntity : props.stateManagedEntity;

                    if (element.entityReferenceClass != null && props.activeId != "input-for-" + element.name) {
                        const valueAsObject = entity[elementId];

                        if (valueAsObject != null) {
                            if (element.type == "dynamiclist") {
                                const objectPropName = element.optionItemName;
                                value = valueAsObject[objectPropName];
                            } else if (element.type == "fixedlist") {
                                const objectPropName = element.optionValueName;
                                value = valueAsObject[objectPropName];
                            }
                        }
                    } else {
                        value = entity[elementId];
                    }
                }

                let inputComponent = null;
                const inputId = "input-for-" + elementId;

                if (element.type == "dynamiclist") {
                    /**
                     * if dynamic dropDown
                     */

                    if (null == value) {
                        value = props.dropdownValues[elementId]
                    }

                    inputComponent = <DynamicDropdown
                        onSelect={(value) => app.selectFromDynamicDropdown(value, elementId)}
                        id={inputId}
                        placeholder={element.lableName}
                        value={value}
                        dropdownList={props.dropdownList[elementId]}
                        onKeyUp={(value, id) => { app.onKeyUpDynamicDropdown(value, id, elementId, element.entityReferenceClass, element.optionItemName) }} />

                } else if (element.type == "fixedlist") {
                    /**
                     * if fixed dropDown
                     */

                    if (null == value) {
                        value = props.dropdownValues[elementId];
                    }

                    app.updateFixedListValues(element.options, elementId);
                    console.info("def value ", elementId, " : ", value)
                    const comboBoxOptions = getFixedListElementOptions(element);
                    inputComponent = <ComboBox
                        onChange={(value) => {
                            app.selectFromFixedDropdown(value, elementId);
                        }}
                        defaultValue={value}
                        id={inputId}
                        placeholder={element.lableName}
                        options={comboBoxOptions}
                    />

                } else if (element.type == "plainlist") {
                    /**
                     * if fixed dropDown
                     */

                    if (null == value) {
                        value = props.dropdownValues[elementId];
                    }

                    app.updatePlainListValues(element.plainListValues, elementId);
                    console.info("def value ", elementId, " : ", value)
                    const comboBoxOptions = getPlainListElementOptions(element);
                    inputComponent = <ComboBox
                        onChange={(value) => {
                            app.selectFromPlainListDropdown(value, elementId);
                        }}
                        defaultValue={value == null ? null : value.toString()}
                        id={inputId}
                        placeholder={element.lableName}
                        options={comboBoxOptions}
                    />

                } else if (element.type == "img" && element.multiple == false) {
                    /**
                     * handle image single
                     */
                    inputComponent = <InputFile
                        onChange={(base64) => app.handleChangeBase64Image(base64, elementId)}
                        value={value && value.includes("base64") ? value : value ? url.baseImageUrl + value : null}
                        id={inputId}
                        removeImage={() => app.handleRemoveImage(elementId)}

                    />

                } else if (element.type == "img" && element.multiple == true) {
                    /**
                     * handle multiple single
                     */
                    const valueSplit = value ? value.split("~") : [];

                    const imagesData = new Array();
                    for (let i = 0; i < valueSplit.length; i++) {
                        let valueSplitItem = valueSplit[i];
                        if (props.base64DataMultiple[elementId] &&
                            props.base64DataMultiple[elementId][i]
                            && props.base64DataMultiple[elementId][i].includes("base64")) {
                            valueSplitItem = props.base64DataMultiple[elementId][i];
                        }
                        imagesData.push({
                            value: valueSplitItem,
                            onChange: (base64) => {
                                app.handleChangeBase64MultipleImage(base64, elementId, i);
                            },
                            removeImage: () => app.handleRemoveMultipleImage(elementId, i)

                        })
                    }
                    inputComponent = <InputFileMultiple
                        addMoreImage={() => app.addMoreImage(elementId)}
                        inputFilesData={imagesData}
                    />
                }

                else {
                    /**
                     * regular
                     */
                    inputComponent = <InputField
                        disabled={element.idField == true}
                        onKeyUp={(value, id) => { app.onKeyUp(value, id, elementId) }}
                        id={inputId} value={value}
                        type={element.type} placeholder={element.lableName} />;
                }

                return (
                    <div key={"FORM-FIELD-" + stringUtil.uniqueId()}  >
                        <Label text={element.lableName} />
                        {inputComponent}
                    </div>
                )
            }
        )}
    </>);

}

const getPlainListElementOptions = (element) => {
    const options = [];

    for (let i = 0; i < element.plainListValues.length; i++) {
        const el = element.plainListValues[i];
        options.push({
            value: el,
            text: el
        })
    }

    return options;
}

const getFixedListElementOptions = (element) => {
    const options = [];

    for (let i = 0; i < element.options.length; i++) {
        const el = element.options[i];
        options.push({
            value: el[element.optionValueName],
            text: el[element.optionItemName]
        })
    }

    return options;
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