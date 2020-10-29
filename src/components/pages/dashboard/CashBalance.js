import React from 'react'

import '../dashboard/Dashboard.css'
import BaseComponent from './../../BaseComponent';
import TransactionHistoryService from './../../../services/TransactionHistoryService';
import { getCurrentMMYY, getMonthDays } from '../../../utils/DateUtil';
import ActionButton from '../../buttons/ActionButton';
import InputField from '../../inputs/InputField';
import { beautifyNominal } from '../../../utils/StringUtil';
import { MONTHS } from './../../../utils/DateUtil';

class CashBalance extends BaseComponent {
    constructor(props) {
        super(props);
        this.transactionHistoryService = TransactionHistoryService.instance;

        let defaultMonth = getCurrentMMYY()[0];
        let defaultYear = getCurrentMMYY()[1];

        this.state = {
            balanceInfo: {
                creditAmt: 0,
                debitAmt: 0,
                actualBalance: 0
            },
            filterDay: getMonthDays(defaultMonth),
            filterYear: defaultYear,
            filterMonth: defaultMonth,
            inventoriesQuantity: 0
        }

        this.getBalanceInfo = () => {

            const request = {
                filter: {
                    day: this.state.filterDay,
                    month: this.state.filterMonth,
                    year: this.state.filterYear
                }
            }
            this.commonAjax(this.transactionHistoryService.getBalanceInfo, request, this.showBalanceInfo);
        }

        this.getInventoriesQuantity = () => {
            this.commonAjax(this.transactionHistoryService.getInventoriesQuantity, {}, this.updateInventoryQuantity);
        }

        this.updateInventoryQuantity = (response) => {
            this.setState({ inventoriesQuantity: response.quantity });
        }

        this.showBalanceInfo = (response) => {
            this.setState({ balanceInfo: response.entity });
        }

        this.updatePeriod = (key, value) => {
            if(isNaN(value) || parseInt(value) < 1) { return; }
            switch (key) {
                case "d":
                    this.setState({ filterDay: value })
                    break;
                case "m":
                    if(parseInt(value) <= 12){ 
                        this.setState({ filterMonth: value })
                    }
                    break;
                case "y":
                    this.setState({ filterYear: value })
                    break;
                default:
                    break;
            }
        }

        this.getBalanceDateString = () => {
            const month = MONTHS[this.state.filterMonth-1];
            return this.state.filterDay +" "+month+" "+this.state.filterYear;
        }
    }

    componentDidMount() {
        this.props.setFeatureCode('balance');
    }

    render() {
        const balanceInfo = this.state.balanceInfo;

        return (
            <div className="cashflow-container">
                <div className="info-item">
                    <div className="row">
                        <div className="col-6">
                            <h5><i className="fas fa-history"></i>&nbsp;Period Filter</h5>
                            <InputField type="number" id="inout-day" placeholder="day"
                                onKeyUp={(val, id) => this.updatePeriod('d', val)} />
                            <InputField type="number" id="input-month" placeholder="month"
                                onKeyUp={(val, id) => this.updatePeriod('m', val)} />
                            <InputField type="number" id="input-year" placeholder="year"
                                onKeyUp={(val, id) => this.updatePeriod('y', val)} />
                        </div>
                        <div className="col-6">
                            <h5><i className="fas fa-wallet"></i>&nbsp;Balance Data { this.getBalanceDateString()}</h5>
                            <p>Incoming: {beautifyNominal(balanceInfo.debitAmt)}</p>
                            <p>Spending: {beautifyNominal(balanceInfo.creditAmt)}</p>
                            <p>Balance: {beautifyNominal(balanceInfo.actualBalance)}</p>
                        </div>
                    </div>
                    <ActionButton status="info" text="Load Cash Balance" onClick={this.getBalanceInfo} />
                </div>
                {/* ============ Inventory Info ============ */}
                <div className="info-item">
                    <div className="row">

                        <h5 className="col-3"><i className="fas fa-cube"></i>&nbsp;Inventory Quantity</h5>
                        <div className="col-9">{beautifyNominal(this.state.inventoriesQuantity)}</div>
                        <div className="col-12">
                            <ActionButton status="info" onClick={this.getInventoriesQuantity} text="Load Latest Quantity" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default CashBalance;