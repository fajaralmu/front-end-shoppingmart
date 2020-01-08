import React, { Component } from 'react'
import '../css/Common.css'
import '../css/Dashboard.css'
import * as menus from '../constant/Menus'
import DashboardMenu from './DashboardMenu';
import TransactionOut from './TransactionOut';
import ErrorPage from './ErrorPage';
import { withRouter } from 'react-router';
import TransactionIn from './TransactionIn';
import Cashflow from './Cashflow';
import ComboBoxes from './ComboBoxes';
import * as componentUtil from '../utils/ComponentUtil'
import ActionButton from './ActionButton';
import { connect } from 'react-redux'
import * as actions from '../redux/actionCreators'
import InstantTable from './InstantTable';
import Card from './Card'
import * as stringUtil from '../utils/StringUtil'
import Label from './Label';
import ProductSales from './ProductSales';

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            featureCode: null
        }

        this.setFeatureCode = (code) => {
            this.setState({ featureCode: code });
        }
        this.validateLoginStatus = () => {
            if (this.props.loginStatus != true) this.props.history.push("/login");
        }
        this.getCashflowInfo = () => {
            let month = document.getElementById("select-month") ? document.getElementById("select-month").value : componentUtil.getCurrentMMYY()[0];
            let year = document.getElementById("select-year") ? document.getElementById("select-year").value : componentUtil.getCurrentMMYY()[1];
            this.props.getCashflowInfo(month, year, "OUT");
            this.props.getCashflowInfo(month, year, "IN");

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

        let cashflowInfoIn = this.props.cashflowInfoIn ? this.props.cashflowInfoIn : { amount: "loading...", count: "loading..." };
        let cashflowInfoOut = this.props.cashflowInfoOut ? this.props.cashflowInfoOut : { amount: "loading...", count: "loading..." };

        let earningContent = <div>
            <Label text="Value" />
            <Label text={stringUtil.beautifyNominal(cashflowInfoOut.amount) + ",00"} />
            <Label text="Item" />
            <Label text={stringUtil.beautifyNominal(cashflowInfoOut.count)} />
        </div>;
        let spendingContent = <div>
            <Label text="Value" />
            <Label text={stringUtil.beautifyNominal(cashflowInfoIn.amount) + ",00"} />
            <Label text="Item" />
            <Label text={stringUtil.beautifyNominal(cashflowInfoIn.count)} />
        </div>

        let mainComponent = <div><DashboardMenu goToMenu={this.setFeatureCode} />
            <div className="cashflow-info">
                <h3>Cashflow Info</h3>
                <ComboBoxes values={[
                    {
                        id: "select-month",
                        defaultValue: componentUtil.getCurrentMMYY()[0],
                        options: componentUtil.getDropdownOptionsMonth()
                    },
                    {
                        id: "select-year",
                        defaultValue: componentUtil.getCurrentMMYY()[1],
                        options: componentUtil.getDropdownOptionsYear(2017, 2020)
                    }
                ]} />
                <ActionButton status="success" id="btn-get-cashflow-info" text="Search" onClick={this.getCashflowInfo} />
                <div className="cashflow-info-wrapper">
                    <InstantTable disabled={true}
                        rows={[{
                            values: [
                                <Card title={"My earning in " + stringUtil.monthYearString(cashflowInfoOut.month, cashflowInfoOut.year)} content={earningContent} />,
                                <Card title={"My spending in " + stringUtil.monthYearString(cashflowInfoIn.month, cashflowInfoIn.year)} content={spendingContent} />
                            ]
                        }]} />
                </div>
            </div>
        </div>;

        if (this.state.featureCode != null) {
            switch (this.state.featureCode) {
                case 'trxOut':
                    mainComponent = <TransactionOut setFeatureCode={this.setFeatureCode} />
                    break;
                case 'trxIn':
                    mainComponent = <TransactionIn setFeatureCode={this.setFeatureCode} />
                    break;
                case 'cashflow':
                    mainComponent = <Cashflow setFeatureCode={this.setFeatureCode} />
                    break;
                case 'productSales':
                    mainComponent = <ProductSales setFeatureCode={this.setFeatureCode} />
                    break;
                default:
                    break;
            }
        }
        if (this.props.loginStatus == true)
            return (
                <div className="section-container">
                    <h2>Welcome to Universal Shop App!</h2>
                    <p>Happy shop keeping</p>
                    {mainComponent}
                </div>
            )
        else
            return <ErrorPage message="OOPS! Page not found" />
    }

}
const mapStateToProps = state => {
    return {
        cashflowInfoIn: state.transactionState.cashflowInfoIn,
        cashflowInfoOut: state.transactionState.cashflowInfoOut
    }
}

const mapDispatchToProps = dispatch => ({
    getCashflowInfo: (month, year, type) => dispatch(actions.getCashflowInfo(month, year, type)),

})
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard)); 