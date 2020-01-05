import React, { Component } from 'react'
import '../css/Menu.css'
import '../css/Common.css'

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
                <div onClick={() => this.goToMenu('trxIn')} className="dashboard-menu-item clickable">New Items</div>
                <div onClick={() => this.goToMenu('trxOut')} className="dashboard-menu-item clickable">Transactions</div>
            </div>
        )
    }

}

export default DashboardMenu;