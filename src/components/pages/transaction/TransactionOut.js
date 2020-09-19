import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../../redux/actionCreators'

import * as trxCss from './Transaction.css'
import Label from '../../container/Label';
import InputField from '../../inputs/InputField';
import StockListTable from './StockListTable'
import Message from '../../container/Message'
import TransactionReceipt from './TransactionReceipt'
import * as stringUtil from '../../../utils/StringUtil'
import ActionButtons from '../../buttons/ActionButtons'
import InputDropdown from '../../inputs/InputDropdown'
import { _byId } from '../../../utils/ComponentUtil'
import * as componentUtil from '../../../utils/ComponentUtil'
import AddToCartButton from './AddToCartButton';
import DetailProductPanel from './DetailProductPanel';
import GridComponent from '../../container/GridComponent'
import Card from './../../card/Card';

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


        this.isExistInTheChart = (productId) => {
            if (this.state.productFlows == null) return false;
            return this.getProductFlow(productId) != null;
        }

        this.addToCart = () => {
            if (this.state.quantity <= 0) {
                alert("Please provide valid quantity!"); return;
            }
            let quantity = this.state.quantity;
            let productFlowStock = this.props.productFlowStock;
            if (quantity > productFlowStock.count) {
                alert("Stock unavailable!"); return;
            }

            // let productFlow = productFlowStock.id;
            if (this.isExistInTheChart(productFlowStock.id))
                if (!window.confirm("The product already exist in the chart, do you want to override it?"))
                    return;

            let ID = Math.floor(Math.random() * 1000);
            let newProductFlow = {
                "id": ID,
                "product": productFlowStock,
                "price": productFlowStock.price,
                "count": quantity,
                // "expiryDate": productFlow.expiryDate,
                "flowReferenceId": 0,//productFlow.id,
                //stock list table identifier
                "entityId": productFlowStock.id,
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

        this.getProductFlow = (productId) => {
            if (this.state.productFlows == null) return null;
            for (let index = 0; index < this.state.productFlows.length; index++) {
                if (this.state.productFlows[index].product.id == productId) return this.state.productFlows[index];
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

        this.selectproduct = (productCode) => {
            if (this.props.products == null) {
                alert("Data not found!");
                return;
            }
            for (let i = 0; i < this.props.products.length; i++)
                if (this.props.products[i].code == productCode) {
                    this.setState({ productName: this.props.products[i].name });
                }

            this.setState({ stockId: productCode });
            this.getStockInfo(productCode);
            this.props.resetProductStocks();
        }

        this.detailStockComponent = () => {
            if (this.props.productFlowStock) {
                return (<DetailProductPanel stockView={true} product={this.props.productFlowStock} />);
            }
            return <></>

        }

        this.buttonAddToCart = () => {
            if (this.props.productFlowStock != null)
                return <AddToCartButton onClick={this.addToCart} />
            else
                return <></>
        }
    }
    componentDidMount() {
        document.title = "Selling";
    }
    componentDidUpdate() {
        if (_byId(this.state.activeField) != null) {
            _byId(this.state.activeField).focus();
        }
    }

    getProductListView() {
        const productList = [];

        if (this.props.products != null)
            for (let i = 0; i < this.props.products.length; i++) {
                const product = this.props.products[i];
                productList.push({ value: product.code, text: product.name });
            }
        return productList;
    }

    getCustomerListView(){
        const customerList = [];

        if (this.props.customersData != null)
            for (let i = 0; i < this.props.customersData.length; i++) {
                const customer = this.props.customersData[i];
                customerList.push({ value: customer.id, text: customer.name });
            }
        return customerList;
    }

    messageComponent(){
        let message = <></>;
        if (this.state.messageShow == true) {
            message = <Message withTimer={true} text={this.state.messageText} endMessage={this.endMessage} type={this.state.messageType} />
        }
        return message;
    }

    render() {
        let totalPrice = this.calculateTotalPrice(); 

        let customerList = this.getCustomerListView();
        let productList = this.getProductListView();

        let formComponent = <table><tbody>
            <tr valign="top"><td>
                <Card title="Transaction Detail" content={<>
                    <GridComponent cols={1} items={[
                        <Label text="Customer" />,
                        <InputDropdown value={this.state.customerName} onSelect={this.selectCustomer} dropdownList={customerList}
                            onKeyUp={this.getCustomerList} id="input-customer-name-sell" placeholder="customer name" />,
                        <Label text="Product" />,
                        <InputDropdown value={this.state.productName} onSelect={this.selectproduct} dropdownList={productList}
                            onKeyUp={this.getProductStockList} id="input-product-name-sell" placeholder="product name" />,
                        <Label text="Quantity" />,
                        <InputField id="input-quantity-sell"
                            value={this.state.quantity} onKeyUp={(value, id) => this.setState({ activeField: id, quantity: value })}
                            type="number" placeholder="quantity" />
                    ]}
                    />
                    <this.buttonAddToCart />

                </>}
                />

            </td><td><this.detailStockComponent /></td></tr>
        </tbody></table>;

        let buttonsData = [
            { text: "Back", status: "secondary", onClick: () => this.props.setFeatureCode(null), id: "btn-back" },
            { text: "Back And Reset", status: "warning btn-sm", onClick: () => { this.props.setFeatureCode(null); this.reset() }, id: "btn-back" },
            { text: "Reset", status: 'danger btn-sm', id: "btn-reset-trx", onClick: this.reset }];

        if (this.props.successTransaction) {
            formComponent = <TransactionReceipt status="Success" transactionData={this.props.transactionData} />
        } else {
            buttonsData.push({ id: "btn-submit-trx", status: 'success btn-sm', text: "Submit Transaction", onClick: this.submitTransaction });
        }

        return (
            <div className="transaction-container">
                <this.messageComponent />
                 
                <h2>Selling {this.state.customer && this.state.customer.name ? "[" + this.state.customer.name + "]" : ""}</h2>
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
        products: state.transactionState.products
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