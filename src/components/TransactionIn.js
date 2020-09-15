import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../redux/actionCreators'

import '../css/Common.css'
import '../css/Transaction.css'
import '../css/CatalogItem.css'
import ActionButton from './buttons/ActionButton'
import Label from './Label';
import InputField from './inputs/InputField';
import DetailProductPanel from './DetailProductPanel';
import StockListTable from './StockListTable'
import Message from './Message'
import TransactionReceipt from './TransactionReceipt'
import * as stringUtil from '../utils/StringUtil'
import ActionButtons from './buttons/ActionButtons'
import InstantTable from '../components/container/InstantTable' 
import * as componentUtil from '../utils/ComponentUtil'
import { _byId } from '../utils/ComponentUtil'
import InputDropdown from './inputs/InputDropdown'

class TransactionIn
    extends Component {

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
                alert("Please provide valid quantity!"); return;
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
                "entityId":product.id
            };

            //update list in the state
            this.addProductFlow(newProductFlow);
            this.emptyForm();
        }

        this.addProductFlow = (productFlow) => {
            let currentFlows = this.state.productFlows;
            //update
            if (this.getProductFlow(productFlow.product.id) != null) {
                for (let index = 0; index < this.state.productFlows.length; index++)
                    if (this.state.productFlows[index].product.id == productFlow.product.id)
                        currentFlows[index] = productFlow;

            } else
                currentFlows.push(productFlow); //add new

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
                if (this.state.products[index].id == id) return this.state.products[id];
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
            for (let index = 0; index < this.state.productFlows.length; index++)
                if (this.state.productFlows[index].product.id == id)
                    currentFlows.splice(index, 1);

            this.setState({ productFlows: currentFlows });
        }

        this.submitTransaction = () => {
            /**
             * check mandatory fields
             */
            if (this.state.supplier.id == null || this.state.productFlows == null || this.state.productFlows.length == 0) {
                alert("Mandatory fields must not be empty!")
                return;
            }

            if (!window.confirm("Are you sure want to proceed?"))
                return;
            let request = { productFlows: this.state.productFlows, supplier: this.state.supplier };
            this.props.submitSupplyTransaction(request, this.props.app);
        }

        this.endMessage = () => { this.setState({ messageShow: false }) }

        this.showMessage = (text, type) => {
            this.setState({ messageShow: true, messageText: text, messageType: type });
        }

        this.reset = () => {
            componentUtil.clearFields(null);
            this.setState({supplier:null,
                productFlows: [], showDetail: false, product: null,
                supplierName: null, productName: null, expiryDate: null, quantity: null, price: null
            });
           
            this.props.resetPurchaseTransaction();
        }

        this.emptyForm = () => {
            this.setState({
                productName: null, expiryDate: null, quantity: null, price: null
            });
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
            if(value == null || value.trim() == ""){ return; } 
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
            if(value == null || value.trim() == ""){ return; }
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
    }
    componentDidMount() {
        if(this.props.resetPurchaseTransaction)
            this.props.resetPurchaseTransaction();
        document.title = "Transaction::In";

    }
    componentDidUpdate() {
        if (_byId(this.state.activeField) != null) {
            _byId(this.state.activeField).focus();
        }
    }

    render() {
        let detailStock = "", message = "", totalPrice = this.calculateTotalPrice();

        if (this.state.product != null) {
            detailStock = <div className="form-panel  ">
                <div className="panel-title  ">Product Detail</div>
                <DetailProductPanel product={this.state.product} />
            </div>;
        }
        if (this.state.messageShow == true) {
            message = <Message withTimer={true} text={this.state.messageText} endMessage={this.endMessage} type={this.state.messageType} />
        }

        let supplierList = [];

        if (this.props.suppliers != null)
            for (let index = 0; index < this.props.suppliers.length; index++) {
                const supplier = this.props.suppliers[index];
                supplierList.push({ value: supplier.id, text: supplier.name });
            }

        let productList = [];
        console.log("==========Products=======:", this.props.products)
        if (this.props.products != null)
            for (let index = 0; index < this.props.products.length; index++) {
                const product = this.props.products[index];
                productList.push({ value: product.id, text: product.name });
            }

        // let stateInfo = <div>
        //     qty: {this.state.quantity},
        //     price: {this.state.price},
        //     exp: {this.state.expiryDate}
        // </div>

        let formComponent = <table><tbody>
            <tr valign="top"><td>
                <div className="form-panel  ">
                    <div className="panel-title  ">Transaction Detail</div>
                    <InstantTable
                        disabled={true} rows={[
                            {
                                values: [<InputDropdown onSelect={this.selectSupplier} dropdownList={supplierList}
                                    value={this.state.supplierName}
                                    onKeyUp={this.getSupplierList} id="input-supplier-name" placeholder="supplier name" />]
                            },
                            {
                                values: [<InputDropdown onSelect={this.selectProduct} id="input-product-name" dropdownList={productList}
                                    value={this.state.productName}
                                    onKeyUp={this.getProductList} placeholder="input product name" />]
                            },
                            {
                                values: [<InputField id="input-product-price"
                                    value={this.state.price} onKeyUp={(value, id) => this.setState({ activeField: id, price: value })}
                                    type="number" placeholder="input product price" />]
                            },
                            {
                                values: [<InputField id="input-quantity"
                                    value={this.state.quantity} onKeyUp={(value, id) => this.setState({ activeField: id, quantity: value })}
                                    type="number" placeholder="quantity" />]
                            },
                            {
                                values:[<Label text="Expiry Date"/>]
                            },
                            {
                                values: [<InputField id="input-exp-date"
                                    value={this.state.expiryDate} onKeyUp={(value, id) => this.setState({ activeField: id, expiryDate: value })}
                                    type="date" placeholder="input product exp date" />]
                            }
                        ]}
                    />
                    {this.state.product != null ? <ActionButton text="Save" onClick={this.addToCart} /> : ""}
                </div>
            </td><td>{detailStock}</td></tr>
        </tbody></table>;

        let buttonsData = [
            { text: "Back", onClick: () => this.props.setFeatureCode(null), id: "btn-back" },
            { text: "Back And Reset", status: "warning", onClick: () => { this.props.setFeatureCode(null); this.reset() }, id: "btn-back-reset" }, 
            { text: "Reset", status: 'danger', id: "btn-reset-trx", onClick: this.reset }];

        if (this.props.successTransaction) {
            formComponent =
                <TransactionReceipt status="Success" transactionData={this.props.transactionData} /> 
        }else{
            buttonsData.push({ id: "btn-submit-trx", status: 'submit', text: "Submit Transaction", onClick: this.submitTransaction });
        }

        return (
            <div className="transaction-container">
                {message}
                <h2>Product Supply From {this.state.supplier && this.state.supplier.name ? "["+this.state.supplier.name+"]" : null}</h2>
                {/* {stateInfo} */}
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
)(TransactionIn));