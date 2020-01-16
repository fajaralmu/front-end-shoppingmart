import React, { Component } from 'react'
import CrudRow from './CrudRow';
import '../css/Common.css'
import '../css/InstantTable.css'
import * as stringUtil from '../utils/StringUtil'

class InstantTable extends Component {
    constructor(props) { super(props) }

    render() {
        let rows = [];
        if (this.props.rows) { rows = this.props.rows; }
        let className = "table";
        let tableStyle = this.props.style ? this.props.style : {};
        if (this.props.className) {
            className += " " + this.props.className;
        }
        return (
            <table   style={tableStyle} className={className}><tbody>
                {rows.map(row => { 
                    return (<CrudRow style={row.style} valign={this.props.valign ? this.props.valign : "top"} RS={row.RS} CS={row.CS} values={row.values ? row.values : []}
                        key={stringUtil.uniqueId()} disabled={this.props.disabled == null ? true : this.props.disabled} />
                    )
                })}
            </tbody></table>

        )
    }
}

export default InstantTable;