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
                    const product = productFlow.product ? productFlow.product : {};
                    const price = this.props.purchasing ?  productFlow.price : product.price;
                    const totalPrice = productFlow.count * product.price;
                    const count = stringUtil.beautifyNominal(productFlow.count);
                    const priceString = stringUtil.beautifyNominal(price) + ",00";
                    const totalPriceString = stringUtil.beautifyNominal(totalPrice) + ",00";
                    const values = [
                        i, productFlow.id, product.name, productFlow.expiryDate, count, priceString, totalPriceString, productFlow.flowReferenceId
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