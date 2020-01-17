import React, { Component } from 'react'
import '../css/Common.css'
import '../css/Input.css'
import * as stringUtil from '../utils/StringUtil'
import DropdownItem from './DropdownItem';
/**
 * JUST FOR INPUT !!!
 */
class InputDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            focus: true, hover: false, hoverIndex: -1
        }

        this.handleKeyup = () => {
            if (this.props.onKeyUp && this.props.id)
                this.props.onKeyUp(document.getElementById(this.props.id).value, this.props.id);
        }

        this.onBlur = () => {
            console.log("blur");
            this.setState({ focus: false, hover: false })
        }

        this.onSelect = (dataValue, text) => {
            console.log("select value:", dataValue);
            if (this.props.onSelect) { this.props.onSelect(dataValue); }
            if (this.props.id) {
                document.getElementById(this.props.id).value = text;
            }
        }

        this.onHover = (i) => {
            if (this.state.hoverIndex != i)
                this.setState({ hoverIndex: i });
        }

    }

    componentDidMount() {
        if (this.props.value && this.props.id) {
            document.getElementById(this.props.id).value = this.props.value;
        }
    }

    render() {
        let dropdownList = [];
        let dropdownComponent = "";
        if (this.state.focus && this.props.dropdownList && this.props.dropdownList.length > 0) {
            dropdownList = this.props.dropdownList;
            // console.log("RENDERD HOVER:", this.state.hoverIndex);
            dropdownComponent = <div className="dropdown">
                {dropdownList.map(
                    (data, i) => {
                        let className = "dropdown-item";
                        if (this.state.hoverIndex == i) className = "dropdown-item-hovered";
                        return (
                            <div id={stringUtil.uniqueId()} key={"dropdown-xx-" + stringUtil.uniqueId()}
                                onClick={() => this.onSelect(data.value, data.text)}
                                className={className}>
                                <DropdownItem onHover={this.onHover} index={i} text={data.text} />
                            </div>
                        )
                    })}
            </div>
        }

        let placeholder = this.props.placeholder ? this.props.placeholder : "";
        let inputClassName = "rounded";
        return (
            <div onMouseOver={() => this.setState({ focus: true })} onMouseLeave={this.onBlur} className="dropdown-wrapper input-field">
                <input className={inputClassName} onFocus={() => this.setState({ focus: true })} id={this.props.id} type="text" onKeyUp={this.handleKeyup} placeholder={placeholder} />
                {dropdownComponent}
            </div>
        )
    }
}


export default InputDropdown;