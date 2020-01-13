import React, { Component } from 'react'
import InstantTable from './InstantTable';
import Label from './Label';
import '../css/Chat.css'

class ChatList extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let chats = this.props.messages ? this.props.messages : [];
        let chatRows = [];
        for (let i = 0; i < chats.length; i++) {
            const chat = chats[i];
            chatRows.push({
                values: [
                    <ChatItem message={chat} username={this.props.username} />
                ]
            })
        }
        return (
            <InstantTable rows={chatRows} />)
    }
}

const ChatItem = props => {
    let className = "chat-item rounded " + (props.message.admin == 1 ? " admin " : "user");
    let username = "";
    if(props.username){
        username= " ["+props.username+"]";
    }
    let sender = props.message.admin == 1 ? "Admin" : "You"+username;
    let senderComponent = <span>
        {sender}<span style={{ marginLeft:'11px',fontSize: '0.7em' , float:'right'}} >     {props.message.date}</span>
    </span>
    return (
        <div className={className}>
            <Label style={{ fontSize: '0.8em', color: 'black' }} text={senderComponent} />
            <Label text={props.message.text} />
        </div>
    )
}

export default ChatList;