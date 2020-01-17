import React, { Component } from 'react'

import '../css/Common.css'
import * as url from '../constant/Url'
import * as stringUtil from '../utils/StringUtil'
import InstantTable from './InstantTable'
import Label from './Label'
import Card from './Card'

class CatalogItem extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let product = this.props.product;
        let productImageUrl = product.imageUrl;
        let imageUrl = url.baseImageUrl + productImageUrl.split("~")[0];
        let content = <InstantTable rows={[{
            style: { textAlign: "center" },
            id: "img-icon-" + product.id,
            values: [
                <Label  className="clickable catalog-item-title" text={product.name} onClick={() => this.props.getProductDetail(product.code)}
                />
            ], CS: [2]
        },
        {
            id: "catalog-item-" + product.id,
            values: [
                "Price",
                <Label style={{ fontFamily: "Arial Black" }} text={stringUtil.beautifyNominal(product.price) + ",00"} />
            ]
        }, {
            id: "catalog-item-desc-" + product.id,
            values: ["Available", <span class="count">{stringUtil.beautifyNominal(product.count)}</span>]
        },
        {
            id: "catalog-item-cat-" + product.id,
            values: ["Category", product.category.name]
        }
        ]} />;
        return (
            <Card icon={imageUrl} style={{ float: 'left' }} content={content} />
        )
    }
}

export default CatalogItem;