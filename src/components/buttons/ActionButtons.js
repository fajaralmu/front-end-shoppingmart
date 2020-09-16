import React, { Component } from 'react' 
import * as stringUtil from '../../utils/StringUtil'

class ActionButtons extends Component {
    constructor(props) { super(props) }

    render() {
        let className = "action-button-wrapper";
        if(this.props.className){
            className += " "+this.props.className;
        }
        return (
            <div style={this.props.style ? this.props.style : {}} className={"btn-group "+className} role="group"  >
                {this.props.buttonsData.map(buttonData => {
                    let className = "btn btn-outline-secondary btn-sm";
                    if (buttonData.status != null) {
                        className =
                            "btn btn".concat("-").concat(buttonData.status).concat(" ").concat(buttonData.className);
                    }
                    return (
                        <button style={{...buttonData.style}} className={className} key={"btnKey-" + stringUtil.uniqueId()} onClick={buttonData.onClick}>{buttonData.text}</button>
                    )
                })}
            </div>);
    }
}

export default ActionButtons;