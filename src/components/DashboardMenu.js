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
                <div className="menu-container">
                    <MenuItem key="menu-trxIn" onClick={() => this.goToMenu('trxIn')} text="Product Supply" />
                    <MenuItem key="menu-trxOut" onClick={() => this.goToMenu('trxOut')} text="Purchase" />
                    <MenuItem key="menu-cashflow" onClick={() => this.goToMenu('cashflow')} text="Cashflow" />
                    <MenuItem key="menu-productSales" onClick={() => this.goToMenu('productSales')} text="Product Sales" />
                </div>
            </div >
        )
    }

}

const MenuItem = (props) => {
    return (
        <div onClick={props.onClick} className="dashboard-menu-item clickable">
            <p>_____</p> <h3>{props.text}</h3></div>
    )
}

export default DashboardMenu;