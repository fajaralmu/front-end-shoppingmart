import React, { Component } from 'react'
import '../css/Common.css'
import '../css/Input.css'

class ActionButtons extends Component {
    constructor(props) { super(props) }

    render() {
        return (
            <div className="action-button-wrapper"  >
                {this.props.buttonsData.map(buttonData => {
                    return(
                        <button className="action-button rounded" id={buttonData.id} onClick={buttonData.onClick}>{buttonData.text}</button>
                    )
                })}
            </div>);
    }
}

export default ActionButtons;