import React, { Component } from 'react'
import '../css/Common.css'
import InstantTable from './InstantTable'
import ContentTitle from './ContentTitle'; 
import {_byId} from '../utils/ComponentUtil'
import * as stringUtil from '../utils/StringUtil'
import '../css/Management.css'
import * as componentUtil from '../utils/ComponentUtil'
import ActionButtons from './ActionButtons';
import InputField from './InputField'

class EntityList extends Component {
    constructor(props) {
        super(props);

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

        this.goToPage = (page) => {
            this.props.getEntityInPage(this.props.entityConfig, page);
        }

        this.createNavButtons = () => {
            let displayedButtons = componentUtil.createNavButtons(this.props.entitiesData.totalData / 10, this.props.currentPage);
            return displayedButtons;
        }

        this.createFilterInputs = (fieldNames) =>{
            let inputs = new Array(); 
            for (let i = 0; i < fieldNames.length; i++) {
                const name = fieldNames[i];
                let headerName = name;
                if (name.split(".").length > 1) {
                    headerName = name.split(".")[0];
                }

                const input = <InputField key={"input_field_"+stringUtil.uniqueId()} placeholder={headerName} />

                inputs.push(input);
            }
            inputs.push("");
            return inputs;
        }

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
                 values : this.createFilterInputs(entityConfig.fieldNames),
                 disabled:true
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
            if(i == this.props.currentPage){
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
            <div style={{textAlign:'center'}}>
                {navButtons}
                <div className="entity-container">

                    <div className="entityForm">
                        <h2>{this.props.entityConfig.title}</h2>
                    </div>
                    {entityTable}
                </div>
            </div>

        )
    }
}

export default EntityList;