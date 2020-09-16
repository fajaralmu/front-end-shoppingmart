import React, { Component } from 'react' 
import * as tableCss from '../../components/container/InstantTable.css'
import * as stringUtil from '../../utils/StringUtil' 
import CrudRow from './CrudRow';

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
            <table style={tableStyle} className={className}><tbody>
                {rows.map(row => {
                    let disabled = row.disabled == false? false:true;
                  
                    
                    return (
                        <CrudRow
                            style={row.style}
                            valign={this.props.valign ? this.props.valign : "top"}
                            RS={row.RS}
                            identifier={row.identifier ? row.identifier : "0000"}
                            handleEdit={row.handleEdit}
                            handleDelete={row.handleDelete}
                            CS={row.CS}
                            values={row.values ? row.values : []}
                            key={stringUtil.uniqueId()}
                            disabled={disabled}
                        />
                    )
                })}
            </tbody></table>

        )
    }
}

export default InstantTable;