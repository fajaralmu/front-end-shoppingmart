import React, { Component } from 'react'
import './Loader.css'

class Loader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timer: 130,
            intervalId: 0
        }
        this.update = () => {
            if (this.state.timer < 0) {
                clearInterval(this.state.intervalId);
            }
            console.log("tick")
            this.setState({ timer: this.state.timer - 1 })
            if (this.state.timer < 0 && this.props.endMessage) {
                this.props.endMessage();
            }
        }
    }

    componentDidMount() {
        if (this.props.withTimer == true) {
            let intervalId = setInterval(this.update, 1, null);
            this.setState({ intervalId: intervalId });
        }
    }

    render() {
        let className = "message message-" + this.props.type;
        let messageText = this.props.text;

        let msgStyle = {};
        if (this.props.realtime == true) {
            let progress = Math.floor(this.props.progress);
            msgStyle = {
                width: progress + "%",
                textAlign: 'left'
            };
            className += " rounded";
            messageText = <span className="loader">{this.props.progress + "%"}</span>
        }
        return (
            <div style={msgStyle} className={className} >
                <button className="btn btn-primary" type="button" disabled>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span className=" ">Loading...</span>
                </button>
            </div>
        )
    }

}

export default Loader;