import React, { Component } from 'react'
import '../css/DetailStock.css'
import Label from './Label';
import * as url from '../constant/Url'
import InputField from './InputField';

class DetailStock extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        console.log("detail stock of:", this.props.productFlowStock);
    }

    render() {

        let productFlowStock = this.props.productFlowStock;
        if (this.props.productFlowStock == null || this.props.productFlowStock.productFlow == null || this.props.productFlowStock.productFlow.product == null) {
            productFlowStock = {
                remainingStock: "Loading...",
                productFlow: {
                    product: {
                        name: "Loading...",
                        unit: {
                            name: "Loading... "
                        },
                        price: "Loading..."
                    }
                }
            }
        }

        let imageUrl = url.baseImageUrl + productFlowStock.productFlow.product.imageUrl;

        return (
            <div className="stock-detail" >
                <table>
                    <tbody>
                        <tr>
                            <td> <Label text={productFlowStock.productFlow.product.name+"-"+productFlowStock.productFlow.id} />
                                <Label text={productFlowStock.remainingStock + " " + productFlowStock.productFlow.product.unit.name} />
                                <Label text={productFlowStock.productFlow.product.price + ",00"} />
                                <Label text="EXP Date" />
                                <InputField disabled={true} id="exp-date" type="date" value={productFlowStock.productFlow.expiryDate} /></td>
                            <td> <div className="img-panel rounded box-shadow"><img src={imageUrl} width="300" height="200" /></div>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
        )
    }

}

export default DetailStock;