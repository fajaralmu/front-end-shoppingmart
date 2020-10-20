import React, { Component } from 'react'
import './ChatRoom.css'
import { connect } from 'react-redux'
import * as actions from '../../../redux/actionCreators'
import { byId } from '../../../utils/ComponentUtil'
import InputField from '../../inputs/InputField';
import ActionButton from '../../buttons/ActionButton';
import SockJsClient from 'react-stomp'; 
import ContentTitle from '../../container/ContentTitle'; 
import ChatList from './ChatList';
import { contextPath } from './../../../constant/Url';
import BaseComponent from './../../BaseComponent';
import MessageService from './../../../services/MessageService';

class ChatRoom extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = { messages: null, username: null, activeId: null }
        this.messageService = MessageService.instance;
        
        this.sendChatMessage = () => {
            if (!byId("input-msg").value || byId("input-msg").value.toString().trim() == "") {
                this.parentApp.infoDialog("Message must not be null");
                return;
            }
           
            const request = {
                message:byId("input-msg").value,
                username:this.state.username
            }
            byId("input-msg").value = "";
            this.commonAjax(this.messageService.sendChatMessage, request, this.handleMessage);
            
        }

        this.handleMessage = (response) => {
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
        if (this.state.activeId && byId(this.state.activeId)) {
            byId(this.state.activeId).focus();
        }
    }

    render() {
        let userAlias = this.props.userAlias ? this.props.userAlias : "";
        const usedHost = contextPath();
        
        return (
            <div className="section-container">
                <ContentTitle title="Chat With Us!" description=
                    {"Identified as [" + this.state.username + "]"}  iconClass="fas fa-comments"/>
                <InputField
                    value={userAlias}
                    onKeyUp={this.changeUsername}
                    id="input-username"
                    placeholder="identify your name" />
                <div style={{ textAlign: 'left' }} id="chat-room">
                    <div className="chat-container"  >
                        <ChatList username={this.state.username} messages={this.props.messages} />
                    </div>
                </div>
                <MessageField sendChatMessage={this.sendChatMessage} />
                 
                <SockJsClient url={usedHost+'realtime-app'} topics={['/wsResp/messages']}
                        onMessage={(msg) => { this.handleMessage(msg) }}
                        ref={(client) => { this.clientRef = client }} />
            </div>
        )
    }
}

const MessageField = (props) => {
    return (
        <div className="row">
            <div className="col-9">
                <textarea style={{width:'100%'}} rows="3" id="input-msg" className="form-control" /> 
            </div>
            <div className="col-3">
                <ActionButton style={{ margin: '5px' }} status="success" onClick={props.sendChatMessage} 
                text={<div><i className="fas fa-paper-plane"></i>&nbsp;Send Message</div>} />
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    //console.log(state);
    return {
        messages: state.shopState.messages,
        userAlias: state.shopState.userAlias
    }
}

const mapDispatchToProps = dispatch => ({
    
    storeChatMessageLocally: (messages) => dispatch(actions.storeMessageLocally(messages)),
    getMessages: (app) => dispatch(actions.getMessageList(app))

})
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatRoom)