import React, { Component } from 'react'
import '../css/DetailProductPanel.css'
import * as url from '../constant/Url'
import * as stringUtil from '../utils/StringUtil'
import InstantTable from './InstantTable';

class DetailProductPanel extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        console.log("detail stock of:", this.props.product);
    }

    render() {
        let product = this.props.product;
        if (this.props.product == null || this.props.product.unit == null || this.props.product.category == null) {
            product = {
                name: "loading...",
                unit: {
                    name: "laoding..."
                },
                category: {
                    name: "loading..."
                },
                price: 0
            }
        }

        let productImageName =  product.imageUrl;
        if(productImageName){
            productImageName = productImageName.split("~")[0];
        }
        let imageUrl = url.baseImageUrl +productImageName;

        return (
            <div className="stock-detail" >
                <table><tbody><tr valign="top">
                    <td>
                        <InstantTable disabled={true}
                            rows={[
                                {
                                    values: ["Name", product.name + "-" + product.id]
                                },
                                {
                                    values: ["----------------------------------"], CS: [2]
                                },
                                {
                                    values: ["Unit", product.unit.name]
                                }, 
                                {
                                    values: ["----------------------------------"], CS: [2]
                                }, 
                                {
                                    values: ["Category", product.category.name]
                                }, 
                                {
                                    values: ["----------------------------------"], CS: [2]
                                },
                                {
                                    values: ["Current Price", stringUtil.beautifyNominal(product.price) + ",00"]
                                }, 
                                {
                                    values: ["----------------------------------"], CS: [2]
                                }
                            ]} />
                    </td>
                    <td><div className="img-panel rounded box-shadow"><img src={imageUrl} width="300" height="200" /></div>
                    </td></tr></tbody></table>
            </div>
        )
    }

}

export default DetailProductPanel;