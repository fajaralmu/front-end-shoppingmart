import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../../../redux/actionCreators'
import Label from '../../container/Label';
import InputField from '../../inputs/InputField';
import StockListTable from './StockListTable'
import { withRouter } from 'react-router-dom'
import * as stringUtil from '../../../utils/StringUtil'
import ActionButtons from '../../buttons/ActionButtons'
import DynamicDropdown from '../../inputs/DynamicDropdown'
import { byId } from '../../../utils/ComponentUtil'
import * as componentUtil from '../../../utils/ComponentUtil'
import { AddToCartButton } from './BaseTransactionPage';
import DetailProductPanel from './DetailProductPanel';
import GridComponent from '../../container/GridComponent'
import Card from '../../card/Card'; 
import BaseComponent from './../../BaseComponent';
import TransactionSellingService from './../../../services/TransactionSellingService';

const FIELD_IDS = {
    customerName: "input-customer-name-sell",
    customerCode: "input-customer-code",
    productName: "input-product-name-sell",
    productCode: "input-product-code-sell",
    productQuantity: "input-quantity-sell"
}

class TransactionSelling extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            productName: "",
            customerName: "", product: null,
            customer: null, showDetail: false, productFlows: [], messageShow: false, messageType: "",
            stockId: 0, quantity: 0,
            activeField: "",

            //for dropdown
            customers: [],
            products: []
        }
        this.sellingService = TransactionSellingService.instance;

        this.setActiveField = (id) => {
            this.setState({ activeField: id });
        }

        this.getStockInfo = (productCode) => {
            if (!productCode) { productCode = this.state.productCode; }  
            this.fetchProductInfo(productCode); 
        }

        this.fetchProductInfo = (productCode) => {
            this.commonAjax(this.sellingService.getStockInfo, productCode, this.handleGetStockInfo);
        }

        this.handleGetStockInfo = (response) => {
            const product = response.entities[0];
            this.setState({product:product, productCode: product.code, showDetail: true});
        }

        this.isExistInTheChart = (productId) => {
            if (this.state.productFlows == null) return false;
            return this.getProductFlow(productId) != null;
        }

        this.addToCart = () => {
            if (this.state.quantity <= 0) {
                this.props.app.infoDialog("Please provide valid quantity!"); return;
            }
            let quantity = this.state.quantity;
            let product = this.state.product;
            if (quantity > product.count) {
                this.props.app.infoDialog("Stock unavailable!"); return;
            }

            // let productFlow = productFlowStock.id;
            if (this.isExistInTheChart(product.id))
                if (!window.confirm("The product already exist in the chart, do you want to override it?"))
                    return;

            const id = Math.floor(Math.random() * 1000);
            let newProductFlow = {
                "id": id,
                "product": product,
                "price": product.price,
                "count": quantity,
                // "expiryDate": productFlow.expiryDate,
                "flowReferenceId": 0,//productFlow.id,
                //stock list table identifier
                "entityId": product.id,
            };

            //update list in the state
            this.addProductFlow(newProductFlow);
            this.emptyForm();
        }

        this.addProductFlow = (productFlow) => {
            let currentFlows = this.state.productFlows;
            //update
            if (this.getProductFlow(productFlow.product.id) != null) {
                for (let i = 0; i < this.state.productFlows.length; i++) {
                    if (this.state.productFlows[i].product.id == productFlow.product.id) {
                        currentFlows[i] = productFlow;
                    }
                }
            } else {
                currentFlows.push(productFlow); //add new
            }

            this.setState({ productFlows: currentFlows });

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

        this.handleEdit = (productId) => {
            alert("will Edit: " + productId);
            const productFlow = this.getProductFlow(productId);
            if (null == productFlow) {
                alert("Will modify data that is not found");
                return;
            }
            //validate latest stock
            this.getStockInfo(productFlow.product.code);
            const product = productFlow.product;

            byId(FIELD_IDS.productCode).value = product.code;
            byId(FIELD_IDS.productName).value = product.name;
            byId(FIELD_IDS.productQuantity).value = productFlow.count;

            this.setState({ stockId: productId, quantity: productFlow.count });
        }

        this.handleDelete = (productId) => {
            if (!window.confirm("Are you sure want to delete this from chart?")) return;

            if (!this.isExistInTheChart(productId)) {
                alert("Record does not exist in the chart!");
                return;
            }
            let currentFlows = this.state.productFlows;
            for (let index = 0; index < this.state.productFlows.length; index++) {
                if (this.state.productFlows[index].product.id == productId) {
                    currentFlows.splice(index, 1);
                }
            }

            this.setState({ productFlows: currentFlows });
            componentUtil.clearFields(null);
        }

        this.submitTransaction = () => {
            /**
             * check mandatory fields
             */
            if (this.state.customer == null || this.state.customer.id == null || this.state.productFlows == null || this.state.productFlows.length == 0) {
                this.props.app.infoDialog("Mandatory fields must not be empty!");
                return;
            }
            
            const app = this;
            this.props.app.confirmDialog("Are you sure want to proceed?", function (e) {
                let request = { productFlows: app.state.productFlows, customer: app.state.customer };
                app.props.submitPurchaseTransaction(request, app.props.app);
            }, function (e) { });
        }

        this.reset = () => {
            componentUtil.clearFields(null);
            this.setState({ customerName: null, customer: null, productName: null, product: null, productFlows: [], showDetail: false });
            this.emptyForm();
            this.props.resetPurchaseTransaction();
        }

        this.calculateTotalPrice = () => {
            let totalPrice = 0;
            if (this.state.productFlows) {
                this.state.productFlows.forEach(productFlow => {
                    totalPrice = totalPrice + productFlow.count * productFlow.product.price;
                });
            }
            return stringUtil.beautifyNominal(totalPrice) + (",00");
        }

        this.getCustomerList = (value, id) => {
            this.setState({ customerName: value });
            this.setActiveField(id);
            this.fetchCustomerList({ key: 'name', value: value });
        }

        this.getCustomerByCode = (value, id) => {
            this.setActiveField(id);
            const request = { key: 'id', value: value, exacts: true, limit: 1};
            this.commonAjax(this.sellingService.getCustomerList, request, this.handleGetCustomerListByCode);
        }

        this.fetchCustomerList = (request) => { 
            this.commonAjax(this.sellingService.getCustomerList, request, this.handleGetCustomerList);
        }

        this.handleGetCustomerListByCode = (response) => {
            this.handleGetCustomerList(response);
            const customer = response.entities[0];
            this.selectCustomer(customer.id);
        }

        this.handleGetCustomerList = (response) => {
            this.setState({ customers: response.entities });
        }

        this.selectCustomer = (id) => {
            if (this.state.customers == null) {
                alert("Data not found!");
                return;
            }
            for (let i = 0; i < this.state.customers.length; i++) {
                const customer = this.state.customers[i];
                if (customer.id == id) {
                    this.displayCustomerInfo(customer);
                    this.setState({ customerName: customer.name, customer: customer });
                }
            }
            this.resetCustomers();
        }

        this.resetCustomers = () => {
            this.setState({customers:[]});
        }

        this.displayCustomerInfo = (customer) => {
            byId(FIELD_IDS.customerName).value = customer.name;
            byId(FIELD_IDS.customerCode).value = customer.id;
        }

        this.getProductList = (value, id) => {
            this.setState({ productName: value });
            this.setActiveField(id);
            this.fetchProducts({key:'name', value:value});
        }

        this.getProductListByCode = (value, id) => {
            const productCode = value;
            this.setActiveField(id);
            this.setState({ stockId: productCode });
            this.getStockInfo(productCode);
        } 

        this.fetchProducts = (request) => {
            this.commonAjax(this.sellingService.getProductList, request, this.handleGetProducts);
        }

        this.handleGetProducts = (response) => {
            this.setState({products: response.entities});
        }

        this.selectproduct = (productCode) => {
            if (this.state.products == null) {
                alert("Data not found!");
                return;
            }
            const products = this.state.products;
            for (let i = 0; i <products.length; i++) {
                if (products[i].code == productCode) {
                    this.setState({ productName: products[i].name });
                }
            }

            this.setState({ stockId: productCode });
            this.getStockInfo(productCode);
            this.resetProducts();
        }

        this.resetProducts = () => {
            this.setState({products:[]});
        }

        this.detailStockComponent = () => {
            if (this.state.product) {
                return (<DetailProductPanel stockView={true} product={this.state.product} />);
            }
            return <></>
        }

        this.buttonAddToCart = () => {
            if (this.state.product != null)
                return <AddToCartButton onClick={this.addToCart} />
            else
                return <></>
        }
    }

    componentDidMount() {
        document.title = "Selling";
        this.props.setMenuCode("selling");
    }

    componentDidUpdate() {
        if (this.props.successTransaction) {
            this.props.history.push("/transaction-receipt/" + this.props.transactionData.code);
            return;
        }
        if (byId(this.state.activeField) != null) {
            byId(this.state.activeField).focus();
        }
    }

    getProductDropdownData() {
        const productList = [];
        if (this.state.products != null) {
            for (let i = 0; i < this.state.products.length; i++) {
                const product = this.state.products[i];
                productList.push({ value: product.code, text: product.name });
            }
        }
        return productList;
    }

    getCustomerDropdownData() {
        const customerList = [];

        if (this.state.customers != null) {
            for (let i = 0; i < this.state.customers.length; i++) {
                const customer = this.state.customers[i];
                customerList.push({ value: customer.id, text: customer.name });
            }
        }
        return customerList;
    }


    render() {
        const totalPrice = this.calculateTotalPrice();
        const customerList = this.getCustomerDropdownData();
        const productList = this.getProductDropdownData();

        let formComponent = <div className="row"><div className="col-5">
            <Card title="Transaction Detail" content={<>
                <GridComponent style={{ gridRowGap: '5px' }} cols={2} items={[
                    <Label text="Customer" />,
                    <DynamicDropdown value={this.state.customerName} onSelect={this.selectCustomer} dropdownList={customerList}
                        onKeyUp={this.getCustomerList} id={FIELD_IDS.customerName} placeholder="customer name" />,
                    <Label text="Or Customer ID" />,
                    <InputField onEnterPress={this.getCustomerByCode} id={FIELD_IDS.customerCode} placeholder="customer id" />,
                    <Label text="Product Name" />,
                    <DynamicDropdown value={this.state.productName} onSelect={this.selectproduct} dropdownList={productList}
                        onKeyUp={this.getProductList} id={FIELD_IDS.productName} placeholder="product name" />,
                    <Label text="Or Product Code" />,
                    <InputField onEnterPress={this.getProductListByCode} id={FIELD_IDS.productCode} placeholder="product code" />,
                    <Label text="Quantity" />,
                    <InputField id={FIELD_IDS.productQuantity}
                        value={this.state.quantity} onKeyUp={(value, id) => this.setState({ activeField: id, quantity: value })}
                        type="number" placeholder="quantity" />
                ]}
                />
                <this.buttonAddToCart />
            </>}
            /></div><div className="col-7"><this.detailStockComponent /></div>
        </div>

        const buttonsData = [
            { text: "Reset", status: 'danger btn-sm', id: "btn-reset-trx", onClick: this.reset },
            { text: "Submit Transaction", status: 'success btn-sm', id: "btn-submit-trx", onClick: this.submitTransaction }];

        return (
            <div className="transaction-container">

                {this.state.customer && this.state.customer.name ? <h3>Customer{this.state.customer.name}</h3> : ""}
                {formComponent}
                <div>
                    <ActionButtons buttonsData={buttonsData} />
                </div>

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
    }
}

const mapDispatchToProps = dispatch => ({
     
    submitPurchaseTransaction: (request, app) => dispatch(actions.submitPurchaseTransaction(request, app)),
    resetPurchaseTransaction: () => dispatch(actions.resetPurchasingAndSelling()), 
})
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(TransactionSelling));