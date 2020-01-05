import React, { Component } from 'react'
import '../css/Common.css'
import '../css/Transaction.css'
import '../css/Entity.css'
import CrudRow from './CrudRow';

class TransactionReceipt extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let transactionReceiptComponent = <p>Loading data ...</p>
        if (this.props.transactionData &&
            this.props.transactionData.user) {
            let transaction = this.props.transactionData;
            transactionReceiptComponent =
                <table className="entity-list-table">
                    <tbody>
                        <CrudRow key="trx_code" values={["Code", transaction.code ]} disabled={true} />
                        <CrudRow key="trx_date" values={["Date", new String(new Date(transaction.transactionDate)) ]} disabled={true} />
                        <CrudRow key="trx_type" values={["Type", transaction.type  ]} disabled={true} />
                        <CrudRow key="trx_customer" values={["Customer", transaction.customer.name ]} disabled={true} />
                    </tbody>
                </table>;
        }

        return (
            <div className="transaction-receipt" >
                {transactionReceiptComponent}
            </div>
        )
    }
}
export default TransactionReceipt;