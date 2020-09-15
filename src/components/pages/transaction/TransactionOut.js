import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../../redux/actionCreators'

import * as trxCss from './Transaction.css'
import * as catalogItemCss from '../../../css/CatalogItem.css'
import ActionButton from '../../buttons/ActionButton'
import Label from '../../Label';
import InputField from '../../inputs/InputField';
import DetailStockPanel from '../../DetailStockPanel';
import StockListTable from '../../StockListTable'
import Message from '../../Message'
import TransactionReceipt from './TransactionReceipt'
import * as stringUtil from '../../../utils/StringUtil'
import ActionButtons from '../../buttons/ActionButtons'
import InstantTable from '../../container/InstantTable'
import InputDropdown from '../../inputs/InputDropdown'
import { _byId } from '../../../utils/ComponentUtil'
import * as componentUtil from '../../../utils/ComponentUtil'
import CatalogItem from './../../CatalogItem';

class TransactionOut extends Component {

    constructor(props) {
        super(props);
        this.state = {
            productName: "",
            customerName: "", productFlowStock: {},
            customer: {}, showDetail: false, productFlows: [], messageShow: false, messageType: "",
            stockId: 0, quantity: 0,
            activeField: ""
        }

        this.setActiveField = (id) => {
            this.setState({ activeField: id });
        }

        this.getStockInfo = (id) => {
            let stockId = id ? id : this.state.stockId;
            this.props.getStockInfo(stockId, this.props.app);
            this.setState({ stockId: id, showDetail: true })
        }


        this.isExistInTheChart = (flowId) => {
            if (this.state.productFlows == null) return false;
            return this.getProductFlow(flowId) != null;
        }

        this.addToCart = () => {
            if (this.state.quantity <= 0) {
                alert("Please provide valid quantity!"); return;
            }
            let quantity = this.state.quantity;
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
                "id": ID,
                "product": productFlow.product,
                "price": productFlow.product.price,
                "count": quantity,
                "expiryDate": productFlow.expiryDate,
                "flowReferenceId": productFlow.id,
                //stock list table identifier
                "entityId": productFlow.id,
            };

            //update list in the state
            this.addProductFlow(newProductFlow);
            this.emptyForm();
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

        this.emptyForm = () => {
            this.setState({ productName: null, stockId: 0, quantity: 0 });
        }

        this.handleEdit = (stockId) => {
            alert("will Edit: " + stockId);
            this.props.getStockInfo(stockId, this.props.app);
            this.setState({ stockId: stockId, quantity: this.getProductFlow(stockId).count });
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
            this.props.submitPurchaseTransaction(request, this.props.app);
        }

        this.endMessage = () => { this.setState({ messageShow: false }) }

        this.showMessage = (text, type) => {
            this.setState({ messageShow: true, messageText: text, messageType: type });
        }

        this.reset = () => {
            componentUtil.clearFields(null);
            this.setState({ customerName: null, customer: null, productName: null, product: null, productFlows: [], showDetail: false });
            this.emptyForm();
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

        this.getCustomerList = (value, id) => {
            this.setState({ customerName: value });
            this.setActiveField(id);
            this.props.getCustomerList(value, this.props.app);
        }

        this.selectCustomer = (id) => {
            if (this.props.customersData == null) {
                alert("Data not found!");
                return;
            }
            for (let index = 0; index < this.props.customersData.length; index++)
                if (this.props.customersData[index].id == id)
                    this.setState({ customerName: this.props.customersData[index].name, customer: this.props.customersData[index] });
            this.props.resetCustomers();
        }


        this.getProductStockList = (value, id) => {
            this.setState({ productName: value });
            this.setActiveField(id);
            this.props.getProductStockList(value, this.props.app);

        }

        this.selectproduct = (id) => {
            if (this.props.productFlowStocks == null) {
                alert("Data not found!");
                return;
            }
            for (let i = 0; i < this.props.productFlowStocks.length; i++)
                if (this.props.productFlowStocks[i].id == id) {
                    this.setState({ productName: this.props.productFlowStocks[i].product.name });
                }

            this.setState({ stockId: id });
            this.getStockInfo(id);
            this.props.resetProductStocks();
        }
    }
    componentDidMount() {
        document.title = "Transaction::Out";
    }
    componentDidUpdate() {
        if (_byId(this.state.activeField) != null) {
            _byId(this.state.activeField).focus();
        }
    }

    render() {
        let detailStock = "", message = "", totalPrice = this.calculateTotalPrice();

        if (this.props.productFlowStock != null) {
            detailStock = <div className="form-panel  ">
                <div className="panel-title ">Product Detail</div>
                <DetailStockPanel productFlowStock={this.props.productFlowStock} />
            </div>;
        }
        if (this.state.messageShow == true) {
            message = <Message withTimer={true} text={this.state.messageText} endMessage={this.endMessage} type={this.state.messageType} />
        }

        let customerList = [];

        if (this.props.customersData != null)
            for (let i = 0; i < this.props.customersData.length; i++) {
                const customer = this.props.customersData[i];
                customerList.push({ value: customer.id, text: customer.name });
            }
        let productList = [];

        if (this.props.productFlowStocks != null)
            for (let i = 0; i < this.props.productFlowStocks.length; i++) {
                const productFlowStock = this.props.productFlowStocks[i];
                let productItem = <div>
                    <h3>{productFlowStock.product.name}</h3>
                    <p>ID: {productFlowStock.id}, stock: {productFlowStock.count}</p>
                </div>
                productList.push({ value: productFlowStock.id, text: productItem });
            }

        let formComponent = <table><tbody>
            <tr valign="top"><td>
                <div className="form-panel ">
                    <div className="panel-title ">Transaction Detail</div>
                    <InstantTable
                        disabled={true} rows={[
                            {
                                values: [<InputDropdown value={this.state.customerName} onSelect={this.selectCustomer} dropdownList={customerList}
                                    onKeyUp={this.getCustomerList} id="input-customer-name" placeholder="customer name" />]
                            },
                            {
                                values: [<InputDropdown value={this.state.productName} onSelect={this.selectproduct} dropdownList={productList}
                                    onKeyUp={this.getProductStockList} id="input-product-name" placeholder="product name" />]
                            },
                            {
                                values: [<InputField id="input-stock-id"
                                    value={this.state.stockId} onKeyUp={(value, id) => this.setState({ activeField: id, stockId: value })}
                                    type="number" placeholder="input stock id" />,
                                <ActionButton id="btn-search-stock" text="Search" onClick={this.getStockInfo} />]
                            },
                            {
                                values: [<InputField id="input-quantity"
                                    value={this.state.quantity} onKeyUp={(value, id) => this.setState({ activeField: id, quantity: value })}
                                    type="number" placeholder="quantity" />]
                            }
                        ]}
                    />
                    {this.props.productFlowStock != null ? <ActionButton text="Save" onClick={this.addToCart} /> : ""}
                </div>
            </td><td>{detailStock}</td></tr>
        </tbody></table>;

        let buttonsData = [
            { text: "Back", onClick: () => this.props.setFeatureCode(null), id: "btn-back" },
            { text: "Back And Reset", status: "warning", onClick: () => { this.props.setFeatureCode(null); this.reset() }, id: "btn-back" },
            { text: "Reset", status: 'danger', id: "btn-reset-trx", onClick: this.reset }];

        if (this.props.successTransaction) {
            formComponent = <TransactionReceipt status="Success" transactionData={this.props.transactionData} />
        } else {
            buttonsData.push({ id: "btn-submit-trx", status: 'submit', text: "Submit Transaction", onClick: this.submitTransaction });
        }

        return (
            <div className="transaction-container">
                {message}
                {/* {stateInfo} */}
                <h2>Customer Purchase {this.state.customer && this.state.customer.name ? "[" + this.state.customer.name + "]" : ""}</h2>
                {formComponent}
                <div>
                    <ActionButtons buttonsData={buttonsData} />
                </div>
                {/* ======= product list ======== */}
                <h3>Product List</h3>
                <StockListTable disabled={this.props.successTransaction} handleEdit={this.handleEdit} handleDelete={this.handleDelete} productFlows={this.state.productFlows} />
                <Label className="totalprice-info" text={"Total Price: IDR " + totalPrice} />

            </div >
        )
    }
}
const mapStateToProps = state => {
    return {
        productFlowStock: state.transactionState.productFlowStock,
        transactionData: state.transactionState.transactionData,
        successTransaction: state.transactionState.successTransaction,
        customersData: state.transactionState.customersData,
        productFlowStocks: state.transactionState.productFlowStocks
    }
}

const mapDispatchToProps = dispatch => ({
    resetCustomers: () => dispatch(actions.resetCustomers()),
    getStockInfo: (stockId, app) => dispatch(actions.getStockInfo(stockId, app)),
    submitPurchaseTransaction: (request, app) => dispatch(actions.submitPurchaseTransaction(request, app)),
    resetPurchaseTransaction: () => dispatch(actions.resetPurchaseTransaction()),
    resetProductStocks: () => (dispatch(actions.resetProductStocks())),
    getCustomerList: (name, app) => dispatch(actions.getCustomerList(name, app)),
    getProductStockList: (name, app) => dispatch(actions.getProductStocks(name, app))
})
export default (connect(
    mapStateToProps,
    mapDispatchToProps
)(TransactionOut));