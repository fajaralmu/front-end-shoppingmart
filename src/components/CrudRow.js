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
        if (null == values) {
            values = new Array();
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
                            <td>{value}</td>
                        )
                    }
                )}
                {actionButton}
            </tr>
        )
    }
}

export default CrudRow;