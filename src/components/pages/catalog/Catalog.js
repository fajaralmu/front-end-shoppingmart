import React, { Component } from 'react'
import { connect } from 'react-redux'
import CatalogItem from '../../container/CatalogItem'
import '../catalog/Catalog.css'
import { BrowserRouter as Router, Route, Link, Switch, withRouter } from 'react-router-dom'
import * as actions from '../../../redux/actionCreators'
import ProductDetail from './ProductDetail'
import * as menus from '../../../constant/Menus'
import ActionButtons from '../../buttons/ActionButtons'
import InputField from '../../inputs/InputField'
import * as componentUtil from '../../../utils/ComponentUtil'
import ContentTitle from '../../container/ContentTitle'
import * as stringUtil from '../../../utils/StringUtil'
import NavButtons from '../../navigation/NavButtons'
import ComboBox from '../../inputs/ComboBox'
import GridComponent from '../../container/GridComponent'

class Catalog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            catalogData: {
                entities: []
            },
            limit: 10,
            totalData: 0,
            products: [],
            catalogPage: 0,
            firstLoad: true,
            requestOrderBy: null,
            requestOrderType: null,
            requestProductName: "",
            requestWithStock: null,
            requestCategoryId: null,
            selectedProduct: null,
            buttonCount: 0,
            enableShopping: false,
            activeId: null

        };

        this.focusToActiveField = () => {
            if (componentUtil.byId(this.state.activeId)) {
                componentUtil.byId(this.state.activeId).focus();
            }
        }

        this.getProductInCart = (id) => {
            for (let i = 0; i < this.props.cart.length; i++) {
                let cartItem = this.props.cart[i];
                if (cartItem.product.id == id) {
                    cartItem.index = i;
                    return cartItem;
                }
            }
            return { index: -1, count: 0 };
        }

        this.clearCart = () => {
            const props = this.props;
            this.props.app.confirmDialog("Are you sure clear shopping list?", function (e) {
                props.updateCart([], props.app);
            }, null);

        }

        this.addToCart = (product, count) => {
            let currentCart = this.props.cart;
            let existingIndex = this.getProductInCart(product.id).index;

            if (existingIndex >= 0) {
                let currentCount = currentCart[existingIndex].count;

                if (currentCount + count < 0) return;

                let currentCartItem = currentCart[existingIndex];
                currentCartItem.count += count;

                currentCart[existingIndex] = currentCartItem;

            } else if (count != 0) {
                currentCart.push({
                    product: product,
                    count: count
                })
            }
            this.props.updateCart(currentCart, this.props.app);
        }

        this.getProductCatalog = (_page) => {
            console.log("will go to page: ", _page)
            this.props.getProductCatalog(
                {
                    page: _page,
                    name: this.state.requestProductName,
                    orderby: this.state.requestOrderBy,
                    ordertype: this.state.requestOrderType,
                    categoryId: this.state.requestCategoryId,
                    withStock: true,//this.state.requestWithStock
                }, this.props.app
            );
            this.setState({ catalogPage: _page, totalData: this.props.catalogData.totalData });
        }

        this.handleOrderChange = (value) => {

            if (value == null || value == "00" || value.length == 0 || value.split("-").length != 2) {
                this.setState({ requestOrderBy: null });
                this.setState({ requestOrderType: null });
                return;
            } else {
                let rawOrderRequest = value.split("-");
                this.setState({ requestOrderBy: rawOrderRequest[0] });
                this.setState({ requestOrderType: rawOrderRequest[1] });
            }

        }

        this.handleInputNameChange = (value, id) => {
            console.log("==input name changed==", id);
            this.setState({ requestProductName: value, activeId: id });
        }

        this.clearField = () => {
            this.setState({ requestProductName: "" });
            this.setState({ requestOrderBy: null, requestOrderType: null });
            this.setState({ requestCategoryId: null });

            this.props.app.infoDialog("filter has been cleared, please push the search button to take effect")
        }

        this.getProductDetail = (code) => {
            console.log("Detail of: ", code);
            //remove selected product if any
            this.props.removeEntity();

            this.props.getProductDetail(code, this.props.app);
            this.props.setDetailMode(true);
        }

        this.setDetailMode = (detailMode) => {
            document.title = "Product Catalog";
            this.props.setDetailMode(detailMode);
            this.props.removeEntity();
        }

        this.handleCategoryChange = (value) => {
            this.setState({ catalogPage: 0 })
            if (value != null && value != "00")
                this.setState({ requestCategoryId: value });
            else
                this.setState({ requestCategoryId: null });

        }

        this.next = () => {
            let catalogPage = this.state.catalogPage;
            let totalPage = Math.floor(this.props.catalogData.totalData / this.state.limit);
            if (catalogPage >= totalPage - 1) { catalogPage = 0; }
            else { catalogPage++; }

            this.getProductCatalog(catalogPage);
        }

        this.prev = () => {
            let catalogPage = this.state.catalogPage;
            let totalPage = Math.floor(this.props.catalogData.totalData / this.state.limit);
            if (catalogPage <= 0) { catalogPage = totalPage - 1; }
            else { catalogPage--; }

            this.getProductCatalog(catalogPage);
        }

        this.handleChangeWithStockOption = (id) => {
            if (!componentUtil.byId(id))
                return;
            this.setState({ requestWithStock: componentUtil.byId(id).checked });
        }

        this.handleChangeEnableShoppingOption = (id) => {
            console.log("ID: ", id)
            if (!componentUtil.byId(id))
                return;
            this.props.app.setEnableShopping(componentUtil.byId(id).checked)
        }

        this.generateNavButtonsData = () => {
            let products = this.props.catalogData.entities == null ? [] : this.props.catalogData.entities;
            let buttonData = [];
            if (products.length > 0)
                buttonData = componentUtil.createNavButtons(this.props.catalogData.totalData / this.state.limit,
                    this.state.catalogPage);

            const navButtonsData = [{
                id: "btn-prev",
                buttonClick: this.prev,
                text: "previous"
            }];
            for (let i = 0; i < buttonData.length; i++) {
                const b = buttonData[i];
                let active = (b.value == this.state.catalogPage);
                navButtonsData.push({
                    id: b.value,
                    active: active,
                    buttonClick: () => this.getProductCatalog(b.value),
                    text: b.text
                });
            }

            navButtonsData.push({
                id: "btn-next",
                buttonClick: this.next,
                text: "next"
            });
            return navButtonsData;
        }

    }

    componentWillMount() {
        document.title = "Product Catalog";
        this.getProductCatalog(this.state.catalogPage);
        this.props.setMenuCode(menus.CATALOG);
        this.props.getAllProductCategories();

    }

    componentDidUpdate() {
        if (this.state.firstLoad && this.props.catalogData.filter != null) {
            this.setState({
                limit: this.props.catalogData.filter.limit,
                totalData: this.props.catalogData.totalData,
                firstLoad: false
            });
        }
        this.focusToActiveField();
    }

    filterBox() {
        let categories = [{ value: "00", text: "-all category-" }];
        let actionButtons = [
            { text: <i className="fa fa-search" ></i>, status: "success", onClick: () => this.getProductCatalog(0), id: "btn-search" },
            { text: "Clear Filter", status: 'warning', onClick: this.clearField, id: "Clear-filter" }
        ];
        this.props.productCategories.map(category => {
            categories.push({ value: category.id, text: category.name });
        })

        if (this.props.enableShopping) {
            actionButtons.push({
                text: <span><i className="fa fa-cart-arrow-down" ></i></span>, onClick: () => { this.clearCart() }, status: 'danger', id: "clear-list"
            });
        }

        return <div className="filter-box">
            <GridComponent cols={3} style={{ width: 'max-content' }} items={[
                <InputField placeholder="search by product name"
                    value={this.state.requestProductName}
                    onKeyUp={this.handleInputNameChange}
                    type="search" id="input-product-name" />
                ,
                <ComboBox
                    defaultValue={this.state.requestOrderBy + "-" + this.state.requestOrderType}
                    onChange={this.handleOrderChange}
                    options={filterProductOption} id={"select-order"}
                />,
                <ComboBox
                    defaultValue={this.state.requestCategoryId}
                    onChange={this.handleCategoryChange}
                    options={categories} id="select-category"
                />,
                <ActionButtons style={{ margin: '5px' }} buttonsData={actionButtons} />,
                <div>
                    {/* <InputField checked={this.state.requestWithStock} onChange={this.handleChangeWithStockOption}
                        type="checkbox" id="checkbox-with-stock"
                        text="Inculde Remaining Stock" /> */}
                    <InputField checked={this.props.enableShopping} onChange={this.handleChangeEnableShoppingOption}
                        type="checkbox" id="checkbox-enable-cart"
                        text="Show Shopping List" />
                </div>,
            ]} />
            <p></p>
        </div>;
    }

    render() {

        let products = this.props.catalogData.entities == null ? [] : this.props.catalogData.entities;

        let productCatalog = (
            <div className="section-container" id="catalog-main" key="catalog-main">
                <ContentTitle title="Catalog Page" iconClass="fas fa-store-alt" description="Choose your favourite products" />
                <NavButtons buttonsData={this.generateNavButtonsData()} />

                {this.filterBox()}
                <div className="row catalog-container" >
                    {products.map(
                        product => {
                            return (
                                <ProductCard
                                    getProductDetail={this.getProductDetail}
                                    getProductInCart={this.getProductInCart}
                                    enableShopping={this.props.enableShopping}
                                    product={product}
                                    addToCart={this.addToCart} />
                            );
                        }
                    )}
                </div>
            </div>);

        let rendered = productCatalog;

        if (this.props.detailMode) {
            let productDetail = <ProductDetail app={this.props.app} setDetailMode={this.setDetailMode} product={this.props.selectedProduct} />
            rendered = productDetail;

        }

        return (rendered)
    }
}

function ProductCard(props) {
    let shoppingInfo = <></>;
    const product = props.product;
    if (props.enableShopping) {

        const cartItem = props.getProductInCart(product.id);
        const qty = cartItem.count;

        const cartButtonsData = [
            { text: <i className="fas fa-sync"></i>, status: "danger btn-sm", onClick: () => props.addToCart(product, (qty * (-1))), id: "btn-add-cart-" + product.id },
            { text: <i className="fa fa-minus-circle"></i>, status: "warning btn-sm", onClick: () => props.addToCart(product, -1), id: "btn-add-cart-" + product.id },
            { text: qty, id: "info-cart-" + product.id, status: 'light btn-sm' },
            { text: <i className="fa fa-plus-circle"></i>, status: 'success btn-sm', onClick: () => props.addToCart(product, 1), id: "btn-reduce-cart-" + product.id }
        ];

        shoppingInfo = <div>
            <ActionButtons buttonsData={cartButtonsData} />
        </div>
    }

    return (
        <div className="col-md-3" key={stringUtil.uniqueId()}>
            {shoppingInfo}
            <CatalogItem getProductDetail={props.getProductDetail} key={product.id} product={product} />
        </div>
    )
}

const filterProductOption = [
    { value: "00", text: "-all order-" },
    { value: "name-asc", text: "Name [A-Z]" },
    { value: "name-desc", text: "Name [Z-A]" },
    { value: "price-asc", text: "Price [cheap]" },
    { value: "price-desc", text: "Price [expensive]" }
];

const mapStateToProps = state => {
    return {
        catalogData: state.shopState.catalogData,
        selectedProduct: state.shopState.entity,
        productCategories: state.shopState.categories,
        cart: state.shopState.cart
    }
}

const mapDispatchToProps = dispatch => ({
    getProductCatalog: (request, app) => dispatch(actions.getProductList(request, app)),
    getProductDetail: (code, app) => dispatch(actions.getProductDetail(code, app)),
    removeEntity: () => dispatch(actions.removeEntity()),
    getAllProductCategories: () => dispatch(actions.getAllProductCategories()),
    updateCart: (cart, app) => dispatch(actions.updateCart(cart, app))
})
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Catalog));