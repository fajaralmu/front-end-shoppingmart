import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../../redux/actionCreators'

import ActionButton from '../../buttons/ActionButton'
import * as stringUtil from '../../../utils/StringUtil'
import ActionButtons from '../../buttons/ActionButtons'
import * as componentUtil from '../../../utils/ComponentUtil'
import { byId } from '../../../utils/ComponentUtil'
import * as creator from '../../../utils/ComponentCreator'
import InputField from '../../inputs/InputField'
import Label from '../../container/Label'
import ProductSalesDetail from './ProductSalesDetail'
import GraphChart from './GraphChart'
import BaseComponent from './../../BaseComponent';

class ProductSales
    extends BaseComponent {

    constructor(props) {
        super(props);
        const date = new Date();
        this.state = {
            showDetail: false, productDetailId: null,
            chartOrientation: "horizontal", page: 0, updated: new Date(),
            fromMonth: date.getMonth() + 1, fromYear: date.getFullYear(),
            toMonth: date.getMonth() + 1, toYear: date.getFullYear(),
            fetchLimit: 10,
            productName: null
        }
        /**
         * 
         * @param {Boolean} loadMore 
         * @param {Number} p  page
         */
        this.getProductSales = (loadMore, p) => {
            this.setState({ page: p, productDetailId: null });
            if (!componentUtil.checkExistance("select-month-from", "select-month-to",
                "select-year-from", "select-year-to")) {
                return;
            }
            let request = {
                page: p,
                fromMonth: this.state.fromMonth,//byId("select-month-from").value,
                fromYear: this.state.fromYear,// byId("select-year-from").value,
                toMonth: this.state.toMonth,//byId("select-month-to").value,
                toYear: this.state.toYear,// byId("select-year-to").value,
                productName: this.state.productName,
                //special fro laod more case
                loadMore: loadMore,
                referrer: this,
                limit: this.state.fetchLimit
            }

            this.props.getProductSales(request);
        }

        this.setRequestLimit = (value, id) => {
            this.setState({ fetchLimit: value, activeField: id })
        }

        this.getProductSalesDetail = (productId) => {
            if (this.state.productDetailId != productId) {

                let request = {
                    page: 0,
                    fromMonth: this.state.fromMonth,//byId("select-month-from").value,
                    fromYear: this.state.fromYear,// byId("select-year-from").value,
                    toMonth: this.state.toMonth,//byId("select-month-to").value,
                    toYear: this.state.toYear,// byId("select-year-to").value, 
                    productId: productId
                }

                this.props.getProductSalesDetail(request, this.props.app);
            }
            this.setState({ showDetail: true, productDetailId: productId })
        }

        /**
        * this method is called in trxReducer
        */
        this.refresh = () => {
            console.log("++reresh++");
            this.setState({ updated: new Date() });
        }

        this.onChangeChartOrientation = (value) => {
            if (value == 'h')
                this.setState({ chartOrientation: 'horizontal' })
            if (value == 'v')
                this.setState({ chartOrientation: 'vertical' })
        }

        this.loadMore = () => {
            let currentPage = this.state.page;

            this.getProductSales(true, currentPage + 1);
        }

        this.resetPage = () => {
            this.setState({ page: 0 });
        }

        this.setRequestProductName = (value, id) => {
            this.setState({ productName: value, activeField: id })
        }

        this.constructFilterBox = () => {

            return (<div className="row cashflow-filter-box">

                <div className="col-4">
                    <creator.DateSelectionFrom years={this.props.transactionYears}
                            monthVal={this.state.fromMonth} yearVal={this.state.fromYear}
                            handleOnChangeMfrom={(value) => this.setState({ fromMonth: value })}
                            handleOnChangeYfrom={(value) => this.setState({ fromYear: value })}/>
                </div>
                <div className="col-4">
                    <creator.DateSelectionTo years={this.props.transactionYears}
                            monthVal={this.state.toMonth} yearVal={this.state.toYear}
                            handleOnChangeMto={(value) => this.setState({ toMonth: value })}
                            handleOnChangeYto={(value) => this.setState({ toYear: value })} />
                </div>
                <div className="col-4"></div>
                <div className="col-4">
                <InputField  onKeyUp={this.setRequestProductName} id="input-product-name" placeholder="Product Name" />
                    
                </div>
                <div className="col-4">
                <InputField type="number"  onKeyUp={this.setRequestLimit} id="input-fetch-limit" placeholder="Fetch Limit(default 10 items)" />
                    
                </div>
                <div className="col-4">
                <ActionButtons buttonsData={[
                        { text: "Back", onClick: () => this.props.setFeatureCode(null), id: "btn-back" },
                        { text: <i className="fas fa-search"></i>, onClick: () => this.getProductSales(null, 0), id: "btn-get-product-sales", status: "success" }]}
                    />
                </div>
            </div> );
        }

        this.constructFilterInfo = () => {
            return (<div class="alert alert-success" role="alert" style={{textAlign:"center"}}>
                {"From "}
                {stringUtil.monthYearString(this.state.fromMonth, this.state.fromYear)}
                {" to "}
                {stringUtil.monthYearString(this.state.toMonth, this.state.toYear)}
            </div>);
        }

        this.updateFilterPeriod = (filter) => {
            if(null == filter) return;
            this.setState({
                fromMonth: filter.month,
                fromYear: filter.year,
                toMonth: filter.monthTo,
                toYear: filter.yearTo
            })
        }

    }
    componentDidMount() {
        document.title = "ProductSales";
        if(this.props.productSalesData== null){
            this.getProductSales(false, 0);
        } else {
            this.updateFilterPeriod(this.props.productSalesData.filter);
        } 
    }
    componentDidUpdate() {
        console.log("updated", this.state.fromMonth, this.state.fromYear, " to ", this.state.toMonth, this.state.toYear);
        if (byId(this.state.activeField)) {
            byId(this.state.activeField).focus();
        }
    }

    render() {

        const productSalesData = this.props.productSalesData != null ? this.props.productSalesData : { entities: [], filter: {} };
        const maxValue = stringUtil.getMaxSales(productSalesData.entities);
        const filterInfo = this.constructFilterInfo();
        const filterBox = this.constructFilterBox();
        const productDetailRows = new Array();
        const chartGroups = new Array();

        /**
         * construct chart
         */
        for (let i = 0; i < productSalesData.entities.length; i++) {
            const entity = productSalesData.entities[i];
            const sales = stringUtil.beautifyNominal(entity.sales);
            chartGroups.push({
                value: i, label: <Label key={'lbl-e-' + entity.product.id} text={(i + 1), (i + 1)+" "+ entity.product.name}
                    onClick={() => this.getProductSalesDetail(entity.product.id)} />
            });
            productDetailRows.push({
                group: i,
                index: i,
                series: "product_sales",
                value: entity.sales,
                label: sales,
                color: 'rgb(160,160,160)'
            })
        }

        let productSalesListComponent;

        /**
         * if show detail
         */
        let productSalesDetailsXX = this.props.productSalesDetails;
        if (this.state.showDetail) {
            productSalesListComponent = <ProductSalesDetail 
                productSalesDetails={productSalesDetailsXX}
                goBack={() => { this.setState({ showDetail: false }) }} />
        } else if(productSalesData.entities.length > 0){
            productSalesListComponent = (
                <div className="cashflow-list">
                    <GraphChart chartGroups={chartGroups} maxValue={maxValue} chartData={productDetailRows} orientation={"horizontal"} />
                </div>)
        } else {
            productSalesListComponent = <h5 align="center"><i className="fas fa-exclamation-circle"></i>&nbsp;No data, please wait or search though filter box</h5>
        }

        return (
            <div className="cashflow-container">
                <h3>Product Sales</h3>
                {filterBox}
                <div> {filterInfo} </div>
                {productSalesListComponent}
                <ActionButton text="Load more" status="warning" onClick={this.loadMore} />
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        transactionYears: state.transactionState.transactionYears,
        productSalesData: state.transactionState.productSalesData,
        productSalesDetails: state.transactionState.productSalesDetails
    }
}

const mapDispatchToProps = dispatch => ({
    getProductSales: (request) => dispatch(actions.getProductSales(request)),
    getProductSalesDetail: (request, app) => dispatch(actions.getProductSalesDetail(request, app))
})
export default (connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductSales));