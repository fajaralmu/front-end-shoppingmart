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

class Cashflow
    extends Component {

    constructor(props) {
        super(props);
        this.state = { chartOrientation: "horizontal" }
        this.getCashflowDetail = () => {
            if (!componentUtil.checkExistance("select-month-from", "select-month-to",
                "select-year-from", "select-year-to")) {
                return;
            }
            let request = {
                fromMonth: _byId("select-month-from").value,
                fromYear: _byId("select-year-from").value,
                toMonth: _byId("select-month-to").value,
                toYear: _byId("select-year-to").value
            }
            console.log("wil get detail: ", request);
            this.props.getCashflowDetail(request);
        }

        this.onChangeChartOrientation = (value) => {
            if (value == 'h')
                this.setState({ chartOrientation: 'horizontal' })
            if (value == 'v')
                this.setState({ chartOrientation: 'vertical' })
        }

    }
    componentDidMount() {
        document.title = "Cashflow";
        this.getCashflowDetail();
    }
    componentDidUpdate() {
    }

    render() {
        let cashflowDetail = this.props.cashflowDetail != null ? this.props.cashflowDetail : { supplies: [], purchases: [] };
        let maxValue = this.props.cashflowDetail != null ? this.props.cashflowDetail.maxValue : 0;
        let filterDateFrom = <div> <Label text="from date" />
            <ComboBoxes values={[
                {
                    id: "select-month-from",
                    defaultValue: componentUtil.getCurrentMMYY()[0],
                    options: componentUtil.getDropdownOptionsMonth()
                },
                {
                    id: "select-year-from",
                    defaultValue: componentUtil.getCurrentMMYY()[1],
                    options: componentUtil.getDropdownOptionsYear(2017, 2020)
                }
            ]} /></div>;
        let filterDateTo = <div>
            <Label text="to date" />
            <ComboBoxes values={[
                {
                    id: "select-month-to",
                    defaultValue: componentUtil.getCurrentMMYY()[0],
                    options: componentUtil.getDropdownOptionsMonth()
                },
                {
                    id: "select-year-to",
                    defaultValue: componentUtil.getCurrentMMYY()[1],
                    options: componentUtil.getDropdownOptionsYear(2017, 2020)
                }
            ]} />
        </div>;
        let inputRadio = <div>
            <InputField name="orientation" onChange={() => this.onChangeChartOrientation('h')} selected={true} type="radio" id="orientation-h" text="Horizontal orientation" />
            <InputField name="orientation" onChange={() => this.onChangeChartOrientation('v')} type="radio" id="orientation-v" text="Vertical orientation" />
        </div>

        let chartOrientation = this.state.chartOrientation;

        let filterButtons = <ActionButtons buttonsData={[
            { text: "Back", onClick: () => this.props.setFeatureCode(null), id: "btn-back" },
            { status: "success", id: "btn-get-cashflow-detail", text: "Search", onClick: this.getCashflowDetail }]}
        />;

        const filterBox = <div className="filter-box rounded" >
            <InstantTable valign="bottom" rows={[{ values: [filterDateFrom, filterDateTo, filterButtons, inputRadio] }]} />

        </div>

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
            // cashflowDataRows.push({
            //     id: 'label-e-' + yymm, values: [
            //         "Earning :" + yymm,
            //         "Value :" + earningAmount,
            //         "Item: " + earningCount
            //     ]
            // });
            // cashflowDataRows.push({
            //     id: 'label-s-' + yymm, values: [
            //         "Spending :" + yymm,
            //         "Value :" + spendingAmount,
            //         "Item: " + spendingCount
            //     ]
            // });

        }
        console.log("______cashflow detail:", cashflowDataRows);

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

            console.log("cashflowsDataRowsVert==>", cashflowsDataRowsVert);
            console.log("cashflowDataRows==>", cashflowDataRows);
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
    getCashflowDetail: (request) => dispatch(actions.getCashflowDetail(request))

})
export default (connect(
    mapStateToProps,
    mapDispatchToProps
)(Cashflow));