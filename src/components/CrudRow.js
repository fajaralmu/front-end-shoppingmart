import React, { Component } from 'react'
import ActionButton from './ActionButton';
import ActionButtons from './ActionButtons';

class CrudRow extends Component {
    constructor(props) {
        super(props);

        this.handleEdit = () => {
            if (this.props.handleEdit) {
                this.props.handleEdit(this.props.identifier);
            }
        }
        this.handleDelete = () => {
            if (this.props.handleEdit) {
                this.props.handleDelete(this.props.identifier);
            }
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
                    let colspan = this.props.CS != null
                        && this.props.CS.length > 0 &&
                        this.props.CS[i] != null ? this.props.CS[i] : defaultRowColSpan;
                    let rowspan = this.props.RS != null && this.props.RS.length > 0 
                        &&this.props.RS[i]!=null?this.props.RS[i] : defaultRowColSpan;
                    newValues.push({ value: value, colspan: colspan, rowspan:rowspan });
                } else
                    newValues.push({ value: value });
            }
            values = newValues;
        }

        let trStyle = {
            borderTop:'solid 1px gray',  
        };
        let actionButton = <td style={trStyle}>
            <ActionButtons buttonsData={[
                {
                    id: "k-btn-edit-" + this.props.identifier,
                    status: 'warning',
                    onClick: this.handleEdit,
                    text: "Edit"
                },
                {
                    id: "k-btn-dlt-" + this.props.identifier,
                    status: 'danger',
                    onClick: this.handleDelete,
                    text: "Delete"
                }
            ]} />
        </td>;
 
        if (this.props.disabled == true) {
            actionButton = ""; 
            trStyle = {};
        } 
        return (
            <tr id={this.props.id} valign={this.props.valign}>
                {values.map(
                    value => {
                        return (
                            <td style={trStyle}  rowSpan={value.rowspan} colSpan={value.colspan}>{value.value}</td>
                        )
                    }
                )}
                {actionButton}
            </tr>
        )
    }
}

export default CrudRow;