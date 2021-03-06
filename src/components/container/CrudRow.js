import React, { Component } from 'react'
import * as stringUtil from '../../utils/StringUtil'
import ActionButtons from '../buttons/ActionButtons';
import './CrudRow.css'

class CrudRow extends Component {
    constructor(props) {
        super(props);

        this.handleEdit = () => {
            console.debug("handleEdit");
            if (this.props.handleEdit && !this.props.disabled) {
                this.props.handleEdit(this.props.identifier);
            }
        }
        this.handleDelete = () => {
            if (this.props.handleDelete) {
                this.props.handleDelete(this.props.identifier);
            }
        }

        this.rowOnClick = (e) => {
            if( !this.props.disabled){
                e.preventDefault();
                this.handleEdit();
                 
            } 
            return false;
        }
    }

    render() {
        let values = this.props.values;
        const defaultRowColSpan = 1;
        if (null == values) {
            values = new Array();
        } else {
            let newValues = new Array();
            for (let i = 0; i < values.length; i++) {
                const value = values[i];
                if (this.props.CS || this.props.RS) {
                    let colspan = stringUtil.isNonNullArrayWithIndex(this.props.CS, i) ?
                        this.props.CS[i] : defaultRowColSpan;
                    let rowspan = stringUtil.isNonNullArrayWithIndex(this.props.RS, i) ?
                        this.props.RS[i] : defaultRowColSpan;
                    newValues.push({ value: value, colspan: colspan, rowspan: rowspan });
                } else {
                    newValues.push({ value: value });
                }
            }
            values = newValues;
        }

        let trStyle = this.props.style ? this.props.style : {
            borderTop: 'solid 1px gray',
        };
        let actionButton = <td style={trStyle}>
            <ActionButtons buttonsData={[
                {
                    id: "k-btn-edit-" + this.props.identifier,
                    status: 'warning btn-sm',
                    onClick: this.handleEdit,
                    text: <i className="fas fa-edit"></i>
                },
                {
                    id: "k-btn-dlt-" + this.props.identifier,
                    status: 'danger btn-sm',
                    onClick: this.handleDelete,
                    text: <i className="fas fa-trash"></i>
                }
            ]} />
        </td>;
        const disabled = this.props.disabled;
        if (disabled == true) {
            actionButton = null;
            trStyle = this.props.style ? this.props.style : {};
        }

        return (
            <tr className={disabled ? "crud-disabled" : "crud-row"} style={trStyle} key={stringUtil.uniqueId()}
                valign={this.props.valign} onContextMenu= {this.rowOnClick}> 
                <Cells values={values} trStyle={trStyle} />
                {actionButton}
            </tr>
        )
    }
}

const Cells = (props) => {

    return <>{props.values.map(element => {

        const isJSON = element.value != null && element.value.constructor == Object && !React.isValidElement(element.value);
        const valueComponent = isJSON ? JSON.stringify(element.value) : element.value;
        return (
            <td key={"td-key-" + stringUtil.uniqueId()} id={"td-" + stringUtil.uniqueId()}
                style={props.trStyle}
                rowSpan={element.rowspan}
                colSpan={element.colspan}>
                {valueComponent}
            </td>
        )
    })}</>
}

export default CrudRow;