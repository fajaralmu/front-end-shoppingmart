import React, { Component } from 'react'
import * as url from '../../../constant/Url'
import * as stringUtil from '../../../utils/StringUtil'
import InstantTable from '../../container/InstantTable';
import Card from '../../card/Card'; 

class DetailProductPanel extends Component {
    constructor(props) {
        super(props);

        this.getRowData = () => {
            const product = this.props.product;
            let row = [];
            if (this.props.stockView) {
                row = [
                    { values: ["Code", product.code] },
                    { values: ["Name", product.name] },
                    { values: ["Remaining", product.count + " " + product.unit.name] },
                    { values: ["Price", stringUtil.beautifyNominal(product.price) + ",00"] },
                    { values: ["Exp Date", '-'] }
                ]
            } else {
                row = [
                    { values: ["Code", product.code] },
                    { values: ["Name", product.name + "-" + product.id] },
                    { values: ["Unit", product.unit.name] },
                    { values: ["Category", product.category.name] },
                    { values: ["Price", stringUtil.beautifyNominal(product.price) + ",00"] },
                ];
            }

            return row;
        }
    }

    componentDidMount() {
        console.log("detail stock of:", this.props.product);
    }

    render() {
        let product = this.props.product;
        const defaultVal = spinner();
        if (this.props.product == null || this.props.product.unit == null || this.props.product.category == null) {
            product = {
                name: defaultVal,
                unit: {
                    name: defaultVal
                },
                category: {
                    name: defaultVal
                },
                price: 0
            }
        }

        let productImageName = product.imageUrl;
        if (productImageName) {
            productImageName = productImageName.split("~")[0];
        }
        let imageUrl = url.baseImageUrl + productImageName;

        return (
           <Card title="Product Detail" content={
                <table><tbody><tr valign="top">
                    <td>
                        <InstantTable disabled={true} rows={this.getRowData()} />
                    </td>
                    <td><div className="img-panel rounded box-shadow"><img src={imageUrl} width="300" height="200" /></div>
                    </td></tr></tbody></table>
           } /> 
        )
    }

}

const spinner = (props) => {
    return (
        <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
        </div>
    )
}

export default DetailProductPanel;