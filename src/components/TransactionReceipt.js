import React, { Component } from 'react'
import '../css/Common.css'
import '../css/Transaction.css'
import '../css/Entity.css'
import CrudRow from './CrudRow';
import InstantTable from './InstantTable';

class TransactionReceipt extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let transactionReceiptComponent = <p>Loading data ...</p>;
        if (this.props.transactionData &&
            this.props.transactionData.user) {
            let transaction = this.props.transactionData;
            transactionReceiptComponent = 
                <InstantTable disabled={true} rows={[ 
                    { id: "trx_code", values: ["Code", transaction.code] },
                    { id: "trx_date", values: ["Date", new String(new Date(transaction.transactionDate))] },
                    { id: "trx_type", values: ["Type", transaction.type] },
                    { id: "trx_customer", values: ["Customer", transaction.customer.name] },
                ]} />;
        }

        return (
            <div className="transaction-receipt" >
                {transactionReceiptComponent}
            </div>
        )
    }
}
export default TransactionReceipt;