import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ContentTitle from '../../container/ContentTitle';
import { resetPurchasingAndSelling } from '../../../redux/actionCreators';
import Loader from '../../messages/Loader';
import TransactionService from '../../../services/TransactionService';
import ActionButton from './../../buttons/ActionButton';
const EMPTY = {
    customer:{},
    supplier:{},
    user:{}
}
class TransactionReceiptv2 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            transaction: null,
            error: false,
            loading: false,
            totalPrice: 0
        }
        this.transactionService = TransactionService.instance;
        this.validateLoginStatus = () => {
            if (!this.props.loginStatus) {
                this.props.history.push("/login"); 
            }
        }

        this.isSelling = () => {
            return this.state.transaction && this.state.transaction.type == "SELLING";
        }

        this.handleGetTransactionData = (response) => {
            
            const transaction = response.transaction;
            transaction.productFlows = response.entities;
            const totalPrice = this.calculateTotalPrice(response.entities);
            this.setState({transaction:transaction, error:false, loading:false, totalPrice: totalPrice});
        }

        this.calculateTotalPrice = (productFlows) => {
            let totalPrice = 0;
            for (let i = 0; i < productFlows.length; i++) {
                const productFlow = productFlows[i];
                totalPrice+=(productFlow.count * productFlow.price);
            }

            return totalPrice;
        }

        this.loadTransactionData = () => {
            this.setState({transaction:null, loading: true, error:false});
            const app = this;
            this.transactionService.getTransactionData(this.props.match.params.transactionCode).
                then(function(response){
                    app.handleGetTransactionData(response);
                }).catch(function(error){
                    app.setState({error:true,loading:false})
                });
        }
    }

    componentWillMount() {
        this.validateLoginStatus();
    }

    componentDidMount(){
         this.loadTransactionData();
    }

    render() {
        const transaction = this.state.transaction;
        if(this.state.error == true){
            return (
                <div><h3>Error Loading Transaction</h3><ActionButton text="Reload" onClick={this.loadTransactionData} ></ActionButton></div>
            );
        }
        if(this.state.loading || null == transaction){
            return <Loader ></Loader>
        } 
        const date = transaction.transactionDate ? new Date(transaction.transactionDate).toLocaleString() : null;
        return (
            <div className="section-container">
                <ContentTitle iconClass="fas fa-file-alt" title={transaction.type + " Transaction Success (" + transaction.mode + ")"}
                    description={<>{date}</>} />
                <div className="row">
                    <div className="col-3">Code</div><div className="col-9">{transaction.code}</div>
                    {this.isSelling() ? 
                    <><div className="col-3">Customer</div><div className="col-9">{transaction.customer.name}</div></>
                    :<><div className="col-3">Supplier</div><div className="col-9">{transaction.supplier.name}</div></>}
                    <div className="col-3">Operator</div><div className="col-9">{transaction.user.displayName}</div>
                </div>
                <table className="table">
                    <tr>
                        <th>No</th>
                        <th>Product Name</th>
                        <th>Qty</th>
                        <th>Price @item</th>
                        <th>Total Price</th> 
                    </tr>
                    {transaction.productFlows.map((productFlow, i)=>{
                        const product = productFlow.product;
                        return (
                            <tr>
                                <td>{i+1}</td>
                                <td>{product.name}</td>
                                <td>{productFlow.count}&nbsp;{product.unit.name}</td>
                                <td>{productFlow.price}</td>
                                <td>{productFlow.price * productFlow.count}</td>
                            </tr>
                        )
                    })}
                    <tr><td colSpan="4">Total Price</td><td >{this.state.totalPrice}</td></tr>
                </table>
            </div>
        );
    }
}
const mapDispatchToProps = function (dispatch) {
    const dippatchs = {
        resetPurchasingAndSelling: () => dispatch(resetPurchasingAndSelling()),
    }
    return dippatchs;
}
const mapStateToProps = state => {
    return {
        loginStatus: state.userState.loginStatus,
        transactionData: state.transactionState.transactionData,
        successTransaction: state.transactionState.successTransaction,
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TransactionReceiptv2));