import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../redux/actionCreators'

import '../css/Common.css'
import '../css/Transaction.css'
import '../css/CatalogItem.css'
import ActionButton from './ActionButton'
import Label from './Label';
import InputField from './InputField';
import DetailStock from './DetailStock';
import StockListTable from './StockListTable'
import Message from './Message'

class TransactionOut extends Component {

    constructor(props) {
        super(props);
        this.state = { productFlowStock: {},  showDetail: false, productFlows: [], messageShow: false, messageType:"" }

        this.getStockInfo = () => {
            let stockId = document.getElementById("input-stock-id").value;
            this.props.getStockInfo(stockId);
            this.setState({ showDetail: true })
        }

        this.isExistInTheChart = (flowId) => {
            if (this.state.productFlows == null) return false;

            for (let index = 0; index < this.state.productFlows.length; index++) {
                const productFlow = this.state.productFlows[index];
                if (productFlow.flowReferenceId == flowId) { return true; }
            }
            return false;
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
            if (this.isExistInTheChart(productFlow.id)) {
                if (!window.confirm("The product already exist in the chart, do you want to override it?")) {
                    return;
                }
            }
            let ID = Math.floor(Math.random() * 1000);
            let newProductFlow = {
                "id": ID,
                "product": productFlow.product,
                "price": productFlow.product.price,
                "count": quantity,
                "expiryDate": productFlow.expiryDate,
                "flowReferenceId": productFlow.id

            };

            //update list in the state
            this.addProductFlow(newProductFlow);
        }

        this.addProductFlow = (productFlow) => {
            let currentFlows = this.state.productFlows;
            let existing = this.getProductFlow(productFlow.flowReferenceId);
            /**
             * update
             */
            if (existing != null) {
                for (let index = 0; index < this.state.productFlows.length; index++) {
                    const element = this.state.productFlows[index];
                    if (element.flowReferenceId == productFlow.flowReferenceId) {
                        currentFlows[index] = productFlow;
                    }
                }
            } else {
                /**
                 * add new
                 */
                currentFlows.push(productFlow);
            }

            this.setState({ productFlows: currentFlows });
            this.showMessage("Success saving to chart","success");
            this.clearFields();
        }

        this.getProductFlow = (flowId) => {
            if (this.state.productFlows == null) return null;
            for (let index = 0; index < this.state.productFlows.length; index++) {
                const productFlow = this.state.productFlows[index];
                if (productFlow.flowReferenceId == flowId) {
                    return productFlow;
                }
            }
            return null;
        }

        this.clearFields = () => {
            document.getElementById("input-quantity").value = 0;
            document.getElementById("input-stock-id").value = 0;
        }

        this.handleEdit = (stockId) => {
            alert("will Edit: " + stockId);
            this.props.getStockInfo(stockId);
            let productFlow = this.getProductFlow(stockId);
            document.getElementById("input-quantity").value = productFlow.count;
        }

        this.handleDelete = (stockId) => {
            if (!window.confirm("Are you sure want to delete this from chart?")) {
                return;
            }
            if (!this.isExistInTheChart(stockId)) {
                alert("Record does not exist in the chart!");
                return;
            }
            let currentFlows = this.state.productFlows;
            for (let index = 0; index < this.state.productFlows.length; index++) {
                const element = this.state.productFlows[index];
                if (element.flowReferenceId == stockId) {
                    currentFlows.splice(index, 1);
                }
            }
            this.setState({ productFlows: currentFlows });
        }

        this.submitTransaction = () => {
            if (!window.confirm("Are you sure want to proceed?")) { return }
            let request = {
                productFlows: this.state.productFlows
            };
            this.props.submitPurchaseTransaction(request);
        }

        this.endMessage = () => {
            this.setState({ messageShow: false })
        }

        this.showMessage = (text, type) => {
            this.setState({messageShow:true, messageText:text, messageType:type});
        }
    }
    componentDidMount() {
        document.title = "Transaction::Out";
        if (this.props.productFlowStock && this.props.productFlowStock.productFlow)
            document.getElementById("input-stock-id").value = this.props.productFlowStock.productFlow.id
    }
    componentDidUpdate() {
        if (this.props.productFlowStock && this.props.productFlowStock.productFlow) {
            document.getElementById("input-stock-id").value = this.props.productFlowStock.productFlow.id
        }
    }

    render() {
        let detailStock = "";
        let message = "";

        if (this.props.productFlowStock != null) {
            detailStock = <div className="form-panel rounded">
                <div className="panel-title rounded-top">Product Detail</div>
                <DetailStock productFlowStock={this.props.productFlowStock} />
            </div>;
        }
        if (this.state.messageShow == true) {
            message = <Message text={this.state.messageText} endMessage={this.endMessage} type={this.state.messageType} />
        }

        return (
            <div className="transaction-container">
                {message}
                <h2>Costumer Payment</h2>
                <ActionButton text="Back" onClick={() => this.props.setFeatureCode(null)} />
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div className="form-panel rounded">
                                    <div className="panel-title rounded-top">Payment Form</div>
                                    <Label text="Stock ID" />
                                    <InputField id="input-stock-id" type="number" value="0" />
                                    <ActionButton text="Search" onClick={this.getStockInfo} />
                                    <Label text="Quantity" />
                                    <InputField id="input-quantity" type="number" value="0" />
                                    {this.props.productFlowStock != null ? <ActionButton text="Save" onClick={this.addToCart} /> : ""}
                                </div>
                            </td>
                            <td>
                                {detailStock}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <ActionButton text="Submit Transaction" onClick={this.submitTransaction} />
                </div>
                {/* ======= product list ======== */}
                <h3>Product List</h3>
                <StockListTable handleEdit={this.handleEdit} handleDelete={this.handleDelete} productFlows={this.state.productFlows} />
            </div >
        )
    }
}
const mapStateToProps = state => {
    return {
        productFlowStock: state.transactionState.productFlowStock
    }
}

const mapDispatchToProps = dispatch => ({
    getStockInfo: (stockId) => dispatch(actions.getStockInfo(stockId)),
    submitPurchaseTransaction: (request) => dispatch(actions.submitPurchaseTransaction(request))
})
export default (connect(
    mapStateToProps,
    mapDispatchToProps
)(TransactionOut));