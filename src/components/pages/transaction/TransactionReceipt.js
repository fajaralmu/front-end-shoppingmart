import React, { Component } from 'react' 
import './Transaction.css' 
import InstantTable from '../../container/InstantTable';

class TransactionReceipt extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const line = "-".repeat(77);
        let transactionReceiptComponent = <p>Loading data ...</p>;
        let stakeHolder = {};

        if (this.props.transactionData &&
            this.props.transactionData.user) {
            let transaction = this.props.transactionData;

            if (transaction.type == "OUT") {
                stakeHolder = { id: "trx_customer", values: ["Customer", transaction.customer.name] }
            } else {
                stakeHolder = { id: "trx_supplier", values: ["Supplier", transaction.supplier.name] }
            }

            transactionReceiptComponent =
                <InstantTable disabled={true} rows={[
                    { values: [line], CS: [2] },
                    { id: "trx_code", values: ["Code", transaction.code] },
                    { values: [line], CS: [2] },
                    { id: "trx_date", values: ["Date", new String(new Date(transaction.transactionDate))] },
                    { values: [line], CS: [2] },
                    { id: "trx_type", values: ["Type", transaction.type] },
                    { values: [line], CS: [2] },
                    stakeHolder,
                    { values: [line], CS: [2] },
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