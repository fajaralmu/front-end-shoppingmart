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
            password: null,
            showMessageLoginFailed:false
        }
        this.handleUsername = (value) => {
            this.setState({ username: value });
        }
        this.handlePassword = (value) => {
            this.setState({ password: value });
        }

        this.doLogin = () => {
            console.log("u:", this.state.username, ",p:", this.state.password);
            this.props.doLogin(document.getElementById("username-field").value, 
            document.getElementById("password-field").value);
        }

        this.endMessage = () => {
            this.setState({showMessageLoginFailed:false})
        }
    }

    componentDidMount() {
        this.props.setMenuCode(menus.LOGIN);
        document.title = "Login";
    }

    componentDidUpdate(){
        // if(this.props.loginAttempt == false && this.state.showMessageLoginFailed == false){
        //     this.setState({showMessageLoginFailed:true})
        // }
    }

    render() {
      
        let message = <p>
            {this.props.loginFailed  ?  <Message endMessage={this.endMessage} type="failed" text="Login Failed" />:""}
        </p>

        return (
            <div className="section-container">
                <h2>Login Page</h2>
               
                {message} 
                <Label text="Username" />
                <InputField id="username-field" onKeyUp={this.handleUsername} />
                <Label text="Password" />
                <InputField id="password-field" type="password" onKeyUp={this.handlePassword} />
                <ActionButton id="btn-login" status="submit" onClick={this.doLogin} text="Login" />
            </div>
        )
    }
}


export default Login;