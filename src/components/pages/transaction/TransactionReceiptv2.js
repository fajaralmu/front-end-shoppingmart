import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ContentTitle from '../../container/ContentTitle';
import { resetPurchasingAndSelling } from '../../../redux/actionCreators';
const EMPTY = {
    customer:{},
    supplier:{},
    user:{}
}
class TransactionReceiptv2 extends Component {

    constructor(props) {
        super(props);

        this.isSelling = () => {
            return this.props.transactionData && this.props.transactionData.type == "SELLING";
        }
    }

    componentWillMount() {
        if (!this.props.successTransaction || !this.props.transactionData) {
            this.props.history.push("/login");
        }
    }

    render() {
        const transaction = this.props.transactionData ? this.props.transactionData : EMPTY;
        const date = transaction.transactionDate ? new Date(transaction.transactionDate).toLocaleString() : null;
        return (
            <div className="section-container">
                <ContentTitle iconClass="fas fa-file-alt" title={transaction.type + " Transaction Success (" + transaction.mode + ")"}
                    description={<>{date}</>} />
                <div className="row">
                    {this.isSelling() ? 
                    <><div className="col-3">Customer</div><div className="col-9">{transaction.customer.name}</div></>
                    :<><div className="col-3">Supplier</div><div className="col-9">{transaction.supplier.name}</div></>}
                    <div className="col-3">Operator</div><div className="col-9">{transaction.user.displayName}</div>
                </div>
            </div>
        );
    }
}
const mapDispatchToProps = function (dispatch) {
    const dippatchs = {
        resetPurchaseTransaction: () => dispatch(resetPurchasingAndSelling()),
    }
    return dippatchs;
}
const mapStateToProps = state => {
    return {
        transactionData: state.transactionState.transactionData,
        successTransaction: state.transactionState.successTransaction,
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TransactionReceiptv2));