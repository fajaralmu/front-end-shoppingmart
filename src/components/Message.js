import React, {Component} from 'react'
import '../css/Common.css'
import '../css/Message.css'

class Message extends Component{
    constructor(props){
        super(props);
        this.state = {
            timer:130,
            intervalId:0
        }
        this.update = () => {
            if(this.state.timer < 0 ){
                clearInterval(this.state.intervalId);
            }
            console.log("tick")
            this.setState({timer: this.state.timer-1})
            if(this.state.timer < 0 && this.props.endMessage){
                this.props.endMessage();
            }
        }
    }

    componentDidMount(){
        if(this.props.withTimer == true){
            let intervalId =setInterval(this.update, 1,null);
            this.setState({ intervalId:intervalId})
        }
    }

    render(){
        let className = "message message-"+this.props.type;
        return(
            <div className={className} >{this.props.text}</div>
        )
    }

}

export default Message;