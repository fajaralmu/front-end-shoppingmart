import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ContentTitle from '../../container/ContentTitle';
import TransactionSelling from './TransactionSelling';
import TransactionPurchasing from './TransactionPurchasing';



class BaseTransactionPage extends Component {

    constructor(props) {
        super(props); 
        this.type = "";

        this.validateLoginStatus = () => {
            if (this.props.loginStatus != true) {
                this.gotoLogin();
            }
        }
        this.gotoLogin = () => {
            this.props.history.push("/login");
        }

        this.setMenuCode = (code) => {
            this.props.setMenuCode(code);
        }
    }

    componentWillMount() {
        const paramType = this.props.match.params.type;
        if (!paramType || paramType == "") {
            this.gotoLogin();
        }
        if (paramType != "selling" && paramType != "purchasing") {
            this.gotoLogin();
        }
    } 

    componentDidUpdate() {
        this.validateLoginStatus();
        
    }

    render() {
        const paramType = this.props.match.params.type;
        const iconClass = paramType == "selling" ? "fas fa-cash-register" : "fas fa-truck-loading";
        return (
            <section className="section-container">
                <ContentTitle iconClass={iconClass} title={"Transaction " + paramType} />
                {paramType == "selling" ?
                    <TransactionSelling app={this.props.app} setMenuCode={this.setMenuCode} />
                    :
                    <TransactionPurchasing app={this.props.app} setMenuCode={this.setMenuCode} />
                }
            </section>
        )
    }
}
const mapStateToProps = state => {
    //console.log(state);
    return {

        loginStatus: state.userState.loginStatus,
    }
}

//   const mapDispatchToProps = dispatch => ({
//     performLogout: (app) => dispatch(actions.performLogout(app)),
//     requestAppId: (app) => dispatch(actions.requestAppId(app)),
//     refreshLogin: () => dispatch(actions.refreshLoginStatus()),
//     // getProductCatalog: (page) => dispatch(actions.getProductList(page))
//   })

export default withRouter(connect(
    mapStateToProps
    // mapDispatchToProps
)(BaseTransactionPage)) 