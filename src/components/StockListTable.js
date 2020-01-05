import React, { Component } from 'react'
import CrudRow from './CrudRow';
import '../css/Entity.css'

class StockListTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let headers = [
            "No", "Flow ID", "Product Name", "Expiry Date", "Quantity", "Price @Item", "Reff Stock ID", "Option"
        ]

        let productFlows = this.props.productFlows;
        let i = 1;
        let stockListRow =
            productFlows.map(
                productFlow  => {
                    let product = productFlow.product ? productFlow.product : {};
                    let values = [
                        i, productFlow.id, product.name, productFlow.expiryDate, productFlow.count, product.price, productFlow.flowReferenceId
                    ];
                    i++;
                    return <CrudRow handleDelete={this.props.handleDelete} handleEdit={this.props.handleEdit} key={"product-list-k"+i+"_"+productFlow.id} identifier={productFlow.flowReferenceId} values={values} />
                }
            );


        return (
            <div className="entity-list">
                <table className="entity-list-table">
                    <thead>
                        <tr>
                            {headers.map( headerValue => <th>{headerValue} </th>)}
                        </tr>
                        {stockListRow}
                    </thead>
                </table>
            </div>
        )
    }

}

export default StockListTable;