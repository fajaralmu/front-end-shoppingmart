import React, { Component } from 'react'
import Label from '../../container/Label';

class ChatList extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let chats = this.props.messages ? this.props.messages : [];
        let chatRows = [];
        for (let i = 0; i < chats.length; i++) {
            const chat = chats[i];
            chatRows.push(<ChatItem message={chat} username={this.props.username} />)
        }
        return (<div className="row">
            {chatRows.map(chatItem => chatItem)}
        </div>)
    }
}

const ChatItem = props => {
    const isAdmin = props.message.admin == 1;
    const className = "chat-item rounded paper-shadow  " + (props.message.admin == 1 ? " admin " : "user");
    let username = "";
    if (props.username) { username = " [" + props.username + "]"; }
    const sender = props.message.admin == 1 ? "Admin" : "You" + username;
    const senderComponent = <p>{sender}<span>&nbsp;{props.message.date}</span></p>
    const chatBody = <div className="col-10"><div className={className}>
                        <Label style={{ fontSize: '0.8em', color: 'black' }} text={senderComponent} />
                        <Label text={props.message.text} />
                    </div></div>;
    return  isAdmin ?
                <>{chatBody}<div className="col-2"/></> :
                <><div className="col-2"/>{chatBody} </>
             
     
}

export default ChatList;