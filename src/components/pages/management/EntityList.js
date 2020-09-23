import React, { Component } from 'react'
import InstantTable from '../../container/InstantTable'
import { byId } from '../../../utils/ComponentUtil'
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
import GridComponent from './../../container/GridComponent';

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

        this.createFilterInputsv2 = (entityProperty) => {
            const inputs = new Array();
            const elements = entityProperty.elements;
            if (!elements) {
                return inputs;
            }
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                const id = element.id;

                let value = "";

                if (this.state.filter[id] != null) {
                    value = this.state.filter[id];
                }

                let input = <InputField value={value} id={id + "_filter_id"}
                    onKeyUp={this.handleFilterChange} key={"input_field_" + stringUtil.uniqueId()}
                    placeholder={id} />

                if (element.type == "date") {
                    input = <DateFilter id={id} filter={this.state.filter} app={this} />
                }
  
                inputs.push(<div className="filter-wrapper">
                    {input}<SortingButton app={this} id={id} />
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
            if (byId(this.state.activeId)) {
                byId(this.state.activeId).focus();
            }
        }

        //for data table
        this.getEntityDataTableRowData = () => {
            const entitiesData = this.props.entitiesData;
            const entityConfig = this.props.entityConfig;
            const entityProperty = this.props.entityProperty;

            if (null == entitiesData || null == entityConfig || null == entitiesData.entities) {
                return (<h2>Entity Not Found</h2>)
            }

            const rows = [
                //header
                {
                    values: getHeaderNamesv2(entityProperty), disabled: true, style: { textAlign: 'center', fontWeight: 'bold' }
                },
                //filter
                {
                    values: this.createFilterInputsv2(entityProperty), disabled: true
                }
            ];

            const entities = this.props.entitiesData.entities;
            const idField = entityProperty.idField;

            for (let i = 0; i < entities.length; i++) {
                const entity = entities[i];
                let rowValues = [];
                for (let j = 0; j < entityProperty.elements.length; j++) {
                    const element = entityProperty.elements[j];
                    const elementId = element.id;
                    const isObject =  element.entityReferenceClass != null;

                    let entityValue = entity[elementId];
                    if (element.type && entityValue) {
                        if (element.type == "number") {
                            entityValue = stringUtil.beautifyNominal(entityValue);
                        // } else if (element.type == "link") {
                        //     entityValue = <a href={entityValue}><u>{entityValue}</u></a>
                        } else if (element.type == "img" && element.multiple == false) {
                            entityValue = <img width="60" height="60" alt={url.baseImageUrl + entityValue} src={url.baseImageUrl + entityValue} />
                        } else if (element.type == "img" && element.multiple == true) {
                            let imgName = entityValue.split("~")[0];
                            entityValue = <img width="60" height="60" src={url.baseImageUrl + imgName} />
                        } else if (element.type == "date") {
                            const dateStr = new Date(entityValue).toDateString();
                            entityValue = <Label text={dateStr} />;
                        } else if(isObject){
                            entityValue = entityValue[element.optionItemName];
                        }

                        //validate length..
                        if(entityValue.constructor == String) {
                            const str = entityValue.toString();
                            if(str.length > 50){
                                entityValue = str.substr(0, 50)+"....";
                            }
                        }
                    }

                    rowValues.push(entityValue);
                }

                rows.push(
                    {
                        identifier: entity[idField],
                        values: rowValues,
                        handleDelete: this.handleDelete,
                        handleEdit: this.handleEdit,
                        disabled: entityConfig.disabled == true ? true : false
                    }
                )
            }
            return rows;
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
        return (
            <div style={{ textAlign: 'center' }}>
                <div className="entity-container">
                    <div style={{ backgroundColor: 'white', margin: '10px' }} > </div>
                    <NavigationButton buttonsData={this.createNavButtons()}
                        goToPage={this.goToPage} currentPage={this.props.currentPage} />
                    <div className="entityForm">
                        <EntityForm
                            app={this.props.app}
                            updateEntity={this.props.updateEntity}
                            removeManagedEntity={this.props.removeManagedEntity}
                            managedEntity={this.props.managedEntity}
                            entityProperty={this.props.entityProperty}
                            entityConfig={entityConfig}
                            />
                    </div>
                    <EntityTable rows={this.getEntityDataTableRowData()} />
                </div>
            </div>

        )
    }

}

function SortingButton(props) {
    return (<ActionButtons buttonsData={[{
        status: 'outline-secondary btn-sm',
        onClick: () => { props.app.setOrderBy(props.id, 'asc') },
        text: <i className={"fa fa-angle-up"} aria-hidden="true"></i>
    },
    {
        status: 'outline-secondary btn-sm',
        onClick: () => { props.app.setOrderBy(props.id, 'desc') },
        text: <i className={"fa fa-angle-down"} aria-hidden="true"></i>
    }
    ]} />);
}

function DateFilter(props) {
    const valueDay = props.filter[id + "-day"];
    const valueMonth = props.filter[id + "-month"];
    const valueYear = props.filter[id + "-year"];
    const app = props.app;
    const id = props.id;

    const style = { width: '60px', fontSize: '0.7em' };

    const inputDay = <InputField style={style} value={valueDay} id={id + "-day_filter_id"}
        onKeyUp={app.handleFilterChange} key={"input_field_d" + stringUtil.uniqueId()}
        placeholder={"day"} />;
    const inputMonth = <InputField style={style} value={valueMonth} id={id + "-month_filter_id"}
        onKeyUp={app.handleFilterChange} key={"input_field_m" + stringUtil.uniqueId()}
        placeholder={"month"} />;
    const inputYear = <InputField style={style} value={valueYear} id={id + "-year_filter_id"}
        onKeyUp={app.handleFilterChange} key={"input_field_y" + stringUtil.uniqueId()}
        placeholder={"year"} />;
    return <GridComponent items={[inputDay, inputMonth, inputYear]} />
}

const getHeaderNamesv2 = function (entityProperty) {
    const elements = entityProperty.elements;
    const headers = [];
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        let headerName = element.lableName;
        headers.push(headerName);
    }
    headers.push("OPTION");
    return headers;
} 

function EntityTable(props) {
    return <div className="entity-list-container">
        <InstantTable style={{ width: "100%", margin: "5px", }} rows={props.rows} />
    </div>
}

function NavigationButton(props) {

    const buttonsData = props.buttonsData;
    const fixButtonData = new Array();

    fixButtonData.push({
        onClick: () => { props.goToPage(props.currentPage + -1) },
        text: 'previous'
    })

    for (let i = 0; i < buttonsData.length; i++) {
        buttonsData[i].onClick = () => { props.goToPage(buttonsData[i].value) }
        if (buttonsData[i].value == props.currentPage) {
            buttonsData[i].status = "info btn-sm";
        } else {
            buttonsData[i].status = "outline-info btn-sm";
        }
        buttonsData[i].text = buttonsData[i].text;
        fixButtonData.push(buttonsData[i]);
    }

    fixButtonData.push({
        onClick: () => { props.goToPage(props.currentPage + 1) },
        text: 'next'
    });

    const style = { width: 'min-content', paddingTop: '15px', margin: '10px' };
    return (<ActionButtons style={style} buttonsData={fixButtonData} />);

}

export default EntityList;