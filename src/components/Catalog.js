import React, { Component } from 'react'
import { connect } from 'react-redux'
import CatalogItem from './CatalogItem'
import NavButton from './NavButton'
import '../css/Catalog.css'
import { BrowserRouter as Router, Route, Link, Switch, withRouter } from 'react-router-dom'
import * as actions from '../redux/actionCreators'
import ProductDetail from './ProductDetail'
import * as menus from '../constant/Menus'
import ActionButtons from './ActionButtons'
import InputField from './InputField'
import * as componentUtil from '../utils/ComponentUtil'
import ComboBoxes from './ComboBoxes'

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
            requestCategoryId: null,
            selectedProduct: null,
            buttonCount: 0

        };

        this.getProductCatalog = (_page) => {
            console.log("will go to page: ", _page)

            this.props.getProductCatalog(
                {
                    page: _page,
                    name: this.state.requestProductName,
                    orderby: this.state.requestOrderBy,
                    ordertype: this.state.requestOrderType,
                    categoryId: this.state.requestCategoryId
                }
            );
            this.setState({ catalogPage: _page });
            this.setState({ totalData: this.props.catalogData.totalData });
        }

        this.handleOrderChange = () => {
            console.log("==selectbox changed==");
            let selectBox = document.getElementById("select-order");
            let value = selectBox.value;
            if (value == null || value.length == 0 || value.split("-").length != 2) {
                return;
            } else {
                let rawOrderRequest = value.split("-");
                this.setState({ requestOrderBy: rawOrderRequest[0] });
                this.setState({ requestOrderType: rawOrderRequest[1] });
            }

        }

        this.handleInputNameChange = () => {
            console.log("==input name changed==");
            this.setState({ catalogPage: 0 })
            let input = document.getElementById("input-product-name");
            this.setState({ requestProductName: input.value });
        }

        this.clearField = () => {
            document.getElementById("input-product-name").value = "";
            this.setState({ requestProductName: "" });

            document.getElementById("select-order").value = "00";
            this.setState({ requestOrderBy: null, requestOrderType: null });

            document.getElementById("select-category").value = "00";
            this.setState({ requestCategoryId: null });

            alert("filter has been cleared, please push the search button to take effect")
        }

        this.getProductDetail = (code) => {
            console.log("Detail of: ", code);
            //remove selected product if any
            this.props.removeEntity();

            this.props.getProductDetail(code);
            this.props.setDetailMode(true);
        }

        this.setDetailMode = (detailMode) => {
            this.props.setDetailMode(detailMode);
            this.props.removeEntity();
        }

        this.handleCategoryChange = () => {
            let selectBox = document.getElementById("select-category");
            let value = selectBox.value;
            this.setState({ catalogPage: 0 })
            if (value != "00")
                this.setState({ requestCategoryId: value });
            else
                this.setState({ requestCategoryId: null });
        }

        this.next = () => {
            let catalogPage = this.state.catalogPage;
            let totalPage = this.props.catalogData.totalData / this.state.limit
            if (catalogPage >= totalPage - 1) { catalogPage = 0; }
            else { catalogPage++; }

            this.getProductCatalog(catalogPage);
        }

        this.prev = () => {
            let catalogPage = this.state.catalogPage;
            let totalPage = this.props.catalogData.totalData / this.state.limit
            if (catalogPage <= 0) { catalogPage = totalPage - 1; }
            else { catalogPage--; }

            this.getProductCatalog(catalogPage);
        }

    }

    componentWillMount() {
        console.log("=======will mount========")
        document.title = "Product Catalog";
        this.getProductCatalog(this.state.catalogPage);
        this.props.setMenuCode(menus.CATALOG);
        this.props.getAllProductCategories();

    }

    componentDidUpdate() {
        console.log("Entity:", this.props.selectedProduct);
        if (this.state.firstLoad && this.props.catalogData.filter != null) {
            this.setState({
                limit: this.props.catalogData.filter.limit,
                totalData: this.props.catalogData.totalData,
                firstLoad: false
            });
        }
    }


    render() {

        let products = this.props.catalogData.entities == null ? [] : this.props.catalogData.entities;
        let buttonData = [];
        if (products.length > 0)
            buttonData = componentUtil.createNavButtons(this.props.catalogData.totalData / this.state.limit);

        let categories = [];

        this.props.productCategories.map(category => {
            categories.push({ value: category.id, text: category.name });
        })

        let filterBox = <div className="filter-box">
            <InputField placeholder="search by product name" onKeyUp={this.handleInputNameChange} type="search" id="input-product-name" />
            <ComboBoxes
                values={[{
                    defaultValue: "00", onChange: this.handleOrderChange,
                    options: [
                        { value: "00", text: "-Select Order-" },
                        { value: "name-asc", text: "Name [A-Z]" },
                        { value: "name-desc", text: "Name [Z-A]" },
                        { value: "price-asc", text: "Price [cheap]" },
                        { value: "price-desc", text: "Price [expensive]" }
                    ], id: "select-order"
                }, {
                    defaultValue: "00", onChange: this.handleOrderChange, id: "select-category", options: categories
                }]}

            />
            <ActionButtons buttonsData={[{
                text: "Search", status: "success", onClick: () => this.getProductCatalog(this.state.catalogPage), id: "btn-search"
            }, {
                text: "Clear", status: 'warning', onClick: this.clearField, id: "Clear"
            }]} />

            <p></p>
        </div>;

        let productCatalog = (<div className="section-container" id="catalog-main" key="catalog-main">
            <h2>Catalog Page</h2>
            <p>Choose your favourite products</p>
            <div className="nav-containter">
                <NavButton buttonClick={this.prev} key="nav-prev" text="<" />
                {buttonData.map(b => {
                    let active = (b.value == this.state.catalogPage)
                    return <NavButton active={active} buttonClick={() => this.getProductCatalog(b.value)} key={b.value} text={b.text} />
                })}
                <NavButton buttonClick={this.next} key="nav-next" text=">" />

            </div>
            {filterBox}
            <div className="product-panel">
                {products.map(
                    product => {
                        return <CatalogItem getProductDetail={this.getProductDetail} key={product.id} product={product} />
                    }
                )}
            </div>
        </div>);

        let rendered = productCatalog;

        if (this.props.detailMode) {

            let productDetail = <ProductDetail setDetailMode={this.setDetailMode} product={this.props.selectedProduct} />
            rendered = productDetail;
        }

        return (
            rendered
        )
    }
}

const mapStateToProps = state => {
    console.log("Catalog State to props: ", state);
    return {
        catalogData: state.shopState.catalogData,
        selectedProduct: state.shopState.entity,
        productCategories: state.shopState.categories
    }
}

const mapDispatchToProps = dispatch => ({
    getProductCatalog: (request) => dispatch(actions.getProductList(request)),
    getProductDetail: (code) => dispatch(actions.getProductDetail(code)),
    removeEntity: () => dispatch(actions.removeEntity()),
    getAllProductCategories: () => dispatch(actions.getAllProductCategories())

})
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Catalog));