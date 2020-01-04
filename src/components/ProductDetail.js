import React, { Component } from 'react'
import '../css/Common.css'
import '../css/ProductDetail.css'
import DetailRow from './DetailRow'
import * as url from '../constant/Url'


class ProductDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            supplierShown:false
        }

        this.goBack = () => {
            this.props.setDetailMode(false);
        }

        this.showSupplierList = (mode) => {
            this.setState({supplierShown:mode})
        }
    }

    componentDidMount() {
        this.setState({supplierShown:false})
        console.log("State:",this.state)
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
        }

        let supplierListPanel =  <button id="btn-show-supplier" onClick={()=>this.showSupplierList(true)}>Show Suppliers</button>;
        let supplierShown = this.state.supplierShown ?true:false;
        if( supplierShown && product.suppliers){
            supplierListPanel =  <div className="detail-container">
                <button id="btn-show-supplier" onClick={()=>this.showSupplierList(false)}>Hide Suppliers</button>
                <table className="suppllier-container">
                    <tbody>
                    {product.suppliers.map(
                        supplier=>{
                            return(
                                <DetailRow desc={supplier.website} key={supplier.id} icon={supplier.iconUrl} name={supplier.name} />
                            )
                        }
                    )}   
                    </tbody> 
                </table>  
                <button className="show-more" onClick={this.loadMoreSupplier} >Show More</button>  
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


export default ProductDetail;