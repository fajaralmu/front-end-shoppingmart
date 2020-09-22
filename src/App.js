
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Menu from './components/navigation/Menu'
import Home from './components/pages/index/Home'
import About from './components/pages/about/About'
import { BrowserRouter as Router, Route, Link, Switch, withRouter } from 'react-router-dom'
import * as actions from './redux/actionCreators'
import { connect } from 'react-redux'
import Catalog from './components/pages/catalog/Catalog'
import Login from './components/pages/login/Login'
import Dashboard from './components/pages/dashboard/Dashboard';
import * as menus from './constant/Menus'
import SupplierList from './components/pages/supplier_list/SupplierList';
import Loader from './components/messages/Loader';
import Footer from './components/layout/footer/Footer';
import SockJsClient from 'react-stomp';
import ChatRoom from './components/pages/chat_room/ChatRoom';
import CartDetail from './components/cart/CartDetail';
import Management from './components/pages/management/Management';
import Header from './components/layout/header/Header';
import * as url from './constant/Url';
import Alert from './components/messages/Alert';
import CartInfo from './components/cart/CartInfo';

const blankFunc = function (e) { };

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      menus: [],
      detailMode: false,
      menuCode: '',
      loading: false,
      loadingPercentage: 0,
      requestId: null,
      enableShopping: false,
      mainAppUpdated: new Date()
    };

    this.alertCallback = {
      title: "Info",
      message: "Info",
      yesOnly: false,
      onOk: () => { },
      onNo: () => { }
    }

    this.setDetailMode = (detailMode) => {
      this.setState({ detailMode: detailMode });
    }

    this.setMenuCode = (code) => {
      this.setState({ menuCode: code });
    }

    this.refresh = () => {
      this.setState({ mainAppUpdated: new Date() }); 
      console.info("App refresh, logged user=>", this.props.loggedUser);
    }

    this.setEnableShopping = (val) => {
      this.setState({ enableShopping: val })
    }

    this.handleMenuCLick = (menu) => {
      const app = this;
      switch (menu.code) {

        case menus.LOGOUT:
          this.confirmDialog("Are you sure to logout?",
            function (e) {
              app.props.performLogout(app);
            }, blankFunc);

          break;

        default:
          break;
      }

    }

    this.requestAppId = () => {
      this.props.requestAppId(this);
    }

    this.startLoading = (realtime) => {
      this.setState({ loading: true, realtime: realtime });
    }
    this.endLoading = () => {
      this.setState({ loading: false, loadingPercentage: 0 });
    }

    this.handleMessage = (msg) => {
      let percentage = Math.floor(msg.percentage);
      if (msg.percentage < 0 || msg.percentage > 100) {
        this.endLoading();
      }
      this.setState({ loadingPercentage: percentage });
    }

    this.loginComponent = () => {
      return <Login   setMenuCode={this.setMenuCode}
        app={this}
      />;
    }

    this.mainContent = () => {
      return (<div id="main-content" >
        <Switch>
          <Route exact path="/" render={
            (renderProps) =>
              <Home app={this} applicationProfile={this.props.applicationProfile} setMenuCode={this.setMenuCode} />
          } />
          <Route exact path="/home" render={
            (renderProps) =>
              <Home app={this} applicationProfile={this.props.applicationProfile} setMenuCode={this.setMenuCode} />
          } />
          <Route exact path="/suppliers" render={
            (renderProps) =>
              <SupplierList app={this} setMenuCode={this.setMenuCode} />
          } />
          <Route exact path="/chatroom" render={
            (renderProps) =>
              <ChatRoom app={this} setMenuCode={this.setMenuCode} />
          } />
          <Route exact path="/about" render={
            (renderProps) =>
              <About app={this} applicationProfile={this.props.applicationProfile} setMenuCode={this.setMenuCode} />
          }></Route>
          <Route exact path="/catalog" render={
            (renderProps) =>
              <Catalog
                app={this}
                enableShopping={this.state.enableShopping}
                setMenuCode={this.setMenuCode}
                setDetailMode={this.setDetailMode} detailMode={this.state.detailMode} />

          }></Route>
          <Route exact path="/cart" render={
            (renderProps) => <CartDetail enableShopping={this.state.enableShopping} app={this} setMenuCode={this.setMenuCode} />

          }></Route>
          <Route exact path="/login" render={
            (renderProps) => <this.loginComponent />

          }></Route>

          {/*
               =============================
               ======== need login =========
               =============================
               */}
          <Route exact path="/dashboard" render={
            (renderProps) =>
              <Dashboard app={this} loginStatus={this.props.loginStatus} setMenuCode={this.setMenuCode} />

          }></Route>
          <Route exact path="/management" render={
            (renderProps) =>
              <Management app={this} loginStatus={this.props.loginStatus} setMenuCode={this.setMenuCode} />

          }></Route>
        </Switch>

      </div>);
    }

    this.loadingComponent = () => {
      if (this.state.loading == true) {
        return <Loader realtime={this.state.realtime} progress={this.state.loadingPercentage} text="Please wait..." type="loading" />;

      }
      return null;
    }

    this.alertDialog = (message, title, yesOnly, onOk, onNo) => {

      this.alertCallback.yesOnly = yesOnly;
      this.alertCallback.onOk = onOk;
      this.alertCallback.onNo = onNo;
      this.alertCallback.message = message;
      this.alertCallback.title = title;
      this.setState({ showInfo: true })

    }

    this.infoDialog = (message) => {
      this.alertDialog(message, "Info", true, blankFunc, blankFunc);
    }

    this.confirmDialog = (message, onOk, onNo) => {
      this.alertDialog(message, "Confirmation", false, onOk, onNo);
    }

    this.alertComponent = () => {
      if (this.state.showInfo) {
        const alertData = this.alertCallback;
        return <Alert
          title={alertData.title}
          message={alertData.message}
          onOk={(e) => {
            if (alertData.onOk) { alertData.onOk(e); }
            this.setState({ showInfo: false });
          }}
          yesOnly={alertData.yesOnly}
          onNo={(e) => {
            if (alertData.onNo) { alertData.onNo(e); }
            this.setState({ showInfo: false });
          }}
          onClose={(e) => {
            this.setState({ showInfo: false });
          }}
        />
      }
      return <></>
    }
  }

  componentDidUpdate() {
    if (this.props.requestId != this.state.requestId) {
      this.setState({ requestId: this.props.requestId });
      localStorage.setItem("requestId", this.props.requestId);
      this.props.refreshLogin();

    }

    if (this.props.applicationProfile) {
      this.updateIcon(this.props.applicationProfile);
    }
  }

  updateIcon(profile) {
    let link = document.querySelector('link[rel="shortcut icon"]') ||
      document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.id = 'favicon';
      link.rel = 'shortcut icon';
      document.head.appendChild(link);
    }

    link.href = url.baseImageUrl + '/' + profile.iconUrl;
  }

  componentDidMount() {
    this.requestAppId();
    this.setState({ loadingPercentage: 0 });
  }

  setMenus() {
    let additionalMenus = this.props.menus ? this.props.menus : [];
    let menus = new Array();
    for (let i = 0; i < additionalMenus.length; i++) {

      let menu = additionalMenus[i];

      if (!this.state.enableShopping && menu.code == 'cart')
        continue;

      if (this.props.loginStatus != true && menu.authenticated == true)
        continue;

      menus.push(menu);

    }

    return menus;

  }

  render() {

    if (!this.state.requestId) {
      return (<Loader realtime={false} text="Please wait..." type="loading" />)
    }

    const menus = this.setMenus();

    const cloudHost = "https://nuswantoroshop.herokuapp.com/";
    const localHost = "http://localhost:8080/universal-good-shop/";
    const usedHost = localHost;
    const applicationProfile = this.props.applicationProfile ;

    return (
      <div className="App">
        <this.loadingComponent />
        <this.alertComponent />
        <CartInfo mainAppUpdated={this.state.mainAppUpdated} enableShopping={this.state.enableShopping} />
        <Header applicationProfile={applicationProfile} />

        <div id="main-layout">
          <div id="main-menu" style={{ backgroundColor: applicationProfile.color }}>
            <Menu mainAppUpdated={this.state.mainAppUpdated} alertDialog={this.alertDialog}
              handleMenuCLick={this.handleMenuCLick}
              activeCode={this.state.menuCode}
              menus={menus} />
          </div>
          <this.mainContent />
        </div>

        <SockJsClient url={usedHost + 'realtime-app'} topics={['/wsResp/progress/' + localStorage.getItem("requestId")]}
          onMessage={(msg) => { this.handleMessage(msg) }}
          ref={(client) => { this.clientRef = client }} />
        <Footer applicationProfile={this.props.applicationProfile} />

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
    loginKey: state.userState.loginKey, 
    menus: state.userState.menus,
    loggedUser: state.userState.loggedUser,
    loginAttempt: state.userState.loginAttempt,
    requestId: state.userState.requestId,
    applicationProfile: state.userState.applicationProfile,

    cart: state.shopState.cart
  }
}

const mapDispatchToProps = dispatch => ({ 
  performLogout: (app) => dispatch(actions.performLogout(app)),
  requestAppId: (app) => dispatch(actions.requestAppId(app)),
  refreshLogin: () => dispatch(actions.refreshLoginStatus()), 
  // getProductCatalog: (page) => dispatch(actions.getProductList(page))

})
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App))
