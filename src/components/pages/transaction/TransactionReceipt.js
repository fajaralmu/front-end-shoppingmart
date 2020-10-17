import React, { Component } from 'react'
import './Transaction.css'
import InstantTable from '../../container/InstantTable';
function Spinner(props) {
    return <div className="spinner-border text-primary" role="status">
        <span className="sr-only">Loading...</span>
    </div>
}
class TransactionReceipt extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const line = "-".repeat(77);
        let transactionReceiptComponent = <Spinner />;
        let stakeHolder = {};

        if (this.props.transactionData &&
            this.props.transactionData.user) {
            let transaction = this.props.transactionData;

            if (transaction.type == "SELLING") {
                stakeHolder = { id: "trx_customer", values: ["Customer", transaction.customer.name] }
            } else {
                stakeHolder = { id: "trx_supplier", values: ["Supplier", transaction.supplier.name] }
            }

            transactionReceiptComponent =
                <InstantTable disabled={true} rows={[
                    { id: "trx_code", values: ["Code", transaction.code] },
                    { id: "trx_date", values: ["Date", new String(new Date(transaction.transactionDate))] },
                    { id: "trx_type", values: ["Type", transaction.type] },
                    stakeHolder,

                ]} />;
        }

        return (
            <div className="transaction-receipt paper-shadow" >
                <h2>Transaction {this.props.status}</h2>
                {transactionReceiptComponent}
            </div>
        )
    }
}
export default TransactionReceipt;