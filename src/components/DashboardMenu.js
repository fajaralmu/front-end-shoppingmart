import React, { Component } from 'react'
import '../css/Menu.css'
import '../css/Common.css'
import InstantTable from './InstantTable';

class DashboardMenu extends Component {
    constructor(props) {
        super(props);

        this.goToMenu = (menuCode_) => {

            this.props.goToMenu(menuCode_);
        }
    }

    componentDidMount() {
        document.title = "Dashboard";
    }

    render() {

        return (
            <div className="dashboard-menu" >
                <InstantTable disabled={true}
                    rows={[{
                        values: [
                            <div onClick={() => this.goToMenu('trxIn')} className="dashboard-menu-item clickable">
                                <p>_____</p> <h3>New Items</h3></div>,
                            <div onClick={() => this.goToMenu('trxOut')} className="dashboard-menu-item clickable">
                                <p>_____</p> <h3>Transactions</h3></div>,
                            <div onClick={() => this.goToMenu('cashflow')} className="dashboard-menu-item clickable">
                                <p>_____</p> <h3>Cashflow</h3></div>]
                    }]} />
            </div>
        )
    }

}

export default DashboardMenu;