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
        console.log("CS:", this.props.CS);
        let values = this.props.values;
        const defaultColspan = 1;
        if (null == values) {
            values = new Array();
        } else {
            let newValues = new Array();
            for (let index = 0; index < values.length; index++) {
                const value = values[index];
                if (this.props.CS) {
                    let colspan = this.props.CS != null
                        && this.props.CS.length > 0 &&
                        this.props.CS[index] != null ? this.props.CS[index] : defaultColspan;
                    newValues.push({ value: value, colspan: colspan });
                } else
                    newValues.push({ value: value });
            }
            values = newValues;
        }

        let actionButton = <td>
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
        }
        return (
            <tr valign="top">
                {values.map(
                    value => {
                        return (
                            <td colSpan={value.colspan}>{value.value}</td>
                        )
                    }
                )}
                {actionButton}
            </tr>
        )
    }
}

export default CrudRow;