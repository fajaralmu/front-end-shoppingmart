import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../redux/actionCreators'

import '../css/Common.css'
import '../css/Transaction.css'
import '../css/CatalogItem.css'
import ActionButton from './ActionButton'
import Label from './Label';
import InputField from './InputField';
import DetailProductPanel from './DetailProductPanel';
import StockListTable from './StockListTable'
import Message from './Message'
import TransactionReceipt from './TransactionReceipt'
import * as stringUtil from '../utils/StringUtil'
import ActionButtons from './ActionButtons'
import InstantTable from './InstantTable'
import InputDropdown from './InputDropdown'
import * as componentUtil from '../utils/ComponentUtil'
import { _byId } from '../utils/ComponentUtil'

class TransactionIn
    extends Component {

    constructor(props) {
        super(props);
        this.state = { product: null, supplier: {}, showDetail: false, productFlows: [], messageShow: false, messageType: "" }

        this.getProductList = () => {
            let productName = _byId("input-product-name").value;
            this.props.getProductList(productName);
            this.setState({ showDetail: true })
        }

        this.isExistInTheChart = (productId) => {
            if (this.state.productFlows == null) return false;
            return this.getProductFlow(productId) != null;
        }

        this.addToCart = () => {
            if (_byId("input-quantity").value <= 0) {
                alert("Please provide valid quantity!"); return;
            }
            let quantity = _byId("input-quantity").value;
            let price = _byId("input-product-price").value;
            let expDate = _byId("input-product-exp-date").value;
            let product = this.state.product 
 
            if (this.isExistInTheChart(product.id))
                if (!window.confirm("The product already exist in the chart, do you want to override it?"))
                    return;

            let ID = Math.floor(Math.random() * 1000);
            let newProductFlow = {
                "id": ID,
                "product":  product, 
                "price": price,
                "count": quantity, 
                "expiryDate": expDate,
                flowReferenceId: product.id
            };

            //update list in the state
            this.addProductFlow(newProductFlow);
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
            componentUtil.clearFields("input-supplier-name");
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
            if(null == productFlow){
                alert("Data not found");
                return;
            }
            _byId("input-quantity").value = productFlow.count;
            _byId("input-product-price").value = productFlow.price;
            _byId("input-product-name").value = productFlow.product.name;
            _byId("input-product-exp-date").value = productFlow.expiryDate;
            this.setState({product:productFlow.product})
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
            this.props.submitSupplyTransaction(request);
        }

        this.endMessage = () => { this.setState({ messageShow: false }) }

        this.showMessage = (text, type) => {
            this.setState({ messageShow: true, messageText: text, messageType: type });
        }

        this.reset = () => {
            componentUtil.clearFields(null);
            this.setState({ productFlows: [], showDetail: false, product:null });
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

        this.getSupplierList = () => {
            if (_byId("input-supplier-name") == null) return;
            let supplierName = _byId("input-supplier-name").value;
            this.props.getSupplierList(supplierName);
        }

        this.selectSupplier = (id) => {
            if (this.props.suppliers == null) {
                alert("Data not found!");
                return;
            }
            for (let i = 0; i < this.props.suppliers.length; i++)
                if (this.props.suppliers[i].id == id)
                    this.setState({ supplier: this.props.suppliers[i] });
        }

        this.selectProduct = (id) => {
            if (this.props.products == null) {
                alert("Data not found!");
                return;
            }
            for (let i = 0; i < this.props.products.length; i++)
                if (this.props.products[i].id == id)
                    this.setState({ product: this.props.products[i] });
        }
    }
    componentDidMount() {
        document.title = "Transaction::In";
        if (this.props.selectedProduct && this.props.selectedProduct.productFlow
            && _byId("input-product-name"))
            _byId("input-product-name").value = this.props.selectedProduct.productFlow.id
    }
    componentDidUpdate() {
        if (this.props.selectedProduct && this.props.selectedProduct.productFlow
            && _byId("input-product-name")) {
            _byId("input-product-name").value = this.props.selectedProduct.productFlow.id
        }
    }

    render() {
        let detailStock = "", message = "", totalPrice = this.calculateTotalPrice();

        if (this.state.product != null) {
            detailStock = <div className="form-panel rounded">
                <div className="panel-title rounded-top">Product Detail</div>
                <DetailProductPanel product={this.state.product} />
            </div>;
        }
        if (this.state.messageShow == true) {
            message = <Message text={this.state.messageText} endMessage={this.endMessage} type={this.state.messageType} />
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


        let formComponent = <table><tbody>
            <tr valign="top"> <td>
                <div className="form-panel rounded">
                    <div className="panel-title rounded-top">Payment Form</div>
                    <InstantTable
                        disabled={true} rows={[
                            {
                                values: [<InputDropdown onSelect={this.selectSupplier} dropdownList={supplierList}
                                    onKeyUp={this.getSupplierList} id="input-supplier-name" placeholder="supplier name" />]
                            },
                            {
                                values: [<InputDropdown onSelect={this.selectProduct} id="input-product-name" dropdownList={productList}
                                    onKeyUp={this.getProductList} placeholder="input product name" />]
                            },
                            { values: [<InputField id="input-product-price" type="number" placeholder="input product price" />] },
                            { values: [<InputField id="input-quantity" type="number" placeholder="quantity" />] },
                            { values: [<InputField id="input-product-exp-date" type="date" placeholder="input product exp date" />] }
                        ]}
                    />
                    {this.state.product != null ? <ActionButton text="Save" onClick={this.addToCart} /> : ""}
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
                <h2>Product Supply From ({this.state.supplier.name})</h2>
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
        selectedProduct: state.transactionState.selectedProduct,
        transactionData: state.transactionState.transactionData,
        successTransaction: state.transactionState.successTransaction,
        suppliers: state.shopState.suppliersData.entities,
        products: state.transactionState.productsData
    }
}

const mapDispatchToProps = dispatch => ({
    getProductList: (productName) => dispatch(actions.getProductListTrx(productName)),
    submitSupplyTransaction: (request) => dispatch(actions.submitSupplyTrx(request)),
    resetPurchaseTransaction: () => dispatch(actions.resetPurchaseTransaction()),
    getSupplierList: (name) => dispatch(actions.getSupplierList({ name: name, page: 0 }))
})
export default (connect(
    mapStateToProps,
    mapDispatchToProps
)(TransactionIn));