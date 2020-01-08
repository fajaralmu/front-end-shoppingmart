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
import { _byId } from '../utils/ComponentUtil'
import ComboBoxes from './ComboBoxes'
import Chart from './Chart'
import * as creator from '../utils/ComponentCreator'

class ProductSales
    extends Component {

    constructor(props) {
        super(props);
        this.state = { chartOrientation: "horizontal", page: 0, updated: new Date() }
        this.getProductSales = (loadMore) => {
            if (!componentUtil.checkExistance("select-month-from", "select-month-to",
                "select-year-from", "select-year-to")) {
                return;
            }
            let request = {
                page: this.state.page,
                fromMonth: _byId("select-month-from").value,
                fromYear: _byId("select-year-from").value,
                toMonth: _byId("select-month-to").value,
                toYear: _byId("select-year-to").value,

                //special fro laod more case
                loadMore: loadMore,
                referrer: this
            }

            this.props.getProductSales(request);
        }

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
            this.setState({ page: currentPage + 1 });
            this.getProductSales(true);
        }

        this.resetPage = () => {
            this.setState({ page: 0 });
        }

    }
    componentDidMount() {
        document.title = "ProductSales";
        // this.getProductSales();
    }
    componentDidUpdate() {
        console.log("updated");
    }

    render() {

        let productSalesData = this.props.productSalesData != null ? this.props.productSalesData : { entities: [], filter: {} };
        let maxValue = stringUtil.getMaxSales(productSalesData.entities);
        console.log("============(product sales data)====", productSalesData.entities.length, "IN", new Date());
        let filterInfo = <div>
            {"From "}
            {stringUtil.monthYearString(productSalesData.filter.month, productSalesData.filter.year)}
            {" to "}
            {stringUtil.monthYearString(productSalesData.filter.monthTo, productSalesData.filter.yearTo)}
        </div>

        let filterButtons = <ActionButtons buttonsData={[
            { text: "Back", onClick: () => this.props.setFeatureCode(null), id: "btn-back" },
            { text: "Search", onClick: () => this.getProductSales(null), id: "btn-get-product-sales", status: "success" }]}
        />;

        const filterBox =
            <creator.FilterBox rows={[{ values: [<creator.DateSelectionFrom handleOnChange={this.resetPage} />, <creator.DateSelectionTo handleOnChange={this.resetPage} />, filterButtons] }]} />

        let productDetailRows = new Array();

        for (let i = 0; i < productSalesData.entities.length; i++) {
            const entity = productSalesData.entities[i];
            const sales = stringUtil.beautifyNominal(entity.sales);

            productDetailRows.push({
                id: 'chart-e-' + entity.product.id,
                values: [(i + 1), entity.product.name,
                <Chart text={sales}
                    type="success" width={450} value={entity.sales} maxValue={maxValue} />
                ]
            });
        }

        let tableStyle = { fontFamily: 'consolas', fontSize: '0.8em' }
        let productSalesListComponent = <div className="cashflow-list">
            <InstantTable style={tableStyle} rows={productDetailRows} />
        </div>
        return (
            <div className="cashflow-container">
                <h2>Product Sales</h2>
                {filterBox}
                <div><p>{filterInfo}</p></div>
                {productSalesListComponent}
                <ActionButton text="Load more" status="warning" onClick={this.loadMore} />
            </div>
        )
    }


}



const mapStateToProps = state => {
    return {
        productSalesData: state.transactionState.productSalesData
    }
}

const mapDispatchToProps = dispatch => ({
    getProductSales: (request) => dispatch(actions.getProductSales(request))
})
export default (connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductSales));