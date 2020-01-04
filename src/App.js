
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { connect } from 'react-redux'
import Header from './components/Header'
import Menu from './components/Menu'
import Home from './components/Home'
import About from './components/About'
import { BrowserRouter as Router, Route, Link, Switch , withRouter} from 'react-router-dom'
import * as actions from './redux/actionCreators'
import * as hardCoded from './utils/HardCodedEntites'
import Catalog from './components/Catalog'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      menus: [],
      detailMode:false,
      menuCode:''
    };

    this.setDetailMode=(detailMode)=>{
      this.setState({detailMode:detailMode});
    }

    this.setMenuCode = (code) => {
      console.log(">>>>>> MENU: ",code)
      this.setState({menuCode:code});
    }
  }

  componentDidMount(){
    this.initMenus(); 
  }

  initMenus() {
    let additionalMenus = hardCoded.menus;
    let menus = this.state.menus;
    for (let i = 0; i < additionalMenus.length; i++) {
      menus.push(additionalMenus[i]);

    }
    this.setState({ menus });
    console.log("State menus", this.state.menus)
   
  }

  render() {

    return (
      <div className="App">
        <Header title="Universal Good Shop" />
        <table className="main-layout">
          <tbody>
            <tr valign="top">
              <td>
                <Menu activeCode={this.state.menuCode} menus={this.state.menus} />
              </td>
              <td> 
                  <div>
                  <Switch>
                  <Route exact  path="/" render={
                        (renderProps) =>
                          <Home setMenuCode={this.setMenuCode} content="hello, this is default page" />
                      } />
                    <Route exact  path="/home" render={
                        (renderProps) =>
                          <Home setMenuCode={this.setMenuCode} content="hello, this is home page" />
                      } />
                    <Route exact  path="/about" render={
                        (renderProps) =>
                         <About setMenuCode={this.setMenuCode} />
                      }></Route>
                     <Route exact  path="/catalog" render={
                        (renderProps) =>
                          <Catalog setMenuCode={this.setMenuCode} setDetailMode={this.setDetailMode} detailMode={this.state.detailMode} />

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
      entities: state.shopState.entities
  }
}

const mapDispatchToProps = dispatch => ({
  // getProductCatalog: (page) => dispatch(actions.getProductList(page))
  // getExam: (id) => dispatch(getExamById(id)),
  // oneExam: () => dispatch(fetchOneExam()),
  // addExam: (exam) => dispatch(appNewExam(exam)),
  // deleteExam: (id) => dispatch(deleteExam(id)),
  // login: () => dispatch(login()),
  // logout: () => dispatch(logout())
})
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App))
