import React, { Component } from 'react'
import { connect } from 'react-redux'
import CatalogItem from './CatalogItem'
import NavButton from './NavButton'
import '../css/Catalog.css'
import '../css/bootstrap.min.css'
import { BrowserRouter as Router, Route, Link, Switch, withRouter } from 'react-router-dom'
import * as actions from '../redux/actionCreators'
import ProductDetail from './ProductDetail'
import * as menus from '../constant/Menus'

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
            selectedProduct:null
        };

        this.getProductCatalog = (_page) => {
            console.log("will go to page: ", _page)

            this.props.getProductCatalog(
                {
                    page: _page,
                    name: this.state.requestProductName,
                    orderby: this.state.requestOrderBy,
                    ordertype: this.state.requestOrderType
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
            let input = document.getElementById("input-product-name");
            this.setState({ requestProductName: input.value });
        }

        this.clearField = () => {
            document.getElementById("input-product-name").value = "";
            this.setState({ requestProductName: "" });

            document.getElementById("select-order").value = "00";
            this.setState({ requestOrderBy: null, requestOrderType: null });

            alert("filter has been cleared, please push the search button to take effect")
        }

        this.getProductDetail= (code) => {
            console.log("Detail of: ",code);
            //remove selected product if any
            this.props.removeEntity();

            this.props.getProductDetail(code);
            this.props.setDetailMode(true);
        }

        this.setDetailMode = (detailMode) => {
            this.props.setDetailMode(detailMode);
            this.props.removeEntity();
        }

    }

    componentWillMount() {
        console.log("=======will mount========")
        document.title = "Product Catalog";
        this.getProductCatalog(this.state.catalogPage);
        this.props.setMenuCode(menus.CATALOG);

    }

    componentDidUpdate() {
        console.log("Entity:",this.props.selectedProduct);
        if (this.state.firstLoad) {
            if (this.props.catalogData.filter != null) {
                this.setState({ limit: this.props.catalogData.filter.limit });
                this.setState({ totalData: this.props.catalogData.totalData });
                this.setState({ firstLoad: false });
            }
        }
    }

    createNavButtons(totalButton) {
        let buttonData = [];
        for (let index = 0; index < totalButton; index++) {
            buttonData.push({
                text: index + 1,
                value: index
            });
        }
        return buttonData;
    }


    render() {

        let products = this.props.catalogData.entities == null ? [] : this.props.catalogData.entities;
        let buttonData = [];
        if (products.length > 0)
            buttonData = this.createNavButtons(this.props.catalogData.totalData / this.state.limit);

        let filterBox = <div className="filter-box">
            <input className="form-control" id="input-product-name"
                placeholder="search by product name"
                onKeyUp={this.handleInputNameChange}
                type="search" />

            <select defaultValue="00" onChange={this.handleOrderChange} className="form-control" id="select-order">
                <option value="00"  >-Select Order-</option>
                <option value="name-asc">Name [A-Z]</option>
                <option value="name-desc">Name [Z-A]</option>
                <option value="price-asc">Price [cheap]</option>
                <option value="price-desc">Price [expensive]</option>
            </select>
            <button id="btn-search" onClick={() => this.getProductCatalog(this.state.catalogPage)} className="btn-search"  >Search</button>
            <button id="btn-clear" onClick={this.clearField} className="btn-clear"  >Clear</button>
            <p></p>
        </div>;

        let productCatalog = (<div className="section-container" id="catalog-main" key="catalog-main">
            <h2>Catalog Page</h2>
            <p>Choose your favourite products</p>
            <div className="nav-containter">
                {
                    buttonData.map(b => {
                        let active = (b.value == this.state.catalogPage)
                        return <NavButton active={active} buttonClick={this.getProductCatalog} key={b.value} value={b.value} text={b.text} />
                    })
                }
                <br />
                <span>Total item(s) : {this.props.catalogData.totalData}</span>
                {filterBox}
            </div>
            <div className="product-panel">
                {products.map(
                    product => {
                        return <CatalogItem getProductDetail={this.getProductDetail} key={product.id} product={product} />
                    }
                )}
            </div>
        </div>);

        let rendered = productCatalog;

        if(this.props.detailMode){

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
        selectedProduct: state.shopState.entity
    }
}

const mapDispatchToProps = dispatch => ({
    getProductCatalog: (request) => dispatch(actions.getProductList(request)),
    getProductDetail: (code)=>dispatch(actions.getProductDetail(code)),
    removeEntity:()=>dispatch(actions.removeEntity())
    
})
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Catalog));