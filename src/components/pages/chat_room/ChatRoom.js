import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../../redux/actionCreators'
import { _byId } from '../../../utils/ComponentUtil'
import InputField from '../../inputs/InputField';
import ActionButton from '../../buttons/ActionButton';
import SockJsClient from 'react-stomp'; 
import ContentTitle from '../../container/ContentTitle'; 
import GridComponent from '../../container/GridComponent'
import ChatList from './CharList';

class ChatRoom extends Component {
    constructor(props) {
        super(props);
        this.state = { messages: null, username: null, activeId: null }
        this.sendChatMessage = () => {
            if (!_byId("input-msg").value) {
                alert("Message must not be null");
                return;
            }
            this.props.sendChatMessage(_byId("input-msg").value, this.state.username, this.props.app);
            _byId("input-msg").value = "";
        }

        this.handleMessage = (response) => {
            console.log("Responses handleMessage: ", response.code);
            console.log("LOCAL STORAGE:", localStorage.getItem("requestId"))
            if (response.code != localStorage.getItem("requestId")) {
                return;
            }
            this.props.storeChatMessageLocally(response.entities);
            // this.setState({ messages: response.entities });
        }

        this.changeUsername = (value, id) => {
            this.setState({ username: value, activeId: id });
        }

    }

    componentWillMount() {
        this.props.setMenuCode('chatroom');
        document.title = "Chat Room";
        this.props.getMessages(this.props.app);
        if (this.props.userAlias) {
            this.setState({ username: this.props.userAlias })
        }
    }

    componentDidUpdate() {
        if (this.state.activeId && _byId(this.state.activeId)) {
            _byId(this.state.activeId).focus();
        }
    }

    render() {
        let userAlias = this.props.userAlias ? this.props.userAlias : "";
        let cloudHost = "https://nuswantoroshop.herokuapp.com/";
        let localHost = "http://localhost:8080/universal-good-shop/";
        const usedHost = localHost;
        return (
            <div className="section-container">
                <ContentTitle title="What Do You Feel?" description=
                    {"Identified as [" + this.state.username + "]"} />
                <InputField
                    value={userAlias}
                    onKeyUp={this.changeUsername}
                    id="input-username"
                    placeholder="identify your name" />
                <div style={{ textAlign: 'left' }} id="chat-room">

                    <div className="chat-container"  >
                        <ChatList username={this.state.username} messages={this.props.messages} />
                    </div>

                    <GridComponent style={{ width: '50%', textAlign: 'right' }} items={[
                        <InputField style={{ width: '130%' }} type="textarea" placeholder="input message" id="input-msg" />,
                        <ActionButton style={{ margin: '5px' }} status="success" onClick={this.sendChatMessage} text="send" />

                    ]} />

                    <SockJsClient url={usedHost+'realtime-app'} topics={['/wsResp/messages']}
                        onMessage={(msg) => { this.handleMessage(msg) }}
                        ref={(client) => { this.clientRef = client }} />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    //console.log(state);
    return {
        messages: state.shopState.messages,
        userAlias: state.shopState.userAlias
    }
}

const mapDispatchToProps = dispatch => ({
    sendChatMessage: (message, username, app) => dispatch(actions.sendChatMessage(message, username, app)),
    storeChatMessageLocally: (messages) => dispatch(actions.storeMessageLocally(messages)),
    getMessages: (app) => dispatch(actions.getMessageList(app))

})
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatRoom)