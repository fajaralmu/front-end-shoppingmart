import React, { Component } from 'react'
import '../css/Common.css'
import '../css/ProductDetail.css'
import DetailRow from './DetailRow'
import * as url from '../constant/Url'
import * as actions from '../redux/actionCreators'
import { connect } from 'react-redux'



class ProductDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            supplierShown: false,
            supplierPage: 1,
            product: null
        }

        this.goBack = () => {
            this.props.setDetailMode(false);
        }

        this.showSupplierList = (mode) => {
            this.setState({ supplierShown: mode });
            this.setState({ product: this.props.product });
        }

        this.loadMoreSupplier = (page, productId) => {

            page++;
            this.setState({ supplierPage: page });
            this.props.loadMoreSupplier(this.state.supplierPage, productId);
        }
    }

    componentDidMount() {
        this.setState({ supplierShown: false })
        
    }

    componentDidUpdate() {
         
    }

    render() {
        let product = this.props.product;
        let imageComponent = "";
        if (product && product.imageUrl) {
            let imageUrl = url.baseImageUrl + product.imageUrl.split("~")[0];
            imageComponent = <div className="img-panel rounded box-shadow"><img src={imageUrl} width="300" height="200" /></div>;
        }

        if (product == null  ) {
            product = {
                name: "loading...",
                price: "loading...",
                count: "loading...",
                description: "loading....",
                category: {
                    name: "loading..."
                }
            }

        } else {
            // product.suppliers  = this.props. suppliers;
          //  console.log("product suppliers", this.props.product.suppliers);
        }
        // if(product.suppliers!=null&&  this.props.suppliers != null){
        //     console.log("WILL ADD MORE SUPPLIER")
        //     for (let i = 0; i < this.props.suppliers.length; i++) {
        //         const element = this.props.suppliers[i];
        //         product.suppliers.push(element);
        //     } 
        // } 

        let supplierListPanel = <button id="btn-show-supplier" onClick={() => this.showSupplierList(true)}>Show Suppliers</button>;
        let supplierShown = this.state.supplierShown ? true : false;
        if (supplierShown && product.suppliers) {
            supplierListPanel = <div className="detail-container">
                <button id="btn-show-supplier" onClick={() => this.showSupplierList(false)}>Hide Suppliers</button>
                <table className="suppllier-container">
                    <tbody>
                        {product.suppliers.map(
                            supplier => {
                                return (
                                    <DetailRow desc={supplier.website} id={"supp-" + supplier.id} key={"supp-" + supplier.id} icon={supplier.iconUrl} name={supplier.name} />
                                )
                            }
                        )}
                    </tbody>
                </table>
                {this.state.supplierPage}
                <button className="show-more" onClick={() => this.loadMoreSupplier(this.state.supplierPage, product.id)} >Show More</button>
            </div>
        }
        return (
            <div className="section-container" >
                <h2>Product Detail Page</h2>
                <button className="clickable" onClick={this.goBack}> Back</button>
                {imageComponent}
                <p>Name: {product.name}</p>
                <p>Price: {product.price}</p>
                <p>Item(s): {product.count} {product.unit ? product.unit.name : ""}</p>
                <p>Category: {product.category.name}</p>
                <p>description: {product.description}</p>


                {supplierListPanel}
            </div>
        )
    }
}

const mapStateToProps = state => {
    console.log("Catalog State to props: ", state);
    return {
        suppliers: state.shopState.suppliers
    }
}

const mapDispatchToProps = dispatch => ({
    loadMoreSupplier: (page, productId) => dispatch(actions.loadMoreSupplier(page, productId))

})
export default (connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductDetail));