import React, { Component } from 'react'
import * as stringUtil from '../../../utils/StringUtil'
import CrudRow from '../../container/CrudRow'


class StockListTable extends Component {
    constructor(props) {
        super(props);

        this.headers = () => {
            let headers; 
            if (this.props.disabled == true) {
                headers = [
                    "No", "Flow ID", "Product Name", "Expiry Date", "Quantity", "Price @Item", "Total Price", "Reff Stock ID"
                ];
            } else {
                headers = [
                    "No", "Flow ID", "Product Name", "Expiry Date", "Quantity", "Price @Item", "Total Price", "Reff Stock ID", "Option"
                ];
            };
            return headers;
        }
    }

    render() { 
        
        let i = 1;
        const headers = this.headers(); 
        const productFlows = this.props.productFlows;
        const stockListRow =
            productFlows.map(
                productFlow => {
                    let product = productFlow.product ? productFlow.product : {};
                    let price = this.props.purchasing ?  productFlow.price : product.price;
                    let totalPrice = productFlow.count * product.price;
                    let values = [
                        i, productFlow.id, product.name, productFlow.expiryDate, stringUtil.beautifyNominal(productFlow.count), stringUtil.beautifyNominal(price) + ",00", stringUtil.beautifyNominal(totalPrice) + ",00", productFlow.flowReferenceId
                    ];
                    i++;
                    return <CrudRow disabled={this.props.disabled}
                        handleDelete={this.props.handleDelete} handleEdit={this.props.handleEdit}
                        key={stringUtil.uniqueId() + "-row-trx"}
                        identifier={productFlow.entityId}
                        values={values} />
                }
            );

        let tableStyle = {   };

        return (
            <div >
                <table className="table" style={tableStyle}>
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