import React, { Component } from 'react'

import '../dashboard/Dashboard.css'
import * as menus from '../../../constant/Menus'
import DashboardMenu from './DashboardMenu';
import TransactionOut from '../transaction/TransactionOut';
import ErrorPage from '../../ErrorPage';
import { withRouter } from 'react-router';
import TransactionPurchasing from '../transaction/TransactionPurchasing';
import Cashflow from './Cashflow';
import * as componentUtil from '../../../utils/ComponentUtil'
import ActionButton from '../../buttons/ActionButton';
import { connect } from 'react-redux'
import * as actions from '../../../redux/actionCreators'
import Card from '../../card/Card'
import * as stringUtil from '../../../utils/StringUtil'
import Label from '../../container/Label';
import ProductSales from './ProductSales';
import ContentTitle from '../../container/ContentTitle';
import InstantTable from '../../container/InstantTable';
import ComboBoxes from './../../inputs/ComboBoxes';
import GridComponent from './../../container/GridComponent';

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            featureCode: 'main',
            cashflowYear: componentUtil.getCurrentMMYY()[1],
            cashflowMonth: componentUtil.getCurrentMMYY()[0]
        }

        this.setFeatureCode = (code) => {
            this.setState({ featureCode: code });
        }
        this.validateLoginStatus = () => {
            if (this.props.loginStatus != true) this.props.history.push("/login");
        }
        this.getCashflowInfo = () => {
            let month = this.state.cashflowMonth;
            let year = this.state.cashflowYear;
            this.props.getCashflowInfo(month, year, "OUT", this.props.app);
            this.props.getCashflowInfo(month, year, "IN", this.props.app);

        }
    }

    componentDidMount() {
        this.validateLoginStatus();
        if (this.props.loginStatus != true)
            return;
        this.props.setMenuCode(menus.DASHBOARD);
        document.title = "Dashboard";
        this.getCashflowInfo();
    }

    componentDidUpdate() {
        this.validateLoginStatus();
    }

    render() {
        let minYear, maxYear = new Date().getFullYear();

        minYear = this.props.transactionYears[0];
        maxYear = this.props.transactionYears[1];

        let cashflowInfoIn = this.props.cashflowInfoIn ? this.props.cashflowInfoIn : { amount: "loading...", count: "loading..." };
        let cashflowInfoOut = this.props.cashflowInfoOut ? this.props.cashflowInfoOut : { amount: "loading...", count: "loading..." };

        console.log("this.props.cashflowInfoIn ", this.props.cashflowInfoIn);

        let mainComponent = <div>
            <div className="cashflow-info">
                <h3>Cashflow Info</h3>
                <GridComponent style={{ backgroundColor:'#cccccc', padding:'5px', borderRadius:'3px', width: 'max-content', gridColumnGap: '10px' }} items={[
                    <h3 style={{marginRight:'4px', color:'#555' }}><i  className="fas fa-calendar-alt"></i></h3>,
                    <ComboBoxes key="cb" values={[
                        {
                            id: "select-month",
                            defaultValue: this.state.cashflowMonth ? this.state.cashflowMonth : componentUtil.getCurrentMMYY()[0],
                            options: componentUtil.getDropdownOptionsMonth(),
                            handleOnChange: (value) => this.setState({ cashflowMonth: value })
                        },
                        {
                            id: "select-year",
                            defaultValue: this.state.cashflowYear ? this.state.cashflowYear : componentUtil.getCurrentMMYY()[1],
                            options: componentUtil.getDropdownOptionsYear(minYear, maxYear),
                            handleOnChange: (value) => this.setState({ cashflowYear: value })
                        }
                    ]} />,
                    <ActionButton status="secondary" id="btn-get-cashflow-info" text={<i className="fa fa-search"></i>} onClick={this.getCashflowInfo} />

                ]} />
                <div className="cashflow-info-wrapper">
                    <GridComponent style={{width:'50%'}}
                        items={[
                            <EarningContent cashflowInfoOut={cashflowInfoOut} />,
                            <SpendingContent cashflowInfoIn={cashflowInfoIn} />
                        ]} />
                </div>
            </div>
        </div>;

        if (this.state.featureCode != null) {
            switch (this.state.featureCode) {
                case 'trxOut':
                    mainComponent = <TransactionOut app={this.props.app} setFeatureCode={this.setFeatureCode} />
                    break;
                case 'trxIn':
                    mainComponent = <TransactionPurchasing app={this.props.app} setFeatureCode={this.setFeatureCode} />
                    break;
                case 'cashflow':
                    mainComponent = <Cashflow app={this.props.app} transactionYears={this.props.transactionYears} setFeatureCode={this.setFeatureCode} />
                    break;
                case 'productSales':
                    mainComponent = <ProductSales app={this.props.app} transactionYears={this.props.transactionYears} setFeatureCode={this.setFeatureCode} />
                    break;
                default:
                    break;
            }
        }
        if (this.props.loginStatus == true)
            return (
                <div className="section-container">
                    <ContentTitle title="Dashboard" iconClass="fas fa-tachometer-alt" description="Have a Nice Shop Keeping!" />
                    <DashboardMenu currentMenu={this.state.featureCode} goToMenu={this.setFeatureCode} />
                    {mainComponent}
                </div>
            )
        else
            return <ErrorPage message="OOPS! Page not found" />
    }

}

function EarningContent(props) {
    const cashflowInfoOut = props.cashflowInfoOut;
    const value = <><i className="fas fa-money-bill-wave"></i>&nbsp;{stringUtil.beautifyNominal(cashflowInfoOut.amount) + ",00"}</>;
    const content = <div> 
        <Label style={{ fontFamily: "TNR" }} text={value} />
        <Label text="Item" />
        <Label text={stringUtil.beautifyNominal(cashflowInfoOut.count)} />
    </div>;

    return (<Card style={{marginTop:'3px'}} title={"Total Earning " + stringUtil.monthYearString(cashflowInfoOut.month, cashflowInfoOut.year)} content={content} />);
}

function SpendingContent(props) {
    const cashflowInfoIn = props.cashflowInfoIn;
    const value = <><i className="fas fa-comments-dollar"></i>&nbsp;{stringUtil.beautifyNominal(cashflowInfoIn.amount) + ",00"}</>;
    const content = <div> 
        <Label style={{ fontFamily: "TNR" }} text={value} />
        <Label text="Item" />
        <Label text={<>{stringUtil.beautifyNominal(cashflowInfoIn.count)}</>} />
    </div>
    return (<Card style={{marginTop:'3px'}} title={"Total Spending " + stringUtil.monthYearString(cashflowInfoIn.month, cashflowInfoIn.year)} content={content} />);
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
)(Dashboard)); 