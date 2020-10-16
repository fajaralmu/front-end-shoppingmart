import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Link, Switch, withRouter } from 'react-router-dom'
import * as actions from '../../../redux/actionCreators'
import * as menus from '../../../constant/Menus'
import ActionButtons from '../../buttons/ActionButtons'
import ComboBox from '../../inputs/ComboBox'
import * as componentUtil from '../../../utils/ComponentUtil'
import * as url from '../../../constant/Url'
import Card from '../../card/Card'
import ContentTitle from '../../container/ContentTitle'
import NavButtons from '../../navigation/NavButtons'
import GridComponent from '../../container/GridComponent'
import InputField from '../../inputs/InputField'
import ActionButton from '../../buttons/ActionButton'
import ImageCarousel from './../../container/ImageCarousel';

class SupplierDetail extends Component {

    constructor(props){
        super(props);

        this.close = () => {
            this.props.removeProductSupplied();
            this.props.hideDetail();
        }

    }

    componentWillMount(){
        const supplier = this.props.supplier;
        if(supplier != null){
            this.props.getProductSupplied( supplier.id, this.props.app);
        }
    }

    render(){
        const supplier = this.props.supplier;
        if(!supplier){
            return <h2>No Data</h2>
        }

        const groupedProducts = groupArray(this.props.productsSupplied, 4);

        return (
            <div className="section-container">
            <ContentTitle title={supplier.name} iconClass="fas fa-warehouse" description={<SupplierLink supplier={supplier} />} />
            <ImageCarousel imageUrls={[url.baseImageUrl + supplier.iconUrl ]} />
            <p>Address: {supplier.address}</p>
            <ActionButton text={"Back"} status="outline-secondary" onClick={this.close} />
                <div className="product list">
                    <p>Supplied Products</p>
                    <div className="row">
                        {
                        groupedProducts.length == 0 ? <h3>No Supplied Product Yet</h3> :
                        groupedProducts.map(function(products, i){
                            const starts = (i*groupedProducts[0].length+1);
                            return(
                                <OrderedListOfProduct wrapperClassName={"col-3"} starts={starts} products={products} />
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

const OrderedListOfProduct = function (props){
    const products = props.products;
    return  <div className={props.wrapperClassName}><ol start={props.starts}>
        {products.map(function(product){
            return <li>{product.name} ({product.unit.name})</li>
        })}
    </ol> </div>
}

const groupArray = function(array, division){
    if(null == array || array.length == 0){ return [] }
    const groupedArray = new Array();
    const itemPerDivision = Math.ceil(array.length / division)

    if(itemPerDivision == 1){
        groupedArray.push(array);
        return groupedArray;
    }

    for (let i = 0; i < division; i++) {
        groupedArray.push(new Array());    
    }
    
    let index = 1;
    let divisionIndex = 0;
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        groupedArray[divisionIndex].push(element);

        index++;
        if(index > itemPerDivision){
            divisionIndex++;
            index = 1;
        }
        
    }

    return groupedArray;
}

function SupplierLink(prop){
    const supplier = prop.supplier;
    return <a target="_blank" href={supplier.website}>{supplier.website}</a>
}

const mapStateToProps = state => {
    return {
        productsSupplied: state.shopState.productsSupplied
    }
}

const mapDispatchToProps = dispatch => ({
    getProductSupplied: (supplierId, app) => dispatch(actions.getProductSupplied(supplierId, app)),
    removeProductSupplied: ( ) => dispatch(actions.removeProductSupplied( ))
})
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(SupplierDetail)); 