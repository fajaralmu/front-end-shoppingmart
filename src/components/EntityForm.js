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

class EntityForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            managedEntity: null,
            activeId: null,
            formValues: {},
            dropdownList: {},
            dropdownValues: {}
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
            this.setState({ managedEntity: null });
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
            for (let i = 0; i < entities.length; i++) {
                const entity = entities[i];
                options.push({
                    value: entity.id,
                    text: entity.name
                })
            }
            let currentDropdownList = this.state.dropdownList;
            currentDropdownList[propName] = options;
          //  this.setState({ dropdownList: currentDropdownList })
            return options;
        }

        this.selectFromDynamicDropdown = (value, propName) => {
            console.log(propName,":", value);
            let currentDropdownList = this.state.dropdownList;
            currentDropdownList[propName] = [];
            this.setState({dropdownList:currentDropdownList});
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

                    } else {
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