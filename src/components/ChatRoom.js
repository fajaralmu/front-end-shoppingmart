import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../redux/actionCreators'
import { _byId } from '../utils/ComponentUtil'
import InputField from './InputField';
import ActionButton from './ActionButton';
import SockJsClient from 'react-stomp'; 
import ChatList from './CharList';

class ChatRoom extends Component {
    constructor(props) {
        super(props);
        this.state = { messages: null , username:null, activeId:null}
        this.sendChatMessage = () => {
            this.props.sendChatMessage(_byId("input-msg").value, this.state.username, this.props.app);
            _byId("input-msg").value = "";
        }

        this.handleMessage = (response) => {
            console.log("Responses handleMessage: ", response.code);
            console.log("LOCAL STORAGE:",localStorage.getItem("requestId"))
            if (response.code != localStorage.getItem("requestId")) {
                return;
            }
            this.props.storeChatMessageLocally(response.entities);
            // this.setState({ messages: response.entities });
        }

        this.changeUsername = (value,id)=>{
            this.setState({username:value, activeId:id});
        }

    }

    componentWillMount() {
        this.props.setMenuCode('chatroom');
        document.title = "Chat Room";
        this.props.getMessages(this.props.app);
    }

    componentDidUpdate(){
        if(this.state.activeId && _byId(this.state.activeId)){
            _byId(this.state.activeId).focus();
        }
    }

    render() {
        return (
            <div style={{textAlign:'left'}} id="chat-room">
                <h2>Please Give Us Any Feedback!</h2>
                <InputField onKeyUp={this.changeUsername} id="input-username" placeholder="identify your name" />
                <div className="chat-container"  >
                    <ChatList username={this.state.username} messages={this.props.messages} />
                </div>
                <InputField style={{ width: '50%' }} value={this.state.username} placeholder="input message" id="input-msg" />
                <ActionButton onClick={this.sendChatMessage} text="send" /> 

                <SockJsClient url='http://localhost:8080/universal-good-shop/shop-app' topics={['/wsResp/messages']}
                    onMessage={(msg) => { this.handleMessage(msg) }}
                    ref={(client) => { this.clientRef = client }} />
            </div>
        )
    }
}

const mapStateToProps = state => {
    //console.log(state);
    return {
        messages: state.shopState.messages,
    }
}

const mapDispatchToProps = dispatch => ({
    sendChatMessage: (message, username, app) => dispatch(actions.sendChatMessage(message, username, app)),
    storeChatMessageLocally: (messages) => dispatch(actions.storeMessageLocally(messages)),
    getMessages : (app)=> dispatch(actions.getMessageList(app))

})
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatRoom)