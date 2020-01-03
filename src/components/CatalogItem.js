import React, { Component } from 'react'

import './CatalogItem.css'
import '../css/Common.css'

class CatalogItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let product = this.props.product;

        return (
            <div className="main box-shadow ">
                <div className="panel-title rounded-top">
                    {product.name}
                </div>
                <span className="description">{product.description}</span>
            <div className="catalog-item ">
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