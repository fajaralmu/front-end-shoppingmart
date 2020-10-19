import React, { Component } from 'react'
import './ProductDetail.css'
import * as url from '../../../constant/Url'  
import ActionButtons from '../../buttons/ActionButtons'
import ActionButton from '../../buttons/ActionButton'
import InstantTable from '../../container/InstantTable'
import ImageCarousel from '../../container/ImageCarousel'
import { beautifyNominal } from '../../../utils/StringUtil'
import ContentTitle from '../../container/ContentTitle'
import CatalogService from './../../../services/CatalogService';
import BaseComponent from './../../BaseComponent';


class ProductDetail extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            supplierShown: false,
            supplierPage: 1,
            product: null,
            updated: new Date()
        }

        this.catalogService = CatalogService.instance;

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
        }

        this.getMoreSupplier = (page, productId) => {
            this.setState({ supplierPage: (page+1) });
            const request = {
                page:this.state.supplierPage,productId: productId
            }
            this.commonAjax(
                this.catalogService.getMoreSupplier, request,
                this.handleGetMoreSuppliers
            );
        }

        this.handleGetMoreSuppliers = (response) => {
            const suppliers = response.entities;
            const product = this.state.product;
            if(!product){ return }

            for (let i = 0; i < suppliers.length; i++) {
                const element = suppliers[i];
                product.suppliers.push(element);
            }
            this.setState({product:product});
        }

        this.handleGetProduct = (response) => {
            this.setState({product:response.entities[0]});
        }

        this.getProductDetail = () => { 

            this.commonAjaxWithProgress(
                this.catalogService.getProductDetail,
                this.props.productCode,  this.handleGetProduct
            );
        }
    }

    componentWillMount(){
        this.getProductDetail();
    }

    componentDidMount() {
        this.setState({ supplierShown: false });
        document.title = "Product Detail"; 
    }

    componentDidUpdate() {
    }

    render() {

        const product = this.state.product;

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
                    onClick={() => this.getMoreSupplier(this.state.supplierPage, product.id)}
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

        const imageURLs = new Array();
        for (let index = 0; index < product.imageUrl.split("~").length; index++) {
            imageURLs.push(url.baseImageUrl + product.imageUrl.split("~")[index]);
        }
        return <ImageCarousel imageUrls={imageURLs} />
    }
    return null;
}
 
export default  (ProductDetail);