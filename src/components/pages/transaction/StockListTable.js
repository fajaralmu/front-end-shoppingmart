import React, { Component } from 'react'  
import * as stringUtil from '../../../utils/StringUtil' 
import CrudRow from '../../container/CrudRow'
 

class StockListTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let headers = [
            "No", "Flow ID", "Product Name", "Expiry Date", "Quantity", "Price @Item", "Total Price", "Reff Stock ID", "Option"
        ];

        if (this.props.disabled == true) {
            headers = [
                "No", "Flow ID", "Product Name", "Expiry Date", "Quantity", "Price @Item", "Total Price", "Reff Stock ID"
            ];
        }

        let productFlows = this.props.productFlows;
        let i = 1;
        let stockListRow =
            productFlows.map(
                productFlow => {
                    let product = productFlow.product ? productFlow.product : {};
                    let totalPrice = productFlow.count * product.price;
                    let values = [
                        i, productFlow.id, product.name, productFlow.expiryDate, stringUtil.beautifyNominal(productFlow.count), stringUtil.beautifyNominal(product.price) + ",00", stringUtil.beautifyNominal(totalPrice) + ",00", productFlow.flowReferenceId
                    ];
                    i++;
                    return <CrudRow disabled={this.props.disabled}
                        handleDelete={this.props.handleDelete} handleEdit={this.props.handleEdit}
                        key={stringUtil.uniqueId() + "-row-trx"}
                        identifier={productFlow.entityId}
                        values={values} />
                }
            );

        let tableStyle = { fontFamily: 'consolas', fontSize: '0.8em' }

        return (
            <div className="entity-list-container">
                <table className="entity-list-table" style={tableStyle}>
                    <thead>
                        <tr key={stringUtil.uniqueId() + "-stock"}>
                            {headers.map(headerValue => <th key={stringUtil.uniqueId() + "-th"}>{headerValue} </th>)}
                        </tr>
                        {stockListRow}
                    </thead>
                </table>
            </div>
        )
    }

}

export default StockListTable;