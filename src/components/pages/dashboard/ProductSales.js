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

class ProductSales
    extends Component {

    constructor(props) {
        super(props);
        const date = new Date();
        this.state = {
            showDetail: false, productDetailId: null,
            chartOrientation: "horizontal", page: 0, updated: new Date(),
            fromMonth: date.getMonth() + 1, fromYear: date.getFullYear(),
            toMonth: date.getMonth() + 1, toYear: date.getFullYear(),
            productName: null
        }
        this.getProductSales = (loadMore, _page) => {
            this.setState({ page: _page, productDetailId: null });
            if (!componentUtil.checkExistance("select-month-from", "select-month-to",
                "select-year-from", "select-year-to")) {
                return;
            }
            let request = {
                page: _page,
                fromMonth: this.state.fromMonth,//byId("select-month-from").value,
                fromYear: this.state.fromYear,// byId("select-year-from").value,
                toMonth: this.state.toMonth,//byId("select-month-to").value,
                toYear: this.state.toYear,// byId("select-year-to").value,
                productName: this.state.productName,
                //special fro laod more case
                loadMore: loadMore,
                referrer: this
            }

            this.props.getProductSales(request);
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

            return (<creator.FilterBox rows={[{
                values: [
                    <creator.DateSelectionFrom years={this.props.transactionYears}
                        monthVal={this.state.fromMonth} yearVal={this.state.fromYear}
                        handleOnChangeMfrom={(value) => this.setState({ fromMonth: value })}
                        handleOnChangeYfrom={(value) => this.setState({ fromYear: value })}
                    />,
                    <creator.DateSelectionTo years={this.props.transactionYears}
                        monthVal={this.state.toMonth} yearVal={this.state.toYear}
                        handleOnChangeMto={(value) => this.setState({ toMonth: value })}
                        handleOnChangeYto={(value) => this.setState({ toYear: value })} />,
                    <InputField value={this.state.productName} onKeyUp={this.setRequestProductName} id="input-product-name" placeholder="Product Name" />,
                    <ActionButtons buttonsData={[
                        { text: "Back", onClick: () => this.props.setFeatureCode(null), id: "btn-back" },
                        { text: <i className="fas fa-search"></i>, onClick: () => this.getProductSales(null, 0), id: "btn-get-product-sales", status: "success" }]}
                    />
                ]
            }]} />);
        }

        this.constructFilterInfo = () => {
            return (<div>
                {"From "}
                {stringUtil.monthYearString(this.state.fromMonth, this.state.fromYear)}
                {" to "}
                {stringUtil.monthYearString(this.state.toMonth, this.state.toYear)}
             </div>)
        }

    }
    componentDidMount() {
        document.title = "ProductSales";
        // this.getProductSales();
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
                value: i, label: <Label key={'lbl-e-' + entity.product.id} text={(i + 1), entity.product.name}
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
            productSalesListComponent = <h2>No Data</h2>
        }

        return (
            <div className="cashflow-container">
                <h2>Product Sales</h2>
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