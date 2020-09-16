import React, { Component } from 'react'
import InstantTable from '../../container/InstantTable'
import { _byId } from '../../../utils/ComponentUtil'
import * as stringUtil from '../../../utils/StringUtil'
import './Management.css'
import './Entity.css'
import * as componentUtil from '../../../utils/ComponentUtil'
import ActionButtons from '../../buttons/ActionButtons';
import InputField from '../../inputs/InputField'
import ActionButton from '../../buttons/ActionButton'
import EntityForm from './EntityForm';
import * as url from '../../../constant/Url'
import Label from '../../container/Label'

class EntityList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: {},
            activeId: null,
            orderBy: null,
            orderType: null
        }

        this.handleDelete = (id) => {
            if (!window.confirm("Are your sure for deleting this entity?")) { return; }
            console.log("Will DELETE: ", id)
        }
        this.handleEdit = (id) => {
            this.getEntityById(id);
        }
        this.getHeaderNames = (fieldNames) => {
            const headers = [];
            for (let i = 0; i < fieldNames.length; i++) {
                const name = fieldNames[i];
                let headerName = name.name;
                if (headerName.split(".").length > 1) {
                    headerName = headerName.split(".")[0];
                }
                headers.push(headerName.toUpperCase());
            }
            headers.push("OPTION");
            return headers;
        }

        this.goToPage = (page, orderObject) => {
            if (page > this.props.entitiesData.totalData / 10) {
                page = 0;
            }
            if (page < 0) {
                page = Math.ceil(this.props.entitiesData.totalData / 10 - 1);
            }

            let config = this.props.entityConfig;
            config.filter = this.state.filter;
            if (orderObject != null) {
                config.orderBy = orderObject.orderBy;
                config.orderType = orderObject.orderType;
                this.setState({ orderBy: orderObject.orderBy, orderType: orderObject.orderType });
            }

            this.props.getEntityInPage(config, page);

        }

        this.getEntityById = (id) => {
            const config = this.props.entityConfig;
            if (config == null) {
                alert("Config Not Found!");
                return;
            }

            this.props.getEntityById(config.entityName, id);
        }

        this.createNavButtons = () => {
            let displayedButtons = componentUtil.createNavButtons(this.props.entitiesData.totalData / 10, this.props.currentPage);
            return displayedButtons;
        }

        this.setOrderBy = (fieldName, orderType) => {
            this.goToPage(this.props.currentPage, { orderBy: fieldName, orderType: orderType });
        }

        this.createFilterInputs = (fieldNames) => {
            let inputs = new Array();
            for (let i = 0; i < fieldNames.length; i++) {
                const name = fieldNames[i];
                let headerName = name.name;
                if (headerName.split(".").length > 1) {
                    headerName = headerName.split(".")[0];
                }

                let value = "";
                if (this.state.filter[headerName] != null) {
                    value = this.state.filter[headerName];
                }

                const input = <InputField value={value} id={headerName + "_filter_id"}
                    onKeyUp={this.handleFilterChange} key={"input_field_" + stringUtil.uniqueId()}
                    placeholder={headerName} />

                let orderType = "desc";
                if (this.state.orderBy && this.state.orderBy == headerName) {
                    if (this.state.orderType == "asc") {
                        orderType = "asc";
                    }
                }

                const orderButtonUp = <ActionButton
                    status={'outline-secondary'}
                    onClick={() => { this.setOrderBy(headerName, 'asc') }}
                    text={<i class={"fa fa-angle-up"} aria-hidden="true"></i>} />
                const orderButtonDown = <ActionButton
                    status={'outline-secondary'}
                    onClick={() => { this.setOrderBy(headerName, 'desc') }}
                    text={<i class={"fa fa-angle-down"} aria-hidden="true"></i>} /> 

                inputs.push(<div className="filter-wrapper">
                    {input}{orderButtonUp}{orderButtonDown}
                </div>);
            }
            inputs.push("");
            return inputs;
        }

        this.handleFilterChange = (value, id) => {

            let filter = this.state.filter;
            if (value != null && value.trim() == "") {
                filter[id.split("_filter_id")[0]] = null;

            } else {
                filter[id.split("_filter_id")[0]] = value;

            }

            this.setState({ filter: filter, activeId: id });
            this.goToPage(this.props.currentPage);
        }

        this.focusActiveId = () => {
            if (_byId(this.state.activeId)) {
                _byId(this.state.activeId).focus();
            }
        }

    }


    componentDidUpdate() {
        this.focusActiveId();
    }

    render() {

        const entitiesData = this.props.entitiesData;
        const entityConfig = this.props.entityConfig;

        if (null == entitiesData || null == entityConfig || null == entitiesData.entities) {
            return (<h2>Entity Not Found</h2>)
        }

        const rows = [
            //header
            {
                values: this.getHeaderNames(entityConfig.fieldNames),
                disabled: true,
                style: { textAlign: 'center', fontWeight: 'bold' }
            },
            //filter
            {
                values: this.createFilterInputs(entityConfig.fieldNames),
                disabled: true
            }
        ];


        const entities = this.props.entitiesData.entities;
        const idField = entityConfig.id;

        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            let rowValues = [];
            for (let j = 0; j < entityConfig.fieldNames.length; j++) {
                const fieldItem = entityConfig.fieldNames[j];
                let entityProp = fieldItem.name;
                let object = false

                if (entityProp.split(".").length > 1) {
                    entityProp = entityProp.split(".")[0];
                    object = true;
                }

                let entityValue = entity[entityProp];
                if (fieldItem.type) {
                    if (fieldItem.type == "number") {
                        entityValue = stringUtil.beautifyNominal(entityValue);
                    } else if (fieldItem.type == "link") {
                        entityValue = <a href={entityValue}><u>{entityValue}</u></a>
                    } else if (fieldItem.type == "image") {
                        entityValue = <img width="60" height="60" alt={url.baseImageUrl + entityValue} src={url.baseImageUrl + entityValue} />
                    } else if (fieldItem.type == "imageMultiple") {
                        let imgName = entityValue.split("~")[0];

                        entityValue = <img width="60" height="60" src={url.baseImageUrl + imgName} />
                    } else if(fieldItem.type == "longDate") {
                        const dateStr  = new Date(entityValue).toDateString();
                        entityValue = <Label text={dateStr}/>;
                    }
                }

                rowValues.push(object && entityValue ? entityValue[fieldItem.name.split(".")[1]] : entityValue);
            }

            rows.push(
                {
                    identifier: entity[idField],
                    values: rowValues,
                    handleDelete: this.handleDelete,
                    handleEdit: this.handleEdit,
                    disabled: entityConfig.disabled == true?true:false
                }
            )
        }

        const buttonsData = this.createNavButtons();
        const fixButtonData = new Array();

        fixButtonData.push({
            onClick: () => { this.goToPage(this.props.currentPage + -1) },
            text: 'previous'
        })

        for (let i = 0; i < buttonsData.length; i++) {
            buttonsData[i].onClick = () => { this.goToPage(buttonsData[i].value) }
            if (buttonsData[i].value == this.props.currentPage) {
                buttonsData[i].status = "info btn-sm";
            }else{
                buttonsData[i].status = "outline-info btn-sm";
            }
            buttonsData[i].text = buttonsData[i].text;


            fixButtonData.push(buttonsData[i]);
        }

        fixButtonData.push({
            onClick: () => { this.goToPage(this.props.currentPage + 1) },
            text: 'next'
        });

        let navButtons = <ActionButtons style={{
            width:'min-content',
            paddingTop: '15px',
            margin: '10px'
        }} buttonsData={fixButtonData} />

        let entityTable = <div className="entity-list-container">

            <InstantTable
                style={{
                    width: "100%",
                    margin: "5px",
                }}
               rows={rows} />
        </div>

        return (
            <div style={{ textAlign: 'center' }}>
                <div className="entity-container">
                    <div style={{
                        backgroundColor: 'white',
                        margin: '10px'
                    }} > </div>
                    {navButtons}
                    <div className="entityForm">
                        <EntityForm 
                            app={this.props.app}
                            updateEntity={this.props.updateEntity}
                            removeManagedEntity={this.props.removeManagedEntity}
                            managedEntity={this.props.managedEntity}
                            entityConfig={entityConfig} />
                    </div>
                    {entityTable}

                </div>
            </div>

        )
    }
}

export default EntityList;