import React, { Component } from 'react'
import * as actions from '../../../redux/actionCreators'
import { connect } from 'react-redux'
import * as menus from '../../../constant/Menus'
import { withRouter } from 'react-router';
import ContentTitle from '../../container/ContentTitle';
import Label from '../../container/Label';
import ActionButton from '../../buttons/ActionButton';
import Message from '../../messages/Message';
import '../login/Login.css'
import InputField from '../../inputs/InputField';
import { byId } from '../../../utils/ComponentUtil'
class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: null,
            password: null,
            showMessageLoginFailed: false
        }

        this.handleUsername = (value) => {
            this.setState({ username: value });
        }
        this.handlePassword = (value) => {
            this.setState({ password: value });
        }

        this.onSubmitLoginForm = (e) => {
            e.preventDefault();
            this.doLogin();
        }

        this.doLogin = () => {

            console.log("u:", this.state.username, ",p:", this.state.password);
            this.props.performLogin(
                byId("username-field").value,
                byId("password-field").value,
                this.props.app);
        }

        this.endMessage = () => {
            this.setState({ showMessageLoginFailed: false })
        }

        this.getLoggedUser = () => {
            this.props.getLoggedUser(this.props.app);
        }

        this.validateLoginStatus = () => {
            if (this.props.loginStatus == true) {
                console.info("Login success! Redirect to dashboard");
                this.getLoggedUser();
                this.props.history.push("/dashboard");
            }
        }

        this.message = () => {
            let message = <p>
                {this.props.loginFailed ? <Message endMessage={this.endMessage} status="danger" text="Login Failed" /> : ""}
            </p>
            return message;
        }
    }


    componentDidMount() {
        this.validateLoginStatus();
        this.props.setMenuCode(menus.LOGIN);
        document.title = "Login";

    }

    componentDidUpdate() {
        this.validateLoginStatus();
        // if(this.props.loginAttempt == false && this.state.showMessageLoginFailed == false){
        //     this.setState({showMessageLoginFailed:true})
        // }
    }



    render() {

        return (
            <div className="section-container">
                < ContentTitle title="Login Page" iconClass="fas fa-sign-in-alt" />
                <this.message />
                <form onSubmit={this.onSubmitLoginForm}>
                <div className="login-container card">
                    <div className="card-header">Login</div>
                    <div className="card-body">
                        <Label text="Username" />
                        <InputField id="username-field" onKeyUp={this.handleUsername} />
                        <Label text="Password" />
                        <InputField id="password-field" type="password" onKeyUp={this.handlePassword} />
                        
                    </div>
                    <div className="card-footer">
                    <InputField type="submit" value="Login" />

                    </div>
                </div>
                </form>
            </div>
        )
    }
}
const mapStateToProps = state => {
    //console.log(state);
    return { 
  
      //user
      loginStatus: state.userState.loginStatus, 
      loginFailed: state.userState.loginFailed, 
      loggedUser: state.userState.loggedUser,
      loginAttempt: state.userState.loginAttempt,   
    }
  }
const mapDispatchToProps = dispatch => ({
    performLogin: (username, password, app) => dispatch(actions.performLogin(username, password, app)),  
    getLoggedUser: (app) => dispatch(actions.getLoggedUser(app))
  })
export default withRouter(connect( 
    mapStateToProps,
    mapDispatchToProps
  )(Login))