import React, {Component} from 'react'
import '../css/Common.css'
import '../css/Dashboard.css'
import * as menus from '../constant/Menus'

class Dashboard extends Component {

    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.props.setMenuCode(menus.DASHBOARD);
        document.title = "Dashboard";
    }

    render(){
        return(
            <div className="section-container">
                <h2>Welcome to Universal Shop App!</h2>
            </div>
        )
    }

}

export default Dashboard;