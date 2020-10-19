import React, { Component } from 'react'
import { withRouter } from 'react-router';
import { connect } from 'react-redux'
import GridComponent from './../../container/GridComponent';
import ComboBoxes from './../../inputs/ComboBoxes';
import ActionButton from './../../buttons/ActionButton';
import Label from './../../container/Label';
import InputField from './../../inputs/InputField'; 
import Card from '../../card/Card'

import * as stringUtil from '../../../utils/StringUtil'
import * as componentUtil from '../../../utils/ComponentUtil' 
import * as actions from '../../../redux/actionCreators' 

class MainDashboard extends Component {

    constructor(props){
        super(props);
        this.state = {
            featureCode: 'main',
            cashflowYear: componentUtil.getCurrentMMYY()[1],
            cashflowMonth: componentUtil.getCurrentMMYY()[0], 
        }
        this.getCashflowInfo = () => {
            let month = this.state.cashflowMonth;
            let year = this.state.cashflowYear;
            this.props.getCashflowInfo(month, year, "OUT", this.props.app);
            this.props.getCashflowInfo(month, year, "IN", this.props.app);

        }

        this.showTransactionReceipt = (val, id) => {
            if(""==val || null==val){
                return;
            }
            this.props.history.push("/transaction-receipt/"+val);
        }
    }

    componentDidMount(){
        this.props.setFeatureCode('main');
        
        if(this.props.cashflowInfoOut == null && this.props.cashflowInfoIn == null){ 
            this.getCashflowInfo();
        } else {
            const info = this.props.cashflowInfoOut != null ? this.props.cashflowInfoOut : this.props.cashflowInfoIn
           
            this.setState({cashflowYear: info.year, cashflowMonth: info.month});
        }
    }

    render(){
        let minYear, maxYear = new Date().getFullYear();
        const featureCode = this.state.featureCode;

        minYear = this.props.transactionYears[0];
        maxYear = this.props.transactionYears[1];
        let cashflowInfoIn = this.props.cashflowInfoIn ? this.props.cashflowInfoIn : { amount: "loading...", count: "loading..." };
        let cashflowInfoOut = this.props.cashflowInfoOut ? this.props.cashflowInfoOut : { amount: "loading...", count: "loading..." };
        
        return (
            <div>
            <div className="cashflow-info">
                <h3>Cashflow Info</h3>
                <GridComponent style={{ backgroundColor: '#cccccc', padding: '5px', borderRadius: '3px', width: 'max-content', gridColumnGap: '10px' }} items={[
                    
                    <ComboBoxes key="cb" values={[
                        {
                            id: "select-month",
                            label: "Month",
                            defaultValue: this.state.cashflowMonth ? this.state.cashflowMonth : componentUtil.getCurrentMMYY()[0],
                            options: componentUtil.getDropdownOptionsMonth(),
                            handleOnChange: (value) => this.setState({ cashflowMonth: value })
                        },
                        {
                            id: "select-year",
                            label: "Year",
                            defaultValue: this.state.cashflowYear ? this.state.cashflowYear : componentUtil.getCurrentMMYY()[1],
                            options: componentUtil.getDropdownOptionsYear(minYear, maxYear),
                            handleOnChange: (value) => this.setState({ cashflowYear: value })
                        }
                    ]} />,
                    <ActionButton status="secondary" id="btn-get-cashflow-info" text={<i className="fa fa-search"></i>} onClick={this.getCashflowInfo} />

                ]} />
                <div className="cashflow-info-wrapper">
                    <GridComponent style={{ width: '50%' }}
                        items={[
                            <CashflowInfoContent type="earn" cashflowInfo={cashflowInfoOut} />,
                            <CashflowInfoContent type="spend" cashflowInfo={cashflowInfoIn} />
                        ]} />
                </div>
                <Label text="See Transaction Detail" />
                <InputField id="input-transaction-code" placeholder="Transaction Code" onEnterPress={this.showTransactionReceipt} />
            </div>
        </div>
        );
    }
}



function CashflowInfoContent(props) {
    const cashflowInfo = props.cashflowInfo;
    const title = props.type == "earn" ? "Total Earning" : "Total Spending";
    const value = <><i className="fas fa-comments-dollar"></i>&nbsp;{stringUtil.beautifyNominal(cashflowInfo.amount) + ",00"}</>;
    const content = <div>
        <Label style={{ fontFamily: "TNR" }} text={value} />
        <Label text="Item" />
        <Label text={<>{stringUtil.beautifyNominal(cashflowInfo.count)}</>} />
    </div>
    return (<Card style={{ marginTop: '3px' }} title={title + " " + stringUtil.monthYearString(cashflowInfo.month, cashflowInfo.year)} content={content} />);
}

const mapStateToProps = state => {
    return { 
        cashflowInfoIn: state.transactionState.cashflowInfoIn,
        cashflowInfoOut: state.transactionState.cashflowInfoOut,
        transactionYears: state.transactionState.transactionYears
    }
}

const mapDispatchToProps = dispatch => ({
    getCashflowInfo: (month, year, type, app) => dispatch(actions.getCashflowInfo(month, year, type, app)),

})
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(MainDashboard)); 