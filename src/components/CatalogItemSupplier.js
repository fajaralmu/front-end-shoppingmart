import React, { Component } from 'react'

import '../css/CatalogItem.css'
import '../css/Common.css'
import * as url from '../constant/Url'

class CatalogItemSupplier extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let supplier = this.props.supplier;
        let imageUrl = url.baseImageUrl + supplier.iconUrl;

        return (
            <div className="main box-shadow ">
                <div className="panel-title rounded-top">
                    {supplier.name}
                </div>
                <div className="catalog-item ">
                    <div>
                        <a href={this.props.supplier.website}><img alt={this.props.supplier.website} className="clickable" src={imageUrl} width="100" height="50" /></a>
                    </div>
                    <span className="description">{supplier.address}</span>
                </div>
            </div>
        )

    }
}

export default CatalogItemSupplier;