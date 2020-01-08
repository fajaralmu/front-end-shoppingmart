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

class Cashflow
    extends Component {

    constructor(props) {
        super(props);

        const date = new Date();

        this.state = {
            chartOrientation: "horizontal",
            fromMonth: date.getMonth() + 1, fromYear: date.getFullYear(),
            toMonth: date.getMonth() + 1, toYear: date.getFullYear()
        }
        this.getCashflowDetail = () => {
            if (!componentUtil.checkExistance("select-month-from", "select-month-to",
                "select-year-from", "select-year-to")) {
                return;
            }
            let request = {
                fromMonth: this.state.fromMonth,//_byId("select-month-from").value,
                fromYear: this.state.fromYear,// _byId("select-year-from").value,
                toMonth: this.state.toMonth,//_byId("select-month-to").value,
                toYear: this.state.toYear,// _byId("select-year-to").value,
            }
            this.props.getCashflowDetail(request, this.props.app);
        }

        this.onChangeChartOrientation = (value) => {
            if (value == 'h')
                this.setState({ chartOrientation: 'horizontal' })
            if (value == 'v')
                this.setState({ chartOrientation: 'vertical' })
            console.log("Selected?", _byId("radio-orientation-" + value).checked);

        }


    }
    componentDidMount() {
        document.title = "Cashflow";
        this.getCashflowDetail();
    }
    componentDidUpdate() {
    }

    render() {

        let filterInfo = <div>
            {"From "}
            {stringUtil.monthYearString(this.state.fromMonth, this.state.fromYear)}
            {" to "}
            {stringUtil.monthYearString(this.state.toMonth, this.state.toYear)}
        </div>

        let isChartHorizontal = this.state.chartOrientation == "horizontal";
        let isChartVertical = this.state.chartOrientation == "vertical";

        let cashflowDetail = this.props.cashflowDetail != null ? this.props.cashflowDetail : { supplies: [], purchases: [] };
        let maxValue = this.props.cashflowDetail != null ? this.props.cashflowDetail.maxValue : 0;

        let inputRadio = <div>
            <InputField key="radio-o-h" checked={isChartHorizontal} name="orientation" onChange={() => this.onChangeChartOrientation('h')} type="radio"
                id="radio-orientation-h" text="Horizontal orientation" />
            <InputField key="radio-o-v" checked={isChartVertical} name="orientation" onChange={() => this.onChangeChartOrientation('v')} type="radio"
                id="radio-orientation-v" text="Vertical orientation" />
        </div>


        let chartOrientation = this.state.chartOrientation;

        let filterButtons = <ActionButtons buttonsData={[
            { text: "Back", onClick: () => this.props.setFeatureCode(null), id: "btn-back" },
            { text: "Search", onClick: this.getCashflowDetail, status: "success", id: "btn-get-cashflow-detail" }]}
        />;

        const filterBox =
            <creator.FilterBox rows={[{
                values: [<creator.DateSelectionFrom years={this.props.transactionYears}
                    monthVal={this.state.fromMonth} yearVal={this.state.fromYear}
                    handleOnChangeMfrom={(value) => this.setState({ fromMonth: value })}
                    handleOnChangeYfrom={(value) => this.setState({ fromYear: value })}
                />,
                <creator.DateSelectionTo years={this.props.transactionYears}
                    monthVal={this.state.toMonth} yearVal={this.state.toYear}
                    handleOnChangeMto={(value) => this.setState({ toMonth: value })}
                    handleOnChangeYto={(value) => this.setState({ toYear: value })} />, filterButtons, inputRadio]
            }]} />

        let cashflowDataRows = new Array();

        for (let i = 0; i < cashflowDetail.supplies.length; i++) {
            const spending = cashflowDetail.supplies[i];
            const earning = cashflowDetail.purchases[i];
            const yymm = earning.month + "/" + earning.year;
            const earningAmount = stringUtil.beautifyNominal(earning.amount);
            const spendingAmount = stringUtil.beautifyNominal(spending.amount);
            const earningCount = stringUtil.beautifyNominal(earning.count);
            const spendingCount = stringUtil.beautifyNominal(spending.count);

            cashflowDataRows.push({
                id: 'chart-e-' + yymm,
                item: earning.count, value: earning.amount, label: yymm,
                values: [yymm, <Chart orientation={chartOrientation} text={earningAmount + "(" + earningCount + "items)"} type="success" width={450} value={earning.amount} maxValue={maxValue} />],
                CS: [1, 3], RS: [2, 1]
            });
            cashflowDataRows.push({
                id: 'chart-s-' + yymm,
                item: spending.count, value: spending.amount, label: yymm,
                values: [<Chart orientation={chartOrientation} text={spendingAmount + "(" + spendingCount + "items)"} type="warning" width={450} value={spending.amount} maxValue={maxValue} />],
                CS: [3]
            });

        }

        if (chartOrientation == "vertical") {
            let cashflowsDataRowsVert = new Array();
            //initial
            cashflowsDataRowsVert.push({ id: 'label-vertical', values: [], CS: [] });
            cashflowsDataRowsVert.push({ id: 'chart-vertical', values: [] });
            cashflowDataRows.forEach(row => {
                if (row.id.includes('chart-e')) {
                    cashflowsDataRowsVert[1].values.push(row.values[1]);
                    //the label has 2 colspan
                    cashflowsDataRowsVert[0].values.push(row.label);
                    cashflowsDataRowsVert[0].CS.push(2);
                } else if (row.id.includes('chart-s')) {
                    cashflowsDataRowsVert[1].values.push(row.values[0]);
                }

            });

            cashflowDataRows = cashflowsDataRowsVert;
        }

        let tableStyle = { fontFamily: 'consolas', fontSize: '0.8em' }
        let cashflowListComponent = <div className="cashflow-list">
            <InstantTable valign={chartOrientation == "horizontal" ? "middle" : null} style={tableStyle} rows={cashflowDataRows} />
        </div>
        return (
            <div className="cashflow-container">
                <h2>Cashflow Detail</h2>
                {filterBox}
                {filterInfo}
                <div><p></p></div>
                {cashflowListComponent}
            </div>
        )
    }


}
const mapStateToProps = state => {
    return {
        cashflowDetail: state.transactionState.cashflowDetail
    }
}

const mapDispatchToProps = dispatch => ({
    getCashflowDetail: (request, app) => dispatch(actions.getCashflowDetail(request, app))
})
export default (connect(
    mapStateToProps,
    mapDispatchToProps
)(Cashflow));