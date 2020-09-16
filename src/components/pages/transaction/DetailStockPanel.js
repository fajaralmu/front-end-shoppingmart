import React, { Component } from 'react'
import * as url from '../../../constant/Url'
import * as stringUtil from '../../../utils/StringUtil'
import InstantTable from '../../container/InstantTable';

class DetailStockPanel extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        console.log("detail stock of:", this.props.product);
    }

    render() {
        let product = this.props.product;
        if (this.props.product == null) {
            product = {
                name: "Loading...",
                unit: {
                    name: "Loading... "
                },
                price: "000",
                count: 'Loading...'
            }
        }


        let productImageName = product.imageUrl;
        if (productImageName) {
            productImageName = productImageName.split("~")[0];
        }

        let imageUrl = url.baseImageUrl + productImageName;

        return (
            <div className="stock-detail" >

                <table>  <tbody>  <tr valign="top">
                    <td>
                        <InstantTable disabled={true}
                            rows={[
                                {
                                    values: ["Name", product.name]
                                },
                                ,
                                {
                                    values: ["Remaining", product.count + " " + product.unit.name]
                                },
                                ,
                                {
                                    values: ["Price", stringUtil.beautifyNominal(product.price) + ",00"]
                                },
                                ,
                                {
                                    values: ["Exp Date", '-']
                                }
                            ]} />
                    </td>
                    <td><div className="img-panel rounded box-shadow"><img src={imageUrl} width="300" height="200" /></div>
                    </td> </tr> </tbody>  </table>
            </div>
        ) 
    }

}

export default DetailStockPanel;