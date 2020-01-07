import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../redux/actionCreators'

import '../css/Common.css'
import '../css/Cashflow.css'
import '../css/CatalogItem.css'
import ActionButton from './ActionButton'
import Label from './Label';
import InputField from './InputField';
import DetailProductPanel from './DetailProductPanel';
import StockListTable from './StockListTable'
import Message from './Message'
import TransactionReceipt from './TransactionReceipt'
import * as stringUtil from '../utils/StringUtil'
import ActionButtons from './ActionButtons'
import InstantTable from './InstantTable'
import InputDropdown from './InputDropdown'
import * as componentUtil from '../utils/ComponentUtil'

class Cashflow
    extends Component {

    constructor(props) {
        super(props);
        this.state = { product: null, supplier: {}, showDetail: false, productFlows: [], messageShow: false, messageType: "" }
 
    }
    componentDidMount() {
        document.title = "Cashflow"; 
    }
    componentDidUpdate() { 
    }

    render(){
        return(
            <div className="section-container">
                <h2>Cashflow Page</h2>
            </div>
        )
    }

    
}
const mapStateToProps = state => {
    return {
        selectedProduct: state.transactionState.selectedProduct 
         
    }
}

const mapDispatchToProps = dispatch => ({
    getProductList: (productName) => dispatch(actions.getProductListTrx(productName)) 
    
})
export default (connect(
    mapStateToProps,
    mapDispatchToProps
)(Cashflow));