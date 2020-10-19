import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../../redux/actionCreators'

import * as stringUtil from '../../../utils/StringUtil'
import ActionButtons from '../../buttons/ActionButtons'
import InstantTable from '../../container/InstantTable'
import * as componentUtil from '../../../utils/ComponentUtil'
import { byId } from '../../../utils/ComponentUtil' 
import Chart from '../../Chart'
import * as creator from '../../../utils/ComponentCreator'
import InputField from '../../inputs/InputField'
import GraphChart from './GraphChart';
import { MONTHS } from './../../../utils/DateUtil';

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
                fromMonth: this.state.fromMonth,//byId("select-month-from").value,
                fromYear: this.state.fromYear,// byId("select-year-from").value,
                toMonth: this.state.toMonth,//byId("select-month-to").value,
                toYear: this.state.toYear,// byId("select-year-to").value,
            }
            this.props.getCashflowDetail(request, this.props.app);
        }

        this.onChangeChartOrientation = (value) => {
            if (value == 'h')
                this.setState({ chartOrientation: 'horizontal' })
            if (value == 'v')
                this.setState({ chartOrientation: 'vertical' })
            console.log("Selected?", byId("radio-orientation-" + value).checked);

        }

        this.constructFilterBox = () => {

            let isChartHorizontal = this.state.chartOrientation == "horizontal";
            let isChartVertical = this.state.chartOrientation == "vertical";

            let inputRadio = 
            (<div className="row">
                <InputField key="radio-o-h" checked={isChartHorizontal} name="orientation" onChange={() => this.onChangeChartOrientation('h')} type="radio"
                    id="radio-orientation-h" text="Horizontal orientation" />
                <InputField key="radio-o-v" checked={isChartVertical} name="orientation" onChange={() => this.onChangeChartOrientation('v')} type="radio"
                    id="radio-orientation-v" text="Vertical orientation" />
            </div>);

            let filterButtons = <ActionButtons buttonsData={[
                { text: "Back", onClick: () => this.props.setFeatureCode(null), id: "btn-back" },
                { text: <i className="fas fa-search"></i>, onClick: this.getCashflowDetail, status: "success", id: "btn-get-cashflow-detail" }]}
            />;

            return (
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
                }]} />)
        }

        this.constructFilterInfo = () => {
            return (<div>
                {"From "}
                {stringUtil.monthYearString(this.state.fromMonth, this.state.fromYear)}
                {" to "}
                {stringUtil.monthYearString(this.state.toMonth, this.state.toYear)}
            </div>);
        }
    }
    componentDidMount() {
        document.title = "Cashflow";
        this.getCashflowDetail();
    }
    componentDidUpdate() {
    }

    render() {

        let filterInfo = this.constructFilterInfo();

        const cashflowDetail = this.props.cashflowDetail != null ? this.props.cashflowDetail : { supplies: [], purchases: [] };
        const maxValue = this.props.cashflowDetail != null ? this.props.cashflowDetail.maxValue : 0;

        const filterBox = this.constructFilterBox();

        const cashflowDataRows = new Array();
        console.log("cashflowDetail: ", cashflowDetail);
        let chartIndex = 0;
        const chartGroups = new Array();
        for (let i = 0; i < cashflowDetail.supplies.length; i++, chartIndex += 2) {
            const spending = cashflowDetail.supplies[i];
            const earning = cashflowDetail.purchases[i];
            const period = MONTHS[earning.month-1] +" " + earning.year;
            const earningAmount = stringUtil.beautifyNominal(earning.amount);
            const spendingAmount = stringUtil.beautifyNominal(spending.amount);
            const earningCount = stringUtil.beautifyNominal(earning.count);
            const spendingCount = stringUtil.beautifyNominal(spending.count);

            //earning
            cashflowDataRows.push({
                group: i,
                index: chartIndex,
                series: "earn_amt",
                value: earning.amount,
                label: earningAmount,
                color: 'rgb(10,200,10)'
            });
            // cashflowDataRows.push({
            //     index: chartIndex, 
            //     series: "earn_qty",
            //     value: earning.count,  
            //     label: earningCount,
            // });


            //spending
            cashflowDataRows.push({
                group: i,
                index: chartIndex + 1,
                series: "spend_amt",
                value: spending.amount,
                label: spendingAmount,
                color: 'rgb(200,10,10)'
            });
            // cashflowDataRows.push({
            //     index: chartIndex+1, 
            //     series: "spend_qty",
            //     value: spending.count,  
            //     label: spendingCount,
            // }); 
            chartGroups.push({ value: i, label: period });
        }

        let cashflowListComponent = <div className="cashflow-list" style={{ width: '70vw', overflow: 'scroll'}}>
            <GraphChart chartGroups={chartGroups} maxValue={maxValue} chartData={cashflowDataRows} orientation={this.state.chartOrientation} />

        </div>
        return (
            <div className="cashflow-container">
                <h3>Cashflow Detail</h3>
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
        transactionYears: state.transactionState.transactionYears,
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