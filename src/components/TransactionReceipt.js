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
        const line="--------------------------------------------------------------------------";
        let transactionReceiptComponent = <p>Loading data ...</p>;
        if (this.props.transactionData &&
            this.props.transactionData.user) {
            let transaction = this.props.transactionData;
            transactionReceiptComponent = 
                <InstantTable disabled={true} rows={[ 
                    { id: "trx_code", values: ["Code", transaction.code] },
                    {values:[line], CS:[2]},
                    { id: "trx_date", values: ["Date", new String(new Date(transaction.transactionDate))] },
                    {values:[line], CS:[2]},
                    { id: "trx_type", values: ["Type", transaction.type] },
                    {values:[line], CS:[2]},
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