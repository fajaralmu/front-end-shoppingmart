import React, { Component } from 'react'

class Card extends Component {
    constructor(props) {
        super(props);
        this.onClick = () => {
            if (this.props.onClick) {
                this.props.onClick();
            }
        }
    }

    render() { 

        let className;
        if (this.props.className) {
            className = "card " + this.props.className;
        } else {
            className = "card";
        }

        let titleComponent;
        if (this.props.icon) {
            titleComponent = <img src={this.props.icon} height="200" className="card-img-top" />
        } else {
            titleComponent = <div className="card-header">
                {this.props.title}
            </div>
        }

        return (
            <div onClick={this.onClick} style={{ ...this.props.style, marginRight: '5px' }} className={className}>
                {titleComponent}
                <div className="card-body">
                    {this.props.icon? <div className="card-title">{this.props.title}</div>:null}
                    {this.props.content}
                </div>
            </div>
        )
    }
}

export default Card;