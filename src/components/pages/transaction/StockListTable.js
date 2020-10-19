import React, { Component } from 'react'
import * as str from '../../../utils/StringUtil'
import CrudRow from '../../container/CrudRow'

const headersEnabled = ["No", "Flow ID", "Product Name", "Expiry Date", "Quantity", "Price @Item", "Total Price", "Reff Stock ID"];
const headersDisabled = [ "No", "Flow ID", "Product Name", "Expiry Date", "Quantity", "Price @Item", "Total Price", "Reff Stock ID", "Option"];

class StockListTable extends Component {
    constructor(props) {
        super(props);

        this.headers = () => {
            let headers; 
            if (this.props.disabled == true) {
                headers = headersEnabled;
            } else {
                headers = headersDisabled;
            };
            return headers;
        }

        this.isPurchasing = () => {
            return this.props.purchasing;
        }
    }

    render() { 
        
        const headers = this.headers(); 
        const productFlows = this.props.productFlows;
        const stockListRow =
            productFlows.map(
                (productFlow, i) => {
                    const product = productFlow.product ? productFlow.product : {};
                    const price = this.isPurchasing() ?  productFlow.price : product.price;
                    const totalPrice = productFlow.count * product.price;
                    const count = str.beautifyNominal(productFlow.count);
                    const priceString = str.beautifyNominal(price) + ",00";
                    const totalPriceString = str.beautifyNominal(totalPrice) + ",00";
                    const values = [
                        (i+1), productFlow.id, product.name, productFlow.expiryDate, count, priceString, totalPriceString, productFlow.flowReferenceId
                    ];
                    
                    return <CrudRow disabled={this.props.disabled}
                        handleDelete={this.props.handleDelete} handleEdit={this.props.handleEdit}
                        key={str.uniqueId() + "-row-trx"}
                        identifier={productFlow.entityId}
                        values={values} />
                }
            );

        let tableStyle = {};

        return (
            <div >
                <table className="table" style={tableStyle}>
                    <thead>
                        <tr key={str.uniqueId() + "-stock"}>
                            {headers.map(value => <th key={str.uniqueId() + "-th"}>{value} </th>)}
                        </tr>
                        {stockListRow}
                    </thead>
                </table>
            </div>
        )
    }

}

export default StockListTable;