import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ContentTitle from '../../container/ContentTitle';
import { resetPurchasingAndSelling } from '../../../redux/actionCreators'; 
import TransactionService from '../../../services/TransactionService';
import ErrorPage from './../../ErrorPage';
import { CenterLoading } from '../../messages/SimpleLoader';
import * as stringUtil from '../../../utils/StringUtil'
import ActionButton from '../../buttons/ActionButton';
import { TableHeader } from '../../container/Tables';

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

        this.back = () => {
            try{
                const transaction = this.state.transaction;
                this.props.history.push("/transaction/"+transaction.type.toLowerCase()); 
            }catch(e){  }
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

        this.getTransactionCode = () => {
            return this.props.match.params.transactionCode;
        }

        this.loadTransactionData = () => {
            this.setState({transaction:null, loading: true, error:false});
            const app = this;
            this.transactionService.getTransactionData(this.getTransactionCode()).
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
         document.title = "Transaction: "+ this.getTransactionCode();
    }

    render() {
        const transaction = this.state.transaction;
        if(this.state.error == true){
            return (
                <ErrorPage message={"Error Loading Transaction With code: "+this.getTransactionCode()}/>
            );
        }
        if(this.state.loading || null == transaction){
            return <CenterLoading />
        } 
        const date = transaction.transactionDate ? new Date(transaction.transactionDate).toLocaleString() : null;
        return (
            <div className="section-container">
                <ContentTitle iconClass="fas fa-file-alt" title={transaction.type + " Transaction (" + transaction.mode + ")"}
                    description={<>{date}</>} />
                <div className="row">
                    <div className="col-3">Code</div><div className="col-9">{transaction.code}</div>
                    {this.isSelling() ? 
                    <><div className="col-3">Customer</div><div className="col-9">{transaction.customer.name}</div></>
                    :<><div className="col-3">Supplier</div><div className="col-9">{transaction.supplier.name}</div></>}
                    <div className="col-3">Operator</div><div className="col-9">{transaction.user.displayName}</div>
                </div>
                <table className="table"> 
                    <TableHeader values={["No", "Product Name", "Qty", "Price @item", "Total Price"]} />
                    {transaction.productFlows.map((productFlow, i)=>{
                        const product = productFlow.product;
                        return (
                            <tr>
                                <td>{i+1}</td>
                                <td>{product.name}</td>
                                <td><b>{productFlow.count}</b>&nbsp;{product.unit.name}</td>
                                <td>{stringUtil.beautifyNominal(productFlow.price)}</td>
                                <td>{stringUtil.beautifyNominal(productFlow.price * productFlow.count)}</td>
                            </tr>
                        )
                    })}
                    <tr><td colSpan="4">Total Price</td><td className="font-weight-bold" >{stringUtil.beautifyNominal(this.state.totalPrice)}</td></tr>
                </table>
                <ActionButton status="outline-secondary" text="Back" onClick={this.back} />
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