import React, { Component } from 'react'
import '../css/Common.css'
import '../css/Dashboard.css'
import * as menus from '../constant/Menus'
import DashboardMenu from './DashboardMenu';
import TransactionOut from './TransactionOut';
import ErrorPage from './ErrorPage';

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            featureCode: null
        }

        this.setFeatureCode = (code) => {
            this.setState({ featureCode: code });
        }
    }

    componentDidMount() {
        this.props.setMenuCode(menus.DASHBOARD);
        document.title = "Dashboard";
    }

    render() {

        let mainComponent = <DashboardMenu goToMenu={this.setFeatureCode} />

        if (this.state.featureCode != null) {
            switch (this.state.featureCode) {
                case 'trxOut':
                    mainComponent = <TransactionOut setFeatureCode={this.setFeatureCode} />
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

export default Dashboard;