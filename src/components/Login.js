import React, { Component } from 'react'
import '../css/Common.css'
import * as menus from '../constant/Menus'
import InputField from './InputField';
import ActionButton from './ActionButton'
import Label from './Label';
import  Message from './Message'

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: null,
            password: null
        }
        this.handleUsername = (value) => {
            this.setState({ username: value });
        }
        this.handlePassword = (value) => {
            this.setState({ password: value });
        }

        this.doLogin = () => {
            console.log("u:", this.state.username, ",p:", this.state.password);
             this.props.doLogin(this.state.username, this.state.password);
        }
    }

    componentDidMount() {
        this.props.setMenuCode(menus.LOGIN);
    }

    render() {

        let message = <p>
            {this.props.loginFailed ?  <Message type="failed" text="Login Failed" />:""}
        </p>

        return (
            <div className="section-container">
                <h2>Login Page</h2>
               
                {message} 
                <Label text="Username" />
                <InputField id="username-field" onKeyUp={this.handleUsername} />
                <Label text="Password" />
                <InputField id="password-field" type="password" onKeyUp={this.handlePassword} />
                <ActionButton id="btn-login" onClick={this.doLogin} text="Login" />
            </div>
        )
    }
}


export default Login;