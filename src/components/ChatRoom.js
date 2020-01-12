import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../redux/actionCreators'
import { _byId } from '../utils/ComponentUtil'
import InputField from './InputField';
import ActionButton from './ActionButton';
import SockJsClient from 'react-stomp';
import InstantTable from './InstantTable';
import ChatList from './CharList';

class ChatRoom extends Component {
    constructor(props) {
        super(props);
        this.state = { messages: null }
        this.sendChatMessage = () => {
            this.props.sendChatMessage(_byId("input-msg").value, this.props.app);
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

    }

    componentWillMount() {
        this.props.setMenuCode('chatroom');
        document.title = "Chat Room";
    }

    render() {
        return (
            <div style={{textAlign:'left'}} id="chat-room">
                <h3>Please Give Us Any Feedback!</h3>
                <div style={{ maxHeight: '600px', overflow: 'scroll', width: '80%' }} >
                    <ChatList messages={this.props.messages} />
                </div>
                <InputField style={{ width: '80%' }} placeholder="input message" id="input-msg" />
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
    sendChatMessage: (message, app) => dispatch(actions.sendChatMessage(message, app)),
    storeChatMessageLocally: (messages) => dispatch(actions.storeMessageLocally(messages))

})
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatRoom)