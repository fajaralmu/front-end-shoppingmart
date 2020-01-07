import React, { Component } from 'react'
import CrudRow from './CrudRow';
import '../css/Common.css'
import '../css/InstantTable.css'

class InstantTable extends Component {
    constructor(props) { super(props) }

    render() {
        let rows = [];
        if (this.props.rows) { rows = this.props.rows; }
        return (
            <table> <tbody>
                {rows.map(row => {
                    
                    let colspan = null;
                    if(row.CS!=null){
                        colspan = row.CS;
                    }
                    return (<CrudRow valign={this.props.valign?this.props.valign:"top"} CS={colspan} values={row.values ? row.values : []}
                        key={row.id} disabled={this.props.disabled == null? true: this.props.disabled}></CrudRow>
                    )
                })}
            </tbody> </table>

        )
    }
}

export default InstantTable;