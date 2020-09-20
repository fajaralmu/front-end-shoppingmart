import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../../redux/actionCreators'

import * as trxCss from './Transaction.css'
import Label from '../../container/Label';
import InputField from '../../inputs/InputField';
import DetailProductPanel from './DetailProductPanel';
import StockListTable from './StockListTable'
import Loader from '../../messages/Loader'
import TransactionReceipt from './TransactionReceipt'
import * as stringUtil from '../../../utils/StringUtil'
import ActionButtons from '../../buttons/ActionButtons'
import * as componentUtil from '../../../utils/ComponentUtil'
import { byId } from '../../../utils/ComponentUtil'
import InputDropdown from '../../inputs/InputDropdown'
import AddToCartButton from './AddToCartButton';
import GridComponent from '../../container/GridComponent';
import Card from '../../card/Card'
import BaseTransactionPage from './BaseTransactionPage';

class TransactionPurchasing
    extends BaseTransactionPage {

    constructor(props) {
        super(props);
        this.state = {
            productName: "", supplierName: "", product: null, supplier: {}, showDetail: false, productFlows: [],
            messageShow: false, messageType: "",
            quantity: 0, price: 0, expiryDate: "2020-01-01",
            activeField: ""
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
            let price = this.state.price;
            let expDate = this.state.expiryDate;
            let product = this.state.product;

            if (this.isExistInTheChart(product.id))
                if (!window.confirm("The product already exist in the chart, do you want to override it?"))
                    return;

            let ID = Math.floor(Math.random() * 1000);
            let newProductFlow = {
                "id": ID,
                "product": product,
                "price": price,
                "count": quantity,
                "expiryDate": expDate,
                //for stock list table identifier
                "entityId": product.id
            };

            //update list in the state
            this.addProductFlow(newProductFlow);
            this.emptyForm();
        }

        this.addProductFlow = (productFlow) => {
            let currentFlows = this.state.productFlows;
            //update
            if (this.getProductFlow(productFlow.product.id) != null) {
                for (let index = 0; index < this.state.productFlows.length; index++) {
                    if (this.state.productFlows[index].product.id == productFlow.product.id) {
                        currentFlows[index] = productFlow;
                    }
                }
            } else{
                currentFlows.push(productFlow); //add new
            }
            
            this.setState({ productFlows: currentFlows });
            this.showMessage("Success saving to chart", "success");

        }

        this.getProductFlow = (productId) => {
            if (this.state.productFlows == null) return null;
            for (let i = 0; i < this.state.productFlows.length; i++) {
                if (this.state.productFlows[i].product.id == productId) return this.state.productFlows[i];
            }
            return null;
        }

        this.getProduct = (id) => {
            if (this.state.products == null) return null;
            for (let index = 0; index < this.state.products.length; index++) {
                if (this.state.products[index].id == id) { return this.state.products[id]; }
            }
            return null;
        }

        this.handleEdit = (productId) => {
            alert("will Edit: " + productId);
            let productFlow = this.getProductFlow(productId);
            if (null == productFlow) {
                alert("Data not found");
                return;
            }
            this.setState({ quantity: productFlow.count });
            this.setState({ price: productFlow.price });
            this.setState({ productName: productFlow.product.name });
            this.setState({ expiryDate: productFlow.expiryDate });
            this.setState({ product: productFlow.product })
        }

        this.handleDelete = (id) => {
            if (!window.confirm("Are you sure want to delete this from chart?")) return;

            if (!this.isExistInTheChart(id)) {
                alert("Record does not exist in the chart!");
                return;
            }
            let currentFlows = this.state.productFlows;
            for (let index = 0; index < this.state.productFlows.length; index++) {
                if (this.state.productFlows[index].product.id == id) {
                    currentFlows.splice(index, 1);
                }
            }
            this.setState({ productFlows: currentFlows });
        }

        this.submitTransaction = () => {
            /**
             * check mandatory fields
             */
            if (this.state.supplier.id == null || this.state.productFlows == null || this.state.productFlows.length == 0) {
                this.props.app.infoDialog("Mandatory fields must not be empty!")
                return;
            }

            const app = this;
            this.props.app.confirmDialog("Are you sure want to proceed?", function (e) {
                let request = { productFlows: app.state.productFlows, supplier: app.state.supplier };
                app.props.submitSupplyTransaction(request, app.props.app);
            }, function (e) { });
        }

        this.endMessage = () => { this.setState({ messageShow: false }) }

        this.showMessage = (text, type) => {
            this.setState({ messageShow: true, messageText: text, messageType: type });
        }

        this.reset = () => {
            componentUtil.clearFields(null);
            this.setState({
                supplier: null,
                productFlows: [], showDetail: false, product: null,
                supplierName: null, productName: null, expiryDate: null, quantity: null, price: null
            });

            this.props.resetPurchaseTransaction();
        }

        this.emptyForm = () => {
            //emoty states
            this.setState({
                productName: null, expiryDate: null, quantity: null, price: null
            });

            this.emptyFormValues();
        }

        this.setActiveField = (id) => {
            this.setState({ activeField: id });
        }

        this.calculateTotalPrice = () => {
            let totalPrice = 0;
            if (this.state.productFlows)
                this.state.productFlows.forEach(productFlow => {
                    totalPrice = totalPrice + productFlow.count * productFlow.product.price;
                });

            return stringUtil.beautifyNominal(totalPrice) + (",00");
        }

        this.getSupplierList = (value, id) => {
            if (value == null || value.trim() == "") { return; }
            this.setState({ supplierName: value });
            this.props.getSupplierList(value, this.props.app);
            this.setActiveField(id);
        }

        this.selectSupplier = (id) => {
            if (this.props.suppliers == null) {
                alert("Data not found!");
                return;
            }
            for (let i = 0; i < this.props.suppliers.length; i++)
                if (this.props.suppliers[i].id == id)
                    this.setState({ supplierName: this.props.suppliers[i].name, supplier: this.props.suppliers[i] });
            this.props.resetSuppliers();
        }

        this.getProductList = (value, id) => {
            if (value == null || value.trim() == "") { return; }
            this.addFormFieldId(id);
            this.setState({ showDetail: true, productName: value })
            this.props.getProductList(value, this.props.app);
            this.setActiveField(id);
        }

        this.selectProduct = (id) => {
            if (this.props.products == null) {
                alert("Data not found!");
                return;
            }
            for (let i = 0; i < this.props.products.length; i++)
                if (this.props.products[i].id == id)
                    this.setState({ productName: this.props.products[i].name, product: this.props.products[i] });
            this.props.resetProducts();

        }

        this.messageComponent = () => {
            if (this.state.messageShow == true) {
                return <Loader withTimer={true} text={this.state.messageText} endMessage={this.endMessage} type={this.state.messageType} />
            }
            return <></>
        }
    }
    componentDidMount() {
        if (this.props.resetPurchaseTransaction) {
            this.props.resetPurchaseTransaction();
        }
        document.title = "Purchasing";
        this.formFieldIds = [];
        this.props.resetSuppliers();

    }
    componentDidUpdate() {
        if (byId(this.state.activeField) != null) {
            byId(this.state.activeField).focus();
        }
    }

    getSupplierDropdownData() {
        const supplierList = [];
        if (this.props.suppliers != null)
            for (let index = 0; index < this.props.suppliers.length; index++) {
                const supplier = this.props.suppliers[index];
                supplierList.push({ value: supplier.id, text: supplier.name });
            }
        return supplierList;
    }

    getProductDropdownData() {
        const productList = [];
        if (this.props.products != null)
            for (let index = 0; index < this.props.products.length; index++) {
                const product = this.props.products[index];
                productList.push({ value: product.id, text: product.name });
            }

        return productList;
    }
    render() {
        let totalPrice = this.calculateTotalPrice();

        const detailStock = this.state.product ? <DetailProductPanel product={this.state.product} /> : null;
        const supplierList = this.getSupplierDropdownData();
        const productList = this.getProductDropdownData();

        let formComponent = <div className="row">
            <div className="col-5">
                <Card title="Transaction Detail" content={<>
                    <GridComponent style={{gridRowGap:'5px'}} cols={2}
                        items={[
                            <Label text="Supplier" />,
                            <InputDropdown onSelect={this.selectSupplier} dropdownList={supplierList}
                                value={this.state.supplierName}
                                onKeyUp={this.getSupplierList} id="input-supplier-name-purc" placeholder="supplier name" />,
                            <Label text="Product" />,
                            <InputDropdown onSelect={this.selectProduct} id="input-product-name-purc" dropdownList={productList}
                                value={this.state.productName}
                                onKeyUp={this.getProductList} placeholder="input product name" />,
                            <Label text="Price" />,
                            <InputField id="input-product-price-purc"
                                value={this.state.price} onKeyUp={(value, id) => {
                                    this.setState({ activeField: id, price: value }); this.addFormFieldId(id);
                                }}
                                type="number" placeholder="input product price" />,
                            <Label text="Quantity" />,
                            <InputField id="input-quantity-purc"
                                value={this.state.quantity} onKeyUp={(value, id) => {
                                    this.setState({ activeField: id, quantity: value });  this.addFormFieldId(id);
                                }}
                                type="number" placeholder="quantity" />,
                            <Label text="Expiry Date" />,
                            <InputField id="input-exp-date-purc"
                                value={this.state.expiryDate} onKeyUp={(value, id) => {
                                    this.setState({ activeField: id, expiryDate: value });   this.addFormFieldId(id);
                                }}
                                type="date" placeholder="input product exp date" />
                        ]}
                    />
                    {this.state.product != null ? <AddToCartButton onClick={this.addToCart} /> : ""}
                </>} />
            </div>
            <div className="col-7">{detailStock}</div>
        </div>;

        let buttonsData = [
            { text: "Back", status: "secondary", onClick: () => this.props.setFeatureCode(null), id: "btn-back" },
            { text: "Back And Reset", status: "warning", onClick: () => { this.props.setFeatureCode(null); this.reset() }, id: "btn-back-reset" },
            { text: "Reset", status: 'danger', id: "btn-reset-trx", onClick: this.reset }];

        if (this.props.successTransaction) {
            formComponent =
                <TransactionReceipt status="Success" transactionData={this.props.transactionData} />
        } else {
            buttonsData.push({ id: "btn-submit-trx", status: 'success btn-sm', text: "Submit Transaction", onClick: this.submitTransaction });
        }

        return (
            <div className="transaction-container">
                <this.messageComponent />
                <h2>Purchasing {this.state.supplier && this.state.supplier.name ? <small>{this.state.supplier.name}</small> : null}</h2>

                {formComponent}
                <div>
                    <ActionButtons buttonsData={buttonsData} />
                </div>
                {/* ======= product list ======== */}
                <h3>Product List</h3>
                <StockListTable purchasing={true} disabled={this.props.successTransaction} handleEdit={this.handleEdit} handleDelete={this.handleDelete} productFlows={this.state.productFlows} />
                <Label className="totalprice-info" text={"Total Price: IDR " + totalPrice} />

            </div >
        )
    }
}
const mapStateToProps = state => {
    return {
        selectedProduct: state.transactionState.selectedProduct,
        transactionData: state.transactionState.transactionData,
        successTransaction: state.transactionState.successTransaction,
        suppliers: state.shopState.suppliersData.entities,
        products: state.transactionState.productsData
    }
}

const mapDispatchToProps = dispatch => ({
    getProductList: (productName, app) => dispatch(actions.getProductListTrx(productName, app)),
    submitSupplyTransaction: (request, app) => dispatch(actions.submitSupplyTrx(request, app)),
    resetPurchaseTransaction: () => dispatch(actions.resetPurchaseTransaction()),
    resetSuppliers: () => dispatch(actions.resetSuppliers()),
    resetProducts: () => dispatch(actions.resetProducts()),
    getSupplierList: (name, app) => dispatch(actions.getSupplierList({ name: name, page: 0 }, app))
})
export default (connect(
    mapStateToProps,
    mapDispatchToProps
)(TransactionPurchasing));