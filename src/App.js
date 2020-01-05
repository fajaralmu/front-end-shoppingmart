
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { connect } from 'react-redux'
import Header from './components/Header'
import Menu from './components/Menu'
import Home from './components/Home'
import About from './components/About'
import { BrowserRouter as Router, Route, Link, Switch, withRouter } from 'react-router-dom'
import * as actions from './redux/actionCreators'
import * as hardCoded from './utils/HardCodedEntites'
import Catalog from './components/Catalog'
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import * as menus from './constant/Menus'
import SupplierList from './components/SupplierList';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      menus: [],
      detailMode: false,
      menuCode: ''
    };

    this.setDetailMode = (detailMode) => {
      this.setState({ detailMode: detailMode });
    }

    this.setMenuCode = (code) => {
      console.log(">>>>>> MENU: ", code)
      this.setState({ menuCode: code });
    }

    this.handleMenuCLick = (menu) => {
      switch (menu.code) {
        case menus.LOGOUT: 
          if(!window.confirm("Are you sure want to logout?")){
            return;
          }
          this.props.performLogout();
          break;

        default:
          break;
      }
    }
  }

  componentDidMount() {

  }

  setMenus() {
    let additionalMenus = this.props.menus
    let menus = new Array();
    for (let i = 0; i < additionalMenus.length; i++) {

      let menu = additionalMenus[i];
      if (this.props.loginStatus != true && menu.authenticated == true)
        continue;

      menus.push(menu);

    }

    console.log("State menus", this.state.menus)
    return menus;

  }

  render() {

    
    let loginComponent = <Login setMenuCode={this.setMenuCode}
      setDetailMode={this.setDetailMode}
      detailMode={this.state.detailMode}
      doLogin={this.props.performLogin}
      loginFailed={this.props.loginFailed}
      loginAttempt={this.props.loginAttempt}
    />;

    if (this.props.loginStatus == true) {
      loginComponent = <Dashboard setMenuCode={this.setMenuCode} />
    }

    let menus = this.setMenus();

    return (
      <div className="App">
        <Header title="Universal Good Shop" /> 
        <table className="main-layout">
          <tbody>
            <tr valign="top">
              <td className="td-menu">
                <Menu loggedUser={this.props.loggedUser} handleMenuCLick={this.handleMenuCLick} activeCode={this.state.menuCode} menus={menus} />
              </td>
              <td>
                <div>
                  <Switch>
                    <Route exact path="/" render={
                      (renderProps) =>
                        <Home setMenuCode={this.setMenuCode} content="hello, this is default page" />
                    } />
                    <Route exact path="/home" render={
                      (renderProps) =>
                        <Home setMenuCode={this.setMenuCode} content="hello, this is home page" />
                    } />
                    <Route exact path="/suppliers" render={
                      (renderProps) =>
                        <SupplierList setMenuCode={this.setMenuCode}  />
                    } />
                    <Route exact path="/about" render={
                      (renderProps) =>
                        <About setMenuCode={this.setMenuCode} />
                    }></Route>
                    <Route exact path="/catalog" render={
                      (renderProps) =>
                        <Catalog setMenuCode={this.setMenuCode} setDetailMode={this.setDetailMode} detailMode={this.state.detailMode} />

                    }></Route>
                    <Route exact path="/login" render={
                      (renderProps) => loginComponent

                    }></Route>

                    {/*
                     =============================
                     ======== need login =========
                     =============================
                     */}
                    <Route exact path="/dashboard" render={
                      (renderProps) =>
                        <Dashboard setMenuCode={this.setMenuCode} />

                    }></Route>

                  </Switch>
                </div>

              </td>
            </tr>
          </tbody>


        </table>
      </div>
    )
  }

}
const mapStateToProps = state => {
  //console.log(state);
  return {
    entities: state.shopState.entities,

    //user
    loginStatus: state.userState.loginStatus,
    loginKey: state.userState.loginStatus,
    loginFailed: state.userState.loginFailed,
    menus: state.userState.menus,
    loggedUser: state.userState.loggedUser,
    loginAttempt: state.userState.loginAttempt
  }
}

const mapDispatchToProps = dispatch => ({
  performLogin: (username, password) => dispatch(actions.performLogin(username, password)),
  performLogout: () => dispatch(actions.performLogout())
  // getProductCatalog: (page) => dispatch(actions.getProductList(page))

})
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App))
