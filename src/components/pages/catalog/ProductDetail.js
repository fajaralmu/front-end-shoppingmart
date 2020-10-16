import React, { Component } from 'react'
import './ProductDetail.css'
import * as url from '../../../constant/Url'
import * as actions from '../../../redux/actionCreators'
import { connect } from 'react-redux'
import ActionButtons from '../../buttons/ActionButtons'
import ActionButton from '../../buttons/ActionButton'
import InstantTable from '../../container/InstantTable'
import ImageCarousel from '../../container/ImageCarousel'
import { beautifyNominal } from '../../../utils/StringUtil'
import ContentTitle from '../../container/ContentTitle'


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

        if (product == null) {
            return (
                <ContentTitle title="Please wait.." iconClass="fas fa-info-circle" />
            )
        }

        /////////////////////////

        let supplierListPanel = <p>No Supplier</p>
        let supplierShown = this.state.supplierShown ? true : false;
        if (supplierShown && product.suppliers && product.suppliers.length > 0) {
            supplierListPanel = <div className="detail-supplier-container">
                <h3>Supplier List</h3>
                <ol>
                    {product.suppliers.map(
                        supplier => {
                            return (
                                <li><SupplierItem  key={"supp-" + supplier.id} icon={supplier.iconUrl} content={supplier.name} /></li>
                            )
                        }
                    )}
                    
                    </ol>
                {/* {this.state.supplierPage} */}
                <ActionButton
                    id="btn-show-more"
                    onClick={() => this.loadMoreSupplier(this.state.supplierPage, product.id)}
                    text="Show More" />
            </div>
        }
        return (
            <div className="section-container" >

                <ContentTitle title={product.name} iconClass="fas fa-info-circle" description={product.description} />
                <div className="product-desc">
                    <InstantTable disabled={true}
                        rows={[
                            { values: [<ProductImage product={product} />], CS: [2] },
                            { values: ["Price", beautifyNominal(product.price)] },
                            { values: ["Item(s)", beautifyNominal(product.count) + " " + (product.unit ? product.unit.name : "")] },
                            { values: ["Category", product.category.name] }
                        ]} />

                    <ActionButtons buttonsData={[{
                        id: "btn-back", onClick: this.goBack, text: "Back"
                    },
                    {
                        id: "btn-show-supplier", status: "success",
                        onClick: () => this.showSupplierList(supplierShown && product.suppliers ? false : true),
                        text: (supplierShown && product.suppliers ? "Hide suppliers" : "Show suppliers")
                    }]} />
                </div>
                {supplierListPanel}
            </div>
        )
    }
}

function SupplierItem(props){
    
    return (
        <div className="row" style={{padding: '5px'}} >
            <div className="col-2"> <img src={url.baseImageUrl+props.icon} width="50" height="50"/> </div>
            <div className="col-10">{props.content}</div>
        </div>
    )
    
}

function ProductImage(props) {
    const product = props.product;

    if (product && product.imageUrl) {

        let imageUrls = new Array();
        for (let index = 0; index < product.imageUrl.split("~").length; index++) {
            imageUrls.push(url.baseImageUrl + product.imageUrl.split("~")[index]);
        }
        return <ImageCarousel imageUrls={imageUrls} />
    }
    return null;
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