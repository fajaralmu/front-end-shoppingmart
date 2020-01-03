
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { connect } from 'react-redux'
import Header from './components/Header'
import Menu from './components/Menu'
import Home from './components/Home'
import { BrowserRouter as Router, Route, Link, Switch , withRouter} from 'react-router-dom'
import * as actions from './redux/actionCreators'
import * as hardCoded from './utils/HardCodedEntites'
import Catalog from './components/Catalog'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      menus: []
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
                <Menu menus={this.state.menus} />
              </td>
              <td> 
                  <div>
                  <Switch>
                  <Route exact  path="/" render={
                        (renderProps) =>
                          <Home content="hello, this is default page" />
                      } />
                    <Route exact  path="/home" render={
                        (renderProps) =>
                          <Home content="hello, this is home page" />
                      } />
                    <Route exact  path="/about" render={
                        (renderProps) =>
                          <Home content="hello, this is about page" />

                      }></Route>
                     <Route exact  path="/catalog" render={
                        (renderProps) =>
                          <Catalog />

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
