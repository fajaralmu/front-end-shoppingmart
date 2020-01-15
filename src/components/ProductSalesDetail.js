import React, { Component } from 'react'
import * as stringUtil from '../utils/StringUtil'
import InstantTable from './InstantTable';
import Chart from './Chart';
import ActionButton from './ActionButton'; 

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
        console.log("this.props.productSalesDetails : ",this.props.productSalesDetails );
        let productName = this.props.productSalesDetails && this.props.productSalesDetails.entity? this.props.productSalesDetails.entity.name : "....";
       
        let entities = new Array();
        if ( this.props.productSalesDetails && this.props.productSalesDetails.entities != null) {
            entities = this.props.productSalesDetails.entities;
            maxValue = this.props.productSalesDetails.maxValue;
           
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

        return (<div>
            <h2>{productName} Sales Detail</h2>
            <ActionButton onClick={this.goBack} text="Back" />
            <InstantTable rows={chartRows} />
        </div>)
    }


}

export default ProductSalesDetail;