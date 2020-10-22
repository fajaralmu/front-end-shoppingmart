import React, { Component } from 'react'

import '../dashboard/Dashboard.css'
import * as menus from '../../../constant/Menus'
import DashboardMenu from './DashboardMenu';
import { withRouter } from 'react-router';
import Cashflow from './Cashflow';
import * as componentUtil from '../../../utils/ComponentUtil' 
import { connect } from 'react-redux'
import ProductSales from './ProductSales';
import ContentTitle from '../../container/ContentTitle';  
import MainDashboard from './MainDashboard';
import CashBalance from './CashBalance';
import './Dashboard.css'

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            featureCode: 'main',
            cashflowYear: componentUtil.getCurrentMMYY()[1],
            cashflowMonth: componentUtil.getCurrentMMYY()[0], 
        }

        this.setFeatureCode = (code) => {
            this.setState({ featureCode: code });
        }
        this.validateLoginStatus = () => {
            if (this.props.loginStatus != true) this.props.history.push("/login");
        }
    }

    componentDidMount() {
        this.validateLoginStatus();
        document.title = "Dashboard"; 
        this.props.setMenuCode(menus.DASHBOARD);
    }

    componentDidUpdate() {
        this.validateLoginStatus();
    }

    render() {
        let minYear, maxYear = new Date().getFullYear();
        const featureCode = this.state.featureCode;

        minYear = this.props.transactionYears[0];
        maxYear = this.props.transactionYears[1];

        let mainComponent = <></>;

        if (featureCode != null) {
           
            switch (featureCode) {
                 
                case 'cashflow':
                    mainComponent = <Cashflow app={this.props.app} setFeatureCode={this.setFeatureCode} />
                    break;
                case 'productSales':
                    mainComponent = <ProductSales app={this.props.app} setFeatureCode={this.setFeatureCode} />
                    break;
                case 'main':
                    mainComponent = <MainDashboard  app={this.props.app} setFeatureCode={this.setFeatureCode} />
                    break;
                case 'balance':
                    mainComponent = <CashBalance app={this.props.app} setFeatureCode={this.setFeatureCode} />
                    break;
                default:
                    break;
            }
        }
        return (
            <div className="section-container">
                <ContentTitle title="Dashboard" iconClass="fas fa-tachometer-alt" description="Have a Nice Shop Keeping!" />
                <DashboardMenu  currentMenu={this.state.featureCode} goToMenu={this.setFeatureCode} />
                {mainComponent}
            </div>
        ) 
    }
} 
const mapStateToProps = state => {
    return {
        loginStatus: state.userState.loginStatus, 
        transactionYears: state.transactionState.transactionYears
    }
}
 
export default withRouter(connect(
    mapStateToProps
)(Dashboard)); 