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

class Cashflow
    extends Component {

    constructor(props) {
        super(props);
        this.state = {}
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

    }
    componentDidMount() {
        document.title = "Cashflow";
        this.getCashflowDetail();
    }
    componentDidUpdate() {
    }

    render() {
        let cashflowDetail = this.props.cashflowDetail != null ? this.props.cashflowDetail : { supplies: [], purchases: [] };

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

        let filterButtons = <ActionButtons buttonsData={[
            { text: "Back", onClick: () => this.props.setFeatureCode(null), id: "btn-back" },
            { status: "success", id: "btn-get-cashflow-detail", text: "Search", onClick: this.getCashflowDetail }]}
        />;

        const filterBox = <div className="filter-box" >
            <InstantTable valign="bottom" rows={[{ values: [filterDateFrom, filterDateTo, filterButtons] }]} />

        </div>

        let cashflowsData = new Array();

        for (let i = 0; i < cashflowDetail.supplies.length; i++) {
            const spending = cashflowDetail.supplies[i];
            const earning = cashflowDetail.purchases[i];
            cashflowsData.push({
                values: [
                    "Earning date:" + earning.month + "/" + earning.year,
                    "Value: " + stringUtil.beautifyNominal(earning.amount), "Item: " + stringUtil.beautifyNominal(earning.count)
                ]
            });
            cashflowsData.push({
                values: [
                    "Spending date:" + spending.month + "/" + earning.year,
                    "Value: " + stringUtil.beautifyNominal(spending.amount), "Item: " + stringUtil.beautifyNominal(spending.count)
                ]
            });
            cashflowsData.push({
                values: ["-".repeat(67)], CS: [3]
            })

        }
        let cashflowListComponent = <div className="cashflow-list">
            <InstantTable rows={cashflowsData} />
        </div>
        return (
            <div className="cashflow-container">
                <h2>Cashflow Page</h2>
                {filterBox}
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