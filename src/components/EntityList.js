import React, { Component } from 'react'
import '../css/Common.css'
import InstantTable from './InstantTable'
import ContentTitle from './ContentTitle';
import { _byId } from '../utils/ComponentUtil'
import * as stringUtil from '../utils/StringUtil'
import '../css/Management.css'
import '../css/Entity.css'
import * as componentUtil from '../utils/ComponentUtil'
import ActionButtons from './ActionButtons';
import InputField from './InputField'
import ActionButton from './ActionButton'
import EntityForm from './EntityForm';

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

            console.log("Will EDIT: ", id)
        }
        this.getHeaderNames = (fieldNames) => {
            const headers = [];
            for (let i = 0; i < fieldNames.length; i++) {
                const name = fieldNames[i];
                let headerName = name;
                if (name.split(".").length > 1) {
                    headerName = name.split(".")[0];
                }
                headers.push(headerName.toUpperCase());
            }
            headers.push("OPTION");
            return headers;
        }

        this.goToPage = (page, orderObject) => {
            let config = this.props.entityConfig;
            config.filter = this.state.filter;
            if (orderObject != null) {
                config.orderBy = orderObject.orderBy;
                config.orderType = orderObject.orderType;
                this.setState({ orderBy: orderObject.orderBy, orderType: orderObject.orderType });
            }

            this.props.getEntityInPage(config, page);

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
                let headerName = name;
                if (name.split(".").length > 1) {
                    headerName = name.split(".")[0];
                }

                let value = "";
                if (this.state.filter[headerName] != null) {
                    value = this.state.filter[headerName];
                }

                const input = <InputField value={value} id={headerName + "_filter_id"}
                    onKeyUp={this.handleFilterChange} key={"input_field_" + stringUtil.uniqueId()}
                    placeholder={headerName} />

                let orderType = "asc";
                if (this.state.orderBy && this.state.orderBy == headerName) {
                    if (this.state.orderType == "asc") {
                        orderType = "desc";
                    }
                }


                const orderButton = <ActionButton
                    onClick={() => { this.setOrderBy(headerName, orderType) }}
                    text={orderType} />

                inputs.push(<div className="filter-wrapper">
                    {input}{orderButton}
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
                const fieldName = entityConfig.fieldNames[j];
                let entityProp = fieldName;
                let object = false

                if (fieldName.split(".").length > 1) {
                    entityProp = fieldName.split(".")[0];
                    object = true;
                }

                const entityValue = entity[entityProp];

                rowValues.push(object ? entityValue[fieldName.split(".")[1]] : entityValue);
            }

            rows.push(
                {
                    identifier: entity[idField],
                    values: rowValues,
                    handleDelete: this.handleDelete,
                    handleEdit: this.handleEdit
                }
            )
        }

        let buttonsData = this.createNavButtons();
        for (let i = 0; i < buttonsData.length; i++) {
            buttonsData[i].onClick = () => { this.goToPage(i) }
            if (i == this.props.currentPage) {
                buttonsData[i].status = " btn-active";
            }
        }

        let navButtons = <ActionButtons buttonsData={buttonsData} />

        let entityTable = <div style={{ width: '100%', overflow: 'scroll' }}>

            <InstantTable
                style={{
                    width: "100%",
                    margin: "5px",
                    backgroundColor: "khaki"
                }}
                disabled={false} rows={rows} />
        </div>

        return (
            <div style={{ textAlign: 'center' }}>

                <div className="entity-container">
                    <h2>{this.props.entityConfig.title}</h2>
                    {navButtons}
                    <div className="entityForm">
                        <EntityForm formData={entityConfig.formData} />
                    </div>
                    {entityTable}

                </div>
            </div>

        )
    }
}

export default EntityList;