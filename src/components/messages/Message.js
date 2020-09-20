import React, { Component } from 'react'

class Message extends Component {

    render() {
        const status = this.props.status ? this.props.status : "secondary";

        return (
            <div className={"alert alert-" + status} role="alert">
                {this.props.text}
            </div>
        )
    }
}

export default Message;