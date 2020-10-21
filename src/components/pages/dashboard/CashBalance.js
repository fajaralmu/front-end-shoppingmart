import React from 'react'

import '../dashboard/Dashboard.css'
import BaseComponent from './../../BaseComponent';
import TransactionHistoryService from './../../../services/TransactionHistoryService';
import { getCurrentMMYY } from '../../../utils/ComponentUtil';
import ActionButton from '../../buttons/ActionButton';
import InputField from '../../inputs/InputField';
import { beautifyNominal } from '../../../utils/StringUtil';

class CashBalance extends BaseComponent {
    constructor(props) {
        super(props);
        this.transactionHistoryService = TransactionHistoryService.instance;
        this.state = {
            balanceInfo: {
                creditAmt: 0,
                debitAmt: 0,
                actualBalance: 0
            },
            filterDay: 1,
            filterYear: getCurrentMMYY()[1],
            filterMonth: getCurrentMMYY()[0],
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

        this.showBalanceInfo = (response) => {
            this.setState({ balanceInfo: response.entity });
        }

        this.updatePeriod = (key, value) => {
            switch (key) {
                case "d":
                    this.setState({ filterDay: value })
                    break;
                case "m":
                    this.setState({ filterMonth: value })
                    break;
                case "y":
                    this.setState({ filterYear: value })
                    break;
                default:
                    break;
            }
        }
    }

    componentDidMount() {
        this.props.setFeatureCode('balance');
    }

    render() {  
        const balanceInfo = this.state.balanceInfo;

        return (
            <div className="cashflow-container">
                <h3>Cash Balance</h3>
                <div className="row">
                    <div className="col-6">
                        <h5>Period Filter</h5>
                        <InputField type="number" id="inout-day" placeholder="day" 
                            onKeyUp={(val,id)=>this.updatePeriod('d', val)} />
                        <InputField type="number" id="input-month" placeholder="month" 
                            onKeyUp={(val,id)=>this.updatePeriod('m', val)} />
                        <InputField type="number" id="input-year" placeholder="year" 
                            onKeyUp={(val,id)=>this.updatePeriod('y', val)} />
                    </div>
                    <div className="col-6">
                        <h5>Balance Data</h5>
                        <p>Incoming: {beautifyNominal(balanceInfo.debitAmt)}</p>
                        <p>Spending: {beautifyNominal(balanceInfo.creditAmt)}</p>
                        <p>Balance: {beautifyNominal(balanceInfo.actualBalance)}</p>
                    </div>
                </div>
                <ActionButton status="info" text="Submit" onClick={this.getBalanceInfo} />
            </div>
        )
    }

}

export default CashBalance;