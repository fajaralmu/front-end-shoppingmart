import React, { Component } from 'react'
import * as stringUtil from '../../utils/StringUtil' 
import ActionButtons from './../buttons/ActionButtons';

class NavButtons extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let buttonsData = [];
        if (this.props.buttonsData) {
            buttonsData = this.props.buttonsData;
        }
        for (let i = 0; i < buttonsData.length; i++) {
            const buttonData = buttonsData[i];
            buttonsData[i].onClick = buttonData.buttonClick;
            buttonsData[i].key = stringUtil.uniqueId() + "_nav";

            if(buttonData.active){
                buttonsData[i].style = {backgroundColor:'lightsteelblue'}
            }
        } 
        return (
            <ActionButtons buttonsData={buttonsData} />
        )
    }
}

export default NavButtons;