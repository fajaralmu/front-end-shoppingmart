import React, { Component } from 'react'
import '../css/Common.css'
import '../css/Input.css'
import '../css/Button.css'
import * as stringUtil from '../utils/StringUtil'

class ActionButtons extends Component {
    constructor(props) { super(props) }

    render() {
        return (
            <div className="action-button-wrapper"  >
                {this.props.buttonsData.map(buttonData => {
                     let className = "action-button rounded";
                     if(buttonData.status!= null ){
                         className=className.concat(" ").concat(buttonData.status).concat(" ").concat(buttonData.className);
                     }
                    return(
                        <button className={className} key={"btnKey-"+stringUtil.uniqueId()} onClick={buttonData.onClick}>{buttonData.text}</button>
                    )
                })}
            </div>);
    }
}

export default ActionButtons;