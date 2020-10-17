
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Menu from './components/navigation/Menu'
import Home from './components/pages/index/Home'
import About from './components/pages/about/About'

import { Route, Switch, withRouter, Redirect  } from 'react-router-dom'
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
import BaseTransactionPage from './components/pages/transaction/BaseTransactionPage';
import TransactionReceiptv2 from './components/pages/transaction/TransactionReceiptv2';

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
      mainAppUpdated: new Date(),
      hideSidebar: true
    };

    this.loadings = 0;

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
    }

    this.setEnableShopping = (val) => {
      this.setState({ enableShopping: val })
    }

    this.logout = () => {
      const app = this;
      this.confirmDialog("Are you sure to logout?",
        function (e) {
          app.props.performLogout(app);
        }, blankFunc);
    }

    this.handleMenuCLick = (menu) => {

      switch (menu.code) {

        case menus.LOGOUT:
          this.logout();
          break;
        default:
          break;
      }

    }

    this.requestAppId = () => {
      this.props.requestAppId(this);
    }

    this.incrementLoadings = function () {
      this.loadings++;
    }

    this.decrementLoadings = function () {
      this.loadings--;
      if (this.loadings < 0) {
        this.loadings = 0;
      }
    }

    this.startLoading = (realtime) => {
      this.incrementLoadings();
      this.setState({ loading: true, realtime: realtime });
    }

    this.endLoading = () => {
      this.decrementLoadings();
      if (this.loadings == 0) {
        this.setState({ loading: false, loadingPercentage: 0 });
      }

    }

    this.handleMessage = (msg) => {
      let percentage = Math.floor(msg.percentage);
      if (msg.percentage < 0 || msg.percentage > 100) {
        this.endLoading();
      }
      this.setState({ loadingPercentage: percentage });
    }

    this.routedContent = () => {
      return (<>
        <Switch>
          <Route  path="/suppliers" render={
            (props) =>
              <SupplierList app={this} setMenuCode={this.setMenuCode} />
          } />
          <Route exact path={ "/" } render={
            (props) =>
              <Home app={this} applicationProfile={this.props.applicationProfile} setMenuCode={this.setMenuCode} />
          }  />
           <Route exact path={ "/home" } render={
            (props) =>
              <Home app={this} applicationProfile={this.props.applicationProfile} setMenuCode={this.setMenuCode} />
          }  />
          <Route  path="/chatroom" render={
            (props) =>
              <ChatRoom app={this} setMenuCode={this.setMenuCode} />
          } />
          <Route  path="/about" render={
            (props) =>
              <About app={this} applicationProfile={this.props.applicationProfile} setMenuCode={this.setMenuCode} />
          }/>
          <Route  path="/catalog" render={
            (props) =>
              <Catalog
                app={this}
                enableShopping={this.state.enableShopping}
                setMenuCode={this.setMenuCode}
                setDetailMode={this.setDetailMode} detailMode={this.state.detailMode} />

          }/>
          <Route  path="/cart" render={
            (props) => <CartDetail enableShopping={this.state.enableShopping} app={this} setMenuCode={this.setMenuCode} />

          }/>
          <Route  path="/login" render={
            (props) => <Login setMenuCode={this.setMenuCode} app={this} />
          }/>
          {/* ///////////authenticated//////////// */}
          <Route  path="/dashboard" render={
            (props) =>
              <Dashboard app={this}  setMenuCode={this.setMenuCode} />
            }/>
          <Route  path="/management" render={
            (props) =>
              <Management app={this} setMenuCode={(this.setMenuCode)} />
            }/>
          <Route exact path="/transaction/" render={()=>{ return <Redirect to="/home" />}} />
          <Route exact path="/transaction-receipt/" render={()=>{ return <Redirect to="/home" />}} />
          <Route exact path="/transaction/:type" render={(props)=>{
             return <BaseTransactionPage app={this} setMenuCode={(this.setMenuCode)} />
          }}  />
          <Route exact path="/transaction-receipt/:transactionCode" render={(props)=>{
             return <TransactionReceiptv2 app={this}  />
          }}  />
        </Switch>

      </>);
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

  }

  componentDidUpdate() {
    if (this.props.requestId != this.state.requestId) {
      this.setState({ requestId: this.props.requestId });
      this.props.refreshLogin();

    }

    if (this.props.applicationProfile) {
      updateFavicon(this.props.applicationProfile);
    }
  }
  

  componentDidMount() {
    this.requestAppId();
    this.setState({ loadingPercentage: 0 });
  }

  setMenus() {
    const additionalMenus = this.props.menus ? this.props.menus : [];
    const menus = new Array();
    for (let i = 0; i < additionalMenus.length; i++) {

      const menu = additionalMenus[i];
      const isNotAuthenticated = this.props.loginStatus != true && menu.authenticated == true;
      const isShoppingDisabled = !this.state.enableShopping && menu.code == 'cart';

      if (isNotAuthenticated) { continue; } 
      if (isShoppingDisabled) { continue; }

      menus.push(menu);
    }

    return menus;

  }

  render() {

    if (!this.state.requestId) {
      return (<Loader realtime={false} text="Please wait..." type="loading" />)
    }

    const menus = this.setMenus(); 
    const usedHost = url.contextPath();
    const applicationProfile = this.props.applicationProfile;
    const isHideSidebar = this.state.hideSidebar == true;
    const contentClass = isHideSidebar ? 'col-12' : 'col-10'; 

    return (
      <div className="App">
        <Loading realtime={this.state.realtime} loading={this.state.loading} loadingPercentage={this.state.loadingPercentage} />
        <AlertComponent showInfo={this.state.showInfo} alertData={this.alertCallback} hideInfo={() => this.setState({ showInfo: false })} />
        <CartInfo mainAppUpdated={this.state.mainAppUpdated} enableShopping={this.state.enableShopping} />

        <Header showOptionButton={isHideSidebar} hideMenu={() => { this.setState({ hideSidebar: true }) }} showMenu={() => { this.setState({ hideSidebar: false }) }} applicationProfile={applicationProfile} />
        
        <div className="row" id="main-layout">
          {isHideSidebar ? null :
            <div id="main-menu" className={'col-2'} style={{ backgroundColor: applicationProfile.color }}>
              <button style={{ float: "right", margin: '5px', color: applicationProfile.fontColor }} className="btn" onClick={() => {
                this.setState({ hideSidebar: true })
              }} ><i className='fa fa-angle-double-left'></i></button>
              
              <Menu alertDialog={this.alertDialog}
                handleMenuCLick={this.handleMenuCLick}
                activeCode={this.state.menuCode}
                menus={menus} />
            </div>}

          <div id="main-content" className={contentClass}><this.routedContent /></div>
        </div>

        <SockJsClient url={usedHost + 'realtime-app'} topics={['/wsResp/progress/' + localStorage.getItem("requestId")]}
          onMessage={(msg) => { this.handleMessage(msg) }}
          ref={(client) => { this.clientRef = client }} />
        <Footer applicationProfile={this.props.applicationProfile} />
        
      </div>
    )
  }

}

function AlertComponent(props) {
  if (props.showInfo) {
    const alertData = props.alertData;
    return <Alert
      title={alertData.title}
      message={alertData.message}
      onOk={(e) => {
        if (alertData.onOk) { alertData.onOk(e); }
        props.hideInfo();
      }}
      yesOnly={alertData.yesOnly}
      onNo={(e) => {
        if (alertData.onNo) { alertData.onNo(e); }
        props.hideInfo();
      }}
      onClose={(e) => {
        props.hideInfo();
      }}
    />
  }
  return null;
}

function Loading(props) {
  if (props.loading == true) {
    return (
      <Loader realtime={props.realtime} progress={props.loadingPercentage} text="Please wait..." type="loading" />
    );
  }
  return null;
}

function updateFavicon(profile) {
  if(profile.pageIcon){
    let link = document.querySelector('link[rel="shortcut icon"]') ||
      document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.id = 'favicon';
      link.rel = 'shortcut icon';
      document.head.appendChild(link);
    }

    link.href = url.baseImageUrl + '/ICON/' + profile.pageIcon;
  }
}

const mapStateToProps = state => {
  //console.log(state);
  return {
    //
    entities: state.shopState.entities,

    //user
    loginStatus: state.userState.loginStatus,
    menus: state.userState.menus,
    requestId: state.userState.requestId,
    applicationProfile: state.userState.applicationProfile,

    //
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
