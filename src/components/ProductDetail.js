import React, { Component } from 'react'
import '../css/Common.css'
import '../css/ProductDetail.css'
import DetailRow from './DetailRow'
import * as url from '../constant/Url'
import * as actions from '../redux/actionCreators'
import { connect } from 'react-redux'
import ActionButtons from './ActionButtons'
import ActionButton from './ActionButton'
import InstantTable from './InstantTable'



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

        if (product == null) {
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

        let supplierListPanel = <p></p>
        let supplierShown = this.state.supplierShown ? true : false;
        if (supplierShown && product.suppliers) {
            supplierListPanel = <div className="detail-container">

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
                <ActionButton
                    id="btn-show-more"
                    onClick={() => this.loadMoreSupplier(this.state.supplierPage, product.id)}
                    text="Show More" />
            </div>
        }
        return (
            <div className="section-container" >
                <h2>Product Detail Page</h2>

                {imageComponent}
                <InstantTable disabled={true}
                    rows={[
                        { id: "row-name", values: ["Name", product.name] },
                        { id: "row-price", values: ["Price", product.price] },
                        { id: "row-count", values: ["Item(s)", product.count + " " + (product.unit ? product.unit.name : "")] },
                        { id: "row-cat", values: ["Category", product.category.name] },
                        { id: "row-desc", values: ["Name", product.description] }
                    ]} />

                <ActionButtons buttonsData={[{
                    id: "btn-back",
                    onClick: this.goBack, text: "Back"
                },
                {
                    id: "btn-show-supplier",
                    status: "success",
                    onClick: () => this.showSupplierList(supplierShown && product.suppliers ? false : true),
                    text: (supplierShown && product.suppliers ? "Hide suppliers" : "Show suppliers")
                }]} />

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