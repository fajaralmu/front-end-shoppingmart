import React from 'react'
import * as url from '../../../constant/Url'
import ContentTitle from '../../container/ContentTitle'
import ActionButton from '../../buttons/ActionButton'
import ImageCarousel from './../../container/ImageCarousel';
import { groupArray } from './../../../utils/CollectionUtil';
import SupplierService from './../../../services/SupplierService';
import BaseComponent from './../../BaseComponent';

class SupplierDetail extends BaseComponent {

    constructor(props) {
        super(props);
        this.supplierService = SupplierService.instance;
        this.parentApp = props.app;
        this.state = {
            products: [],
        }

        this.close = () => {
            this.props.hideDetail();
        }

        this.getProductSupplied = () => {

            const supplier = this.props.supplier;
            if (!supplier) { return; }
            this.commonAjax(this.supplierService.getProductSupplied, supplier.id, this.handleProductsSupplied)

        }

        this.handleProductsSupplied = (response) => {
            this.setState({ products: response.entities });
        }

    }

    componentWillMount() {
        const supplier = this.props.supplier;
        if (supplier != null) {
            this.getProductSupplied();
        }
    }

    render() {
        const supplier = this.props.supplier;
        if (!supplier) {
            return <h2>No Data</h2>
        }

        const groupedProducts = groupArray(this.state.products, 4);

        return (
            <section className="section-container">
                <ContentTitle title={supplier.name} iconClass="fas fa-warehouse" description={<SupplierLink supplier={supplier} />} />
                <SupplierInfo supplier={supplier} />
                <ActionButton text={"Back"} status="outline-secondary" onClick={this.close} />
                <div className="product list">
                    <h3 align="center">Supplied Products</h3>
                    <div className="row">
                        {groupedProducts.length == 0 ? <h4>No Supplied Product Yet</h4> :
                            groupedProducts.map(function (products, i) {
                                const starts = (i * groupedProducts[0].length + 1);
                                return (
                                    <OrderedListOfProduct wrapperClassName={"col-3"} starts={starts} products={products} />
                                )
                            })}
                    </div>
                </div>
            </section>
        )
    }
}

const SupplierInfo = function (props) {
    const supplier = props.supplier;
    return (
        <div>
            <ImageCarousel imageUrls={[url.baseImageUrl + supplier.iconUrl]} />
            <p>Address: {supplier.address}</p>
        </div>
    )
}

const OrderedListOfProduct = function (props) {
    const products = props.products;
    if (null == products) { return <></> }
    return <div className={props.wrapperClassName}>
        <ol start={props.starts}>
            {products.map((product) => <li>{product.name} ({product.unit ? product.unit.name : null})</li>)}
        </ol>
    </div>
}

function SupplierLink(prop) {
    const supplier = prop.supplier;
    return <a target="_blank" href={supplier.website}>{supplier.website}</a>
}

export default SupplierDetail;