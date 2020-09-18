import React, { Component } from 'react'

import * as url from '../../constant/Url'
import * as stringUtil from '../../utils/StringUtil'
import Label from './Label'
import Card from '../card/Card'

class CatalogItem extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const product = this.props.product;

        //check if null
        if (!product || !product.category || !product.unit) {
            return <h3>Please wait..</h3>
        }

        const productImageUrl = product.imageUrl;
        const imageUrl = url.baseImageUrl + productImageUrl.split("~")[0];
        const content = <CardContent product={product} />
        const title = <Label className=" clickable " text={product.name} onClick={() => this.props.getProductDetail(product.code)} />;

        return (
            <Card style={{width:'250px', margin:'auto'}} className="grid-item" title={title} icon={imageUrl} content={content} />
        )
    }
}

function CardContent(props) {
    const product = props.product;
    return (<div>
        <Label style={{ fontFamily: "Arial Narrow", fontWeight: 'bolder' }}
            text={<span><i className="fas fa-tags"></i>&nbsp;{stringUtil.beautifyNominal(product.price) + ",00"}</span>} />
        <div>
            <i className="fas fa-cubes"></i>&nbsp;{stringUtil.beautifyNominal(product.count)}&nbsp;{product.unit.name}
        </div>
        <Label text={product.category.name} />
    </div>);
}

export default CatalogItem;