import React, { Component } from 'react'
import * as menuCss from '../../../components/navigation/Menu.css'
import Tab from '../../navigation/Tab';

class DashboardMenu extends Component {
    constructor(props) {
        super(props);

        this.goToMenu = (menuCode_) => {

            this.props.goToMenu(menuCode_);
        }

        this.isActive = (code) => {
            return this.props.currentMenu == code;
        }
    }

    componentDidMount() {
        document.title = "Dashboard";
    }

    render() {

        return (
            <div className="dashboard-menu" >
                <Tab style={{whiteSpace: 'nowrap'}} tabsData={[
                    { onClick: () => this.goToMenu('main'), active: this.isActive('main'), text: "Home" },
                    // { onClick: () => this.goToMenu('trxIn'), active: this.isActive('trxIn'), text: "Purchasing" },
                    // { onClick: () => this.goToMenu('trxOut'), active: this.isActive('trxOut'), text: "Selling" },
                    { onClick: () => this.goToMenu('cashflow'), active: this.isActive('cashflow'), text: "Cashflow" },
                    { onClick: () => this.goToMenu('productSales'), active: this.isActive('productSales'), text: "Product Sales" },
                    { onClick: () => this.goToMenu('balance'), active: this.isActive('balance'), text: "Balance Info" }]}
                />
            </div >
        )
    }

}

const MenuItem = (props) => {
    return (
        <div onClick={props.onClick} className="dashboard-menu-item  paper-shadow  ">
            <h3>{props.text}</h3></div>
    )
}

export default DashboardMenu;