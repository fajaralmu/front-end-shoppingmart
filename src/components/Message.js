import React, {Component} from 'react'
import '../css/Common.css'

class Message extends Component{
    constructor(props){
        super(props);
    }

    render(){
        let className = "message message-"+this.props.type;
        return(
            <div className={className} >{this.props.text}</div>
        )
    }

}

export default Message;