import React, { Component } from 'react'
import '../css/Common.css'
import '../css/Input.css'

class ActionButton extends Component {
    constructor(props) {
        super(props);

        this.onClick = () => {
            if(this.props.onClick){
                this.props.onClick();
            }
        }
    }

    render() {
        let className = "action-button rounded";
        if(this.props.status!= null ){
            className=className.concat(" ").concat(this.props.status);
        }
        return (
            <div >
                <button style={{...this.props.style}} className={className} id={this.props.id} onClick={this.onClick}>{this.props.text}</button>
            </div>
        )
    }

}

export default ActionButton;