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

        return (
            <div className="section-container">
            <ContentTitle title={supplier.name} iconClass="fas fa-warehouse" description={<SupplierLink supplier={supplier} />} />
            <ImageCarousel imageUrls={[url.baseImageUrl + supplier.iconUrl ]} />
            <p>Address: {supplier.address}</p>
            <ActionButton text={"Back"} status="outline-secondary" onClick={this.close} />
                <div className="product list">
                    <p>Supplied Products</p>
                    <ol>
                        {this.props.productsSupplied.map(function(product){
                            return <li>
                                <p>{product.name}</p>
                            </li>
                        })}
                    </ol>
                </div>
            </div>
        )
    }
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