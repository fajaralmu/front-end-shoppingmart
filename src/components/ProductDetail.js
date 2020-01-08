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
import ImageCarousel from './ImageCarousel'



class ProductDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            supplierShown: false,
            supplierPage: 1,
            product: null,
            updated: new Date()
        }

        /**
         * this method is called in shopReducer
         */
        this.refresh = () => {
            console.log("++reresh++");
            this.setState({ updated: new Date() });
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
            this.props.loadMoreSupplier(this.state.supplierPage, productId, this);
        }
    }

    componentDidMount() {
        this.setState({ supplierShown: false });
        document.title = "Product Detail";

    }

    componentDidUpdate() {
    }

    render() {

        let product = this.props.product;
        let imageComponent = "";
        if (product && product.imageUrl) {

            let imageUrls = new Array();
            for (let index = 0; index < product.imageUrl.split("~").length; index++) {
                imageUrls.push(url.baseImageUrl + product.imageUrl.split("~")[index]);
            }
            imageComponent = <ImageCarousel imageUrls={imageUrls} />

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
                <h2>{product.name}</h2>
                <InstantTable disabled={true}
                    rows={[
                        { id: "row-img", values: [imageComponent], CS: [2] },
                        { id: "row-name", values: ["Name", product.name] },
                        { id: "row-price", values: ["Price", product.price] },
                        { id: "row-count", values: ["Item(s)", product.count + " " + (product.unit ? product.unit.name : "")] },
                        { id: "row-cat", values: ["Category", product.category.name] },
                        { id: "row-desc", values: ["Name", product.description] }
                    ]} />

                <ActionButtons buttonsData={[{
                    id: "btn-back", onClick: this.goBack, text: "Back"
                },
                {
                    id: "btn-show-supplier", status: "success",
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
    loadMoreSupplier: (page, productId, referrer) => dispatch(actions.loadMoreSupplier(page, productId, referrer))

})
export default (connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductDetail));