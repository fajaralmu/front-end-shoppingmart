import React, { Component } from 'react'
import ActionButton from './ActionButton';

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
            <ActionButton key={"k-btn-edit-" + this.props.identifier} id={"btn-edit-" + this.props.identifier} onClick={this.handleEdit} text="Edit" />
            <ActionButton key={"k-btn-delete-" + this.props.identifier} id={"btn-delete-" + this.props.identifier} onClick={this.handleDelete} text="Delete" />
        </td>;
        if (this.props.disabled == true) {
            actionButton = "";
        }
        return (
            <tr>
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