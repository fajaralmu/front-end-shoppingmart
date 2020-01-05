import React, { Component } from 'react'
import CrudRow from './CrudRow';
import '../css/Entity.css'
import * as stringUtil from '../utils/StringUtil'

class StockListTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let headers = [
            "No", "Flow ID", "Product Name", "Expiry Date", "Quantity", "Price @Item", "Total Price", "Reff Stock ID", "Option"
        ];

        if(this.props.disabled == true){
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
                        i, productFlow.id, product.name, productFlow.expiryDate, stringUtil.beautifyNominal(productFlow.count), stringUtil.beautifyNominal(product.price)+",00", stringUtil.beautifyNominal(totalPrice)+",00", productFlow.flowReferenceId
                    ];
                    i++;
                    return <CrudRow disabled={this.props.disabled} handleDelete={this.props.handleDelete} handleEdit={this.props.handleEdit} key={"product-list-k" + i + "_" + productFlow.id} identifier={productFlow.flowReferenceId} values={values} />
                }
            );


        return (
            <div className="entity-list">
                <table className="entity-list-table">
                    <thead>
                        <tr>
                            {headers.map(headerValue => <th>{headerValue} </th>)}
                        </tr>
                        {stockListRow}
                    </thead>
                </table>
            </div>
        )
    }

}

export default StockListTable;