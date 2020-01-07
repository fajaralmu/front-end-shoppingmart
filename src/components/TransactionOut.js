import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../redux/actionCreators'

import '../css/Common.css'
import '../css/Transaction.css'
import '../css/CatalogItem.css'
import ActionButton from './ActionButton'
import Label from './Label';
import InputField from './InputField';
import DetailStockPanel from './DetailStockPanel';
import StockListTable from './StockListTable'
import Message from './Message'
import TransactionReceipt from './TransactionReceipt'
import * as stringUtil from '../utils/StringUtil'
import ActionButtons from './ActionButtons'
import InstantTable from './InstantTable'
import InputDropdown from './InputDropdown'
import * as componentUtil from '../utils/ComponentUtil'

class TransactionOut extends Component {

    constructor(props) {
        super(props);
        this.state = { productFlowStock: {}, customer: {}, showDetail: false, productFlows: [], messageShow: false, messageType: "" }

        this.getStockInfo = () => {
            let stockId = document.getElementById("input-stock-id").value;
            this.props.getStockInfo(stockId);
            this.setState({ showDetail: true })
        }

        this.isExistInTheChart = (flowId) => {
            if (this.state.productFlows == null) return false;
            return this.getProductFlow(flowId) != null;
        }

        this.addToCart = () => {
            if (document.getElementById("input-quantity").value <= 0) {
                alert("Please provide valid quantity!"); return;
            }
            let quantity = document.getElementById("input-quantity").value;
            let productFlowStock = this.props.productFlowStock;
            if (quantity > productFlowStock.remainingStock) {
                alert("Stock unavailable!"); return;
            }

            let productFlow = productFlowStock.productFlow;
            if (this.isExistInTheChart(productFlow.id))
                if (!window.confirm("The product already exist in the chart, do you want to override it?"))
                    return;

            let ID = Math.floor(Math.random() * 1000);
            let newProductFlow = {
                "id": ID, "product": productFlow.product, "price": productFlow.product.price,
                "count": quantity, "expiryDate": productFlow.expiryDate, "flowReferenceId": productFlow.id
            };

            //update list in the state
            this.addProductFlow(newProductFlow);
        }

        this.addProductFlow = (productFlow) => {
            let currentFlows = this.state.productFlows;
            //update
            if (this.getProductFlow(productFlow.flowReferenceId) != null) {
                for (let index = 0; index < this.state.productFlows.length; index++)
                    if (this.state.productFlows[index].flowReferenceId == productFlow.flowReferenceId) currentFlows[index] = productFlow;

            } else
                currentFlows.push(productFlow); //add new
 
            this.setState({ productFlows: currentFlows });
            this.showMessage("Success saving to chart", "success");
            componentUtil.clearFields("input-customer-name");
        }

        this.getProductFlow = (flowId) => {
            if (this.state.productFlows == null) return null;
            for (let index = 0; index < this.state.productFlows.length; index++) {
                if (this.state.productFlows[index].flowReferenceId == flowId) return this.state.productFlows[index];
            }
            return null;
        } 

        this.handleEdit = (stockId) => {
            alert("will Edit: " + stockId);
            this.props.getStockInfo(stockId);
            document.getElementById("input-quantity").value = this.getProductFlow(stockId).count;
        }

        this.handleDelete = (stockId) => {
            if (!window.confirm("Are you sure want to delete this from chart?")) return;

            if (!this.isExistInTheChart(stockId)) {
                alert("Record does not exist in the chart!");
                return;
            }
            let currentFlows = this.state.productFlows;
            for (let index = 0; index < this.state.productFlows.length; index++)
                if (this.state.productFlows[index].flowReferenceId == stockId)
                    currentFlows.splice(index, 1);

            this.setState({ productFlows: currentFlows });
        }

        this.submitTransaction = () => {
            /**
             * check mandatory fields
             */
            if (this.state.customer.id == null || this.state.productFlows == null || this.state.productFlows.length == 0) {
                alert("Mandatory fields must not be empty!")
                return;
            }

            if (!window.confirm("Are you sure want to proceed?"))
                return;
            let request = { productFlows: this.state.productFlows, customer: this.state.customer };
            this.props.submitPurchaseTransaction(request);
        }

        this.endMessage = () => {  this.setState({ messageShow: false })  }

        this.showMessage = (text, type) => {
            this.setState({ messageShow: true, messageText: text, messageType: type });
        }

        this.reset = () => {
            componentUtil.clearFields(null);
            this.setState({ productFlows: [], showDetail: false });
            this.props.resetPurchaseTransaction();
        }

        this.calculateTotalPrice = () => {
            let totalPrice = 0;
            if (this.state.productFlows)  
                this.state.productFlows.forEach(productFlow => {
                    totalPrice = totalPrice + productFlow.count * productFlow.product.price;
                }); 
                
            return stringUtil.beautifyNominal(totalPrice) + (",00");
        }

        this.getCustomerList = () => {
            if (document.getElementById("input-customer-name") == null) return;
            let customerName = document.getElementById("input-customer-name").value;
            this.props.getCustomerList(customerName);
        }

        this.selectCustomer = (id) => {
            if (this.props.customersData == null) {
                alert("Data not found!");
                return;
            }
            for (let index = 0; index < this.props.customersData.length; index++)
                if (this.props.customersData[index].id == id)
                    this.setState({ customer: this.props.customersData[index] });
        }
    }
    componentDidMount() {
        document.title = "Transaction::Out";
        if (this.props.productFlowStock && this.props.productFlowStock.productFlow
            && document.getElementById("input-stock-id"))
            document.getElementById("input-stock-id").value = this.props.productFlowStock.productFlow.id
    }
    componentDidUpdate() {
        if (this.props.productFlowStock && this.props.productFlowStock.productFlow
            && document.getElementById("input-stock-id")) {
            document.getElementById("input-stock-id").value = this.props.productFlowStock.productFlow.id
        }
    }

    render() {
        let detailStock = "", message = "", totalPrice = this.calculateTotalPrice();

        if (this.props.productFlowStock != null) {
            detailStock = <div className="form-panel rounded">
                <div className="panel-title rounded-top">Product Detail</div>
                <DetailStockPanel productFlowStock={this.props.productFlowStock} />
            </div>;
        }
        if (this.state.messageShow == true) {
            message = <Message text={this.state.messageText} endMessage={this.endMessage} type={this.state.messageType} />
        }

        let customerList = [];

        if (this.props.customersData != null)
            for (let index = 0; index < this.props.customersData.length; index++) {
                const customer = this.props.customersData[index];
                customerList.push({ value: customer.id, text: customer.name });
            }

        let formComponent = <table><tbody>
            <tr valign="top"> <td>
                <div className="form-panel rounded">
                    <div className="panel-title rounded-top">Payment Form</div>
                    <InstantTable
                        disabled={true} rows={[
                            {
                                values: [<InputDropdown onSelect={this.selectCustomer} dropdownList={customerList}
                                    onKeyUp={this.getCustomerList} id="input-customer-name" placeholder="customer name" />]
                            },
                            {
                                values: [<InputField id="input-stock-id" type="number" placeholder="input stock id" />,
                                <ActionButton id="btn-search-stock" text="Search" onClick={this.getStockInfo} />]
                            },
                            { values: [<InputField id="input-quantity" type="number" placeholder="quantity" />] }
                        ]}
                    />
                    {this.props.productFlowStock != null ? <ActionButton text="Save" onClick={this.addToCart} /> : ""}
                </div>
            </td><td> {detailStock} </td></tr>
        </tbody></table>;

        if (this.props.successTransaction) {
            formComponent = <div>
                <h2>Transaction Success</h2>
                <TransactionReceipt transactionData={this.props.transactionData} />
            </div>
        }

        return (
            <div className="transaction-container">
                {message}
                <h2>Costumer Payment ({this.state.customer.name})</h2>
                {formComponent}
                <div>
                    <ActionButtons buttonsData={[
                        { text: "Back", onClick: () => this.props.setFeatureCode(null), id: "btn-back" },
                        { text: "Back And Reset", status: "warning", onClick: () => { this.props.setFeatureCode(null); this.reset() }, id: "btn-back" },
                        { id: "btn-submit-trx", status: 'submit', text: "Submit Transaction", onClick: this.submitTransaction },
                        { text: "Reset", status: 'danger', id: "btn-reset-trx", onClick: this.reset }]} />
                </div>
                {/* ======= product list ======== */}
                <h3>Product List</h3>
                <StockListTable disabled={this.props.successTransaction} handleEdit={this.handleEdit} handleDelete={this.handleDelete} productFlows={this.state.productFlows} />
                <Label text={"Total Price: IDR " + totalPrice} />

            </div >
        )
    }
}
const mapStateToProps = state => {
    return {
        productFlowStock: state.transactionState.productFlowStock,
        transactionData: state.transactionState.transactionData,
        successTransaction: state.transactionState.successTransaction,
        customersData: state.transactionState.customersData
    }
}

const mapDispatchToProps = dispatch => ({
    getStockInfo: (stockId) => dispatch(actions.getStockInfo(stockId)),
    submitPurchaseTransaction: (request) => dispatch(actions.submitPurchaseTransaction(request)),
    resetPurchaseTransaction: () => dispatch(actions.resetPurchaseTransaction()),
    getCustomerList: (name) => dispatch(actions.getCustomerList(name))
})
export default (connect(
    mapStateToProps,
    mapDispatchToProps
)(TransactionOut));