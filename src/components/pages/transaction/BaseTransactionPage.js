import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route, Switch, withRouter } from 'react-router-dom'
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
    }

    componentWillMount() {
        const paramType = this.props.match.params.type;
        if (!paramType) {
            this.gotoLogin();
        }
        if (paramType != "selling" && paramType != "purchasing") {
            this.gotoLogin();
        }
    }


    componentDidUpdate() {
        this.validateLoginStatus();
        const paramType = this.props.match.params.type;
        if (paramType == "selling" && this.props.app.state.menuCode != "selling") {
            this.props.setMenuCode("selling");
        }else  if (paramType == "purchasing" && this.props.app.state.menuCode != "purchasing") {
            this.props.setMenuCode("purchasing");
        }
    } 
    render() {
        const paramType = this.props.match.params.type;
        return (
            <section className="section-container">
                <ContentTitle title={"Transaction " + paramType} />
                {paramType == "selling" ?
                    <TransactionSelling app={this.props.app} setFeatureCode={this.setFeatureCode} />
                    :
                    <TransactionPurchasing app={this.props.app} setFeatureCode={this.setFeatureCode} />
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