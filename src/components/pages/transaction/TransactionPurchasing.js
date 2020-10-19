import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../../redux/actionCreators'

import * as trxCss from './Transaction.css'
import Label from '../../container/Label';
import InputField from '../../inputs/InputField';
import DetailProductPanel from './DetailProductPanel';
import StockListTable from './StockListTable' 
import * as stringUtil from '../../../utils/StringUtil'
import ActionButtons from '../../buttons/ActionButtons'
import * as componentUtil from '../../../utils/ComponentUtil'
import { byId } from '../../../utils/ComponentUtil'
import DynamicDropdown from '../../inputs/DynamicDropdown'
import {AddToCartButton} from './BaseTransactionPage';
import GridComponent from '../../container/GridComponent';
import Card from '../../card/Card' 
import { withRouter } from 'react-router-dom'
import BaseComponent from './../../BaseComponent';
import SupplierService from './../../../services/SupplierService';
import TransactionPurchasingService from './../../../services/TransactionPurchasingService';

const FIELD_IDS = {
    supplierName: "input-supplier-name-purc",
    supplierCode: "input-suppluer-code",
    productName: "input-product-name-purc",
    productCode: "input-product-code-purc",
    productPrice: "input-product-price-purc",
    productQuantity: "input-quantity-purc",
    productExpiryDate: "input-exp-date-purc"
}

class TransactionPurchasing extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            productName: "", supplierName: "", product: null, supplier: {}, showDetail: false, productFlows: [],
            messageShow: false, messageType: "",
            quantity: 0, price: 0, expiryDate: "2020-01-01",
            activeField: "",
            
            products: [], //for product dropdown
            suppliers: [] //for supplier dropdown
        }
        this.supplierService = SupplierService.instance;
        this.purchasingService = TransactionPurchasingService.instance;

        this.isExistInTheChart = (productId) => {
            if (this.state.productFlows == null) return false;
            return this.getProductFlow(productId) != null;
        }

        this.addToCart = () => {
            if (this.state.quantity <= 0) {
                this.props.app.infoDialog("Please provide valid quantity!"); return;
            }
            const quantity = this.state.quantity;
            const price = this.state.price;
            const expDate = this.state.expiryDate;
            const product = this.state.product;

            if (this.isExistInTheChart(product.id))
                if (!window.confirm("The product already exist in the chart, do you want to override it?"))
                { return; }

            const id = Math.floor(Math.random() * 1000);
            const newProductFlow = {
                "id": id,
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
            const currentFlows = this.state.productFlows;
            //update
            if (this.getProductFlow(productFlow.product.id) != null) {
                for (let i = 0; i < currentFlows.length; i++) {
                    if (currentFlows[i].product.id == productFlow.product.id) {
                        currentFlows[i] = productFlow;
                    }
                }
            } else{
                currentFlows.push(productFlow); //add new
            }
            
            this.setState({ productFlows: currentFlows });
        }

        this.getProductFlow = (productId) => {
            const currentFlows = this.state.productFlows;
            if (currentFlows == null) return null;
            for (let i = 0; i < currentFlows.length; i++) {
                if (currentFlows[i].product.id == productId) return currentFlows[i];
            }
            return null;
        } 

        this.handleEdit = (productId) => {
            alert("will Edit: " + productId);
            const productFlow = this.getProductFlow(productId);
            if (null == productFlow) {
                alert("Data not found");
                return;
            }
            const product = productFlow.product;
            byId(FIELD_IDS.productCode).value = product.code;
            byId(FIELD_IDS.productName).value = product.name;
            byId(FIELD_IDS.productQuantity).value = productFlow.count ;
            byId(FIELD_IDS.productExpiryDate).value = productFlow.expiryDate;
            byId(FIELD_IDS.productPrice).value = productFlow.price ;
            this.setState({ quantity: productFlow.count,
                price: productFlow.price,
                productName: productFlow.product.name,
                expiryDate: productFlow.expiryDate,
                product: product });
        }

        this.handleDelete = (id) => {
            if (!window.confirm("Are you sure want to delete this from chart?")) return;

            if (!this.isExistInTheChart(id)) {
                alert("Record does not exist in the chart!");
                return;
            }
            const currentFlows = this.state.productFlows;
            for (let index = 0; index < this.state.productFlows.length; index++) {
                if (this.state.productFlows[index].product.id == id) {
                    currentFlows.splice(index, 1);
                    break;
                }
            }
            this.setState({ productFlows: currentFlows });
            componentUtil.clearFields(null);
        }

        this.submitTransaction = () => {
            /**
             * check mandatory fields
             */
            if (this.state.supplier == null || this.state.supplier.id == null || this.state.productFlows == null || this.state.productFlows.length == 0) {
                this.parentApp.infoDialog("Mandatory fields must not be empty!")
                return;
            }

            const app = this;
            this.parentApp.confirmDialog("Are you sure want to proceed?", function (e) {
                let request = { productFlows: app.state.productFlows, supplier: app.state.supplier };
                app.props.submitSupplyTransaction(request, app.props.app);
            }, function (e) { });
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

            componentUtil.clearFields(null);
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
            this.setActiveField(id);
            this.fetchSuppliers({ key:'name', value: value});
        }

        this.getSupplierByCode = (value, id) => {
            this.setActiveField(id); 
            const request = {key:'id', value: value, limit:1, exacts: true };
            this.commonAjax(this.supplierService.getSupplierList, request, this.handleGetSuppliersByCode);
        }

        this.fetchSuppliers = (request) => {
            this.commonAjax(this.supplierService.getSupplierList, request, this.handleGetSuppliers);
        }

        this.handleGetSuppliersByCode = (response) => {
            this.handleGetSuppliers(response);
            this.selectSupplier(response.entities[0].id);
        }

        this.handleGetSuppliers = (response) => {
            this.setState({suppliers: response.entities});
        }

        this.selectSupplier = (id) => {
            if (this.state.suppliers == null || this.state.suppliers.length == 0) {
                alert("Data not found!");
                return;
            }
            for (let i = 0; i < this.state.suppliers.length; i++) {
                const supplier = this.state.suppliers[i];
                if (supplier.id == id) {
                    this.displaySupplierInfo(supplier); 
                    this.setState({ supplierName: supplier.name, supplier: supplier });
                }
            }
            this.resetSuppliers();
        }

        this.resetSuppliers = () => {
            this.setState({suppliers:[]});
        }

        this.displaySupplierInfo = (supplier) => {
            byId(FIELD_IDS.supplierName).value = supplier.name; 
            byId(FIELD_IDS.supplierCode).value = supplier.id; 
        }

        this.getProductList = (value, id) => {
            if (value == null || value.trim() == "") { return; }

            this.setActiveField(id); 
            this.setState({ showDetail: true, productName: value })
            this.fetchProducts({ key:'name', value: value }); 
        }

        this.getProductByCode = (value, id) => {
            const app = this;
             
            this.setState({ showDetail: true }); 
            this.setActiveField(id);
            const request = { exacts: true, key:'code', value: value};
            this.commonAjax(this.purchasingService.getProductList, request, this.handleProductListByCode);
        }

        this.fetchProducts = (request) => {
             
            this.commonAjax(this.purchasingService.getProductList, request, this.handleGetProducts);
        }

        this.handleProductListByCode = (response) => {
            this.handleGetProducts(response);
            const product = response.entities[0];
            this.selectProduct(product.id);
        }

        this.handleGetProducts = (response) => {
            this.setState({products: response.entities});
        }

        this.selectProduct = (id) => {
            if (this.state.products == null) {
                alert("Data not found!");
                return;
            }
            const products = this.state.products;
            for (let i = 0; i < products.length; i++) {
                const product = products[i];
                if (product.id == id) {
                    this.setState({ productName: product.name, product: product });
                    this.displayProductInfo(product);
                }
            }
            this.resetProducts();
        } 

        this.displayProductInfo = (product) => {
            byId(FIELD_IDS.productCode).value = product.code;
            byId(FIELD_IDS.productName).value = product.name;
        }

        this.resetProducts = () => {
            this.setState({products:[]});
        }
    }
    componentDidMount() {
        if (this.props.resetPurchaseTransaction) {
            this.props.resetPurchaseTransaction();
        }
        document.title = "Purchasing"; 
        this.props.setMenuCode("purchasing");
        this.resetSuppliers();

    }
    componentDidUpdate() {
        if (this.props.successTransaction) {
            this.props.history.push("/transaction-receipt/"+this.props.transactionData.code);
            return;    
        }
        if (byId(this.state.activeField) != null) {
            byId(this.state.activeField).focus();
        }
    }

    getSupplierDropdownData() {
        const supplierList = [];
        if (this.state.suppliers != null)
            for (let index = 0; index < this.state.suppliers.length; index++) {
                const supplier = this.state.suppliers[index];
                supplierList.push({ value: supplier.id, text: supplier.name });
            }
        return supplierList;
    }

    getProductDropdownData() {
        const productList = [];
        if (this.state.products != null)
            for (let index = 0; index < this.state.products.length; index++) {
                const product = this.state.products[index];
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
                            <DynamicDropdown onSelect={this.selectSupplier} dropdownList={supplierList}
                                value={this.state.supplierName}
                                onKeyUp={this.getSupplierList} id={FIELD_IDS.supplierName} placeholder="supplier name" />,
                            <Label text="Or Supplier ID" />,
                            <InputField onEnterPress={this.getSupplierByCode} id={FIELD_IDS.supplierCode} placeholder="supplier code" />,
                            <Label text="Product Name" />,
                            <DynamicDropdown onSelect={this.selectProduct} id={FIELD_IDS.productName} dropdownList={productList}
                                value={this.state.productName}
                                onKeyUp={this.getProductList} placeholder="input product name" />,
                            <Label text="Or Product Code" />,
                            <InputField onEnterPress={this.getProductByCode} id={FIELD_IDS.productCode} placeholder="product code" />,
                            <Label text="Price" />,
                            <InputField id={FIELD_IDS.productPrice}
                                value={this.state.price} onKeyUp={(value, id) => {
                                    this.setState({ activeField: id, price: value }); ;
                                }}
                                type="number" placeholder="input product price" />,
                            <Label text="Quantity" />,
                            <InputField id={FIELD_IDS.productQuantity}
                                value={this.state.quantity} onKeyUp={(value, id) => {
                                    this.setState({ activeField: id, quantity: value }); ;
                                }}
                                type="number" placeholder="quantity" />,
                            <Label text="Expiry Date" />,
                            <InputField id={FIELD_IDS.productExpiryDate}
                                value={this.state.expiryDate} onKeyUp={(value, id) => {
                                    this.setState({ activeField: id, expiryDate: value });
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
            { text: "Reset", status: 'danger btn-sm', id: "btn-reset-trx", onClick: this.reset },
            { text: "Submit Transaction", status: 'success btn-sm', id: "btn-submit-trx", onClick: this.submitTransaction }];

        return (
            <div className="transaction-container"> 
                {this.state.supplier && this.state.supplier.name ? <h3>Supplier {this.state.supplier.name}</h3> : null}
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
        transactionData: state.transactionState.transactionData,
        successTransaction: state.transactionState.successTransaction
    }
}

const mapDispatchToProps = dispatch => ({ 
    submitSupplyTransaction: (request, app) => dispatch(actions.submitSupplyTrx(request, app)),
    resetPurchaseTransaction: () => dispatch(actions.resetPurchasingAndSelling()),  
})
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(TransactionPurchasing));