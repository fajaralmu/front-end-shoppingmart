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
                            <MenuItem onClick={() => this.goToMenu('trxIn')} text="Product Supply" />,
                            <MenuItem onClick={() => this.goToMenu('trxOut')} text="Purchase" />,
                            <MenuItem onClick={() => this.goToMenu('cashflow')} text="Cashflow" />]
                    },
                    {
                        values: [
                            <MenuItem onClick={() => this.goToMenu('productSales')} text="Product Sales" />
                        ]
                    }]} />
            </div>
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