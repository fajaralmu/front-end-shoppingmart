import React, { Component } from 'react'
import * as stringUtil from '../utils/StringUtil'
import NavButton from './NavButton';

class NavButtons extends Component {
    constructor(props) {
        super(props);

    }

    render() {

        let buttonsData = [];
        if (this.props.buttonsData) {
            buttonsData = this.props.buttonsData;
        }

        return (
            <div className="nav-button-wrapper">
                {buttonsData.map(
                    buttonData => {
                        return (
                            <NavButton
                                active={buttonData.active}
                                id={buttonData.id} buttonClick={buttonData.buttonClick}
                                key={stringUtil.uniqueId() + "_nav"} text={buttonData.text} />
                        )
                    }
                )}
            </div>
        )
    }
}

export default NavButtons;