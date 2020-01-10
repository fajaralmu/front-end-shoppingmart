import React, { Component } from 'react'
import * as stringUtil from '../utils/StringUtil'
import InstantTable from './InstantTable';
import Chart from './Chart';
import ActionButton from './ActionButton';
import * as stringUtil from '../utils/StringUtil'

class ProductSalesDetail extends Component {
    constructor(props) {
        super(props);

        this.goBack = () => {
            if(this.props.goBack)
                this.props.goBack();
        }
    }
 
    render() {
        let chartRows = new Array();
        let maxValue = 0;
        let productName = this.props.productSalesDetails ? this.props.productSalesDetails.entity.name : "....";
        let salesPeriod = "...";
        const entities = new Array();
        if (this.props.productSalesDetails.entities != null) {
            entities = this.props.productSalesDetails.entities;
            maxValue = this.props.productSalesDetails.maxValue;
            let length = this.props.productSalesDetails.entities.length;
            if(length > 0){
                let first =  this.props.productSalesDetails.entities[0];
                let last =  this.props.productSalesDetails.entities[ this.props.productSalesDetails.entities.length];
                let fromSalesPeriod = stringUtil.monthYearString(first.month, first.year);
                let toSalesPeriod = stringUtil.monthYearString(last.month, last.year);
                salesPeriod = fromSalesPeriod+" to "+toSalesPeriod;
            }
        }

        for (let i = 0; i < entities.length; i++) {
            const salesData = entities[i];
            chartRows.push({
                id: "row-detail-product-" + i,
                values: [
                    stringUtil.monthYearString(salesData.month, salesData.year),
                    <Chart text={salesData.sales}
                        type="success" width={450} value={salesData.sales} maxValue={maxValue} />
                ]
            });
        }

        <div>
            <h2>{productName} Sales Detail Period: {salesPeriod}</h2>
            <ActionButton onClick={this.goBack} text="Back" />
            <InstantTable rows={chartRows} />
        </div>
    }


}

export default ProductSalesDetail;