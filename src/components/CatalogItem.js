import React, { Component } from 'react'

import '../css/CatalogItem.css'
import '../css/Common.css'
import * as url from '../constant/Url'
import * as stringUtil from '../utils/StringUtil'
import InstantTable from './InstantTable'
import Label from './Label'

class CatalogItem extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let product = this.props.product;
        let productImageUrl = product.imageUrl;
        let imageUrl = url.baseImageUrl + productImageUrl.split("~")[0];
        return (
            <div className="main box-shadow ">
                <div className="panel-title rounded-top">
                    {product.name}
                </div>
                <span className="description">{product.category.name}</span>
                <div className="catalog-item ">
                    <div>
                        <img className="clickable" onClick={() => this.props.getProductDetail(product.code)} src={imageUrl} width="100" height="50" />
                    </div>
                    <InstantTable rows={[{
                        id: "catalog-item-" + product.id,
                        values: [
                            "Price",
                            <Label style={{ fontFamily: "Arial Black" }} text={stringUtil.beautifyNominal(product.price) + ",00"} />
                        ]
                    }, {
                        id: "catalog-item-desc-" + product.id,
                        values: [
                            "Available", stringUtil.beautifyNominal(product.count)
                        ]
                    }
                    ]} />
                </div> </div>
        )
    }
}

export default CatalogItem;