import React, { Component } from 'react'
import '../css/Common.css'
import '../css/Card.css'


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
        let titleStyle = {height:'auto'}
        if (this.props.icon) {
            titleStyle = {
                backgroundRepeat: 'no-repeat',
                backgroundColor: 'white',
                backgroundImage: "url(" + this.props.icon + ")",
                backgroundSize: '200px 110px',
                borderBottom: 'solid 0.1px gray'
            }
        }

        let className= "card rounded box-shadow";
        if(this.props.className){
            className+=" "+this.props.className;
        }

        return (
            <div onClick={this.onClick} style={this.props.style} className={className}>
                <div className="card-title rounded-top" style={titleStyle}>
                    {this.props.title}
                </div>
                <div className="card-content">
                    {this.props.content}
                </div>
            </div>
        )
    }
}

export default Card;