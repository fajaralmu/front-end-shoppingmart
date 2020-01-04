import React, { Component } from 'react'

import '../css/CatalogItem.css'
import '../css/Common.css' 
import * as url from '../constant/Url' 

class CatalogItem extends Component { 

    constructor(props) {
        super(props);
    }

    render() {
        let product = this.props.product;
        let productImageUrl = product.imageUrl;
        let imageUrl = url.baseImageUrl+productImageUrl.split("~")[0];
        return (
            <div className="main box-shadow ">
                <div className="panel-title rounded-top">
                    {product.name}
                </div>
                <span className="description">{product.category.name}</span>
            <div className="catalog-item ">
                <div>
                    <img className="clickable" onClick={()=>this.props.getProductDetail(product.code)} src={ imageUrl} width="100" height="50"/>
                </div>
                <table>
                    <tbody>  
                        <tr>
                            <td>
                                Price
                                </td>
                            <td>{product.price}.00</td>
                        </tr>
                        <tr>
                            <td>
                                Available
                                </td>
                            <td>{product.count}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            </div>
        )

    }
}

export default CatalogItem;