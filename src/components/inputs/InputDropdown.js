import React, { Component } from 'react'   
import DropdownItem from './DropdownItem';
import * as stringUtil from '../../utils/StringUtil';
import './Inputs.css'
/**
 * JUST FOR INPUT !!!
 */
class InputDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            focus: true, hover: false, hoverIndex: -1,

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
        
        let placeholder = this.props.placeholder ? this.props.placeholder : "";
        let inputClassName = "form-control"; 
        
        return (
            <div onMouseOver={() => this.setState({ focus: true })}  onMouseLeave={this.onBlur}  className="dropdown-wrapper input-field">
                <input
                    className={inputClassName}
                    onFocus={() => this.setState({ focus: true })}
                    id={this.props.id}
                    type="text" 
                    onKeyUp={this.handleKeyup}
                    placeholder={placeholder} />
                
                <DropDownComponent focus={this.state.focus} dropdownList={this.props.dropdownList}
                 hoverIndex={this.state.hoverIndex} onSelect={this.onSelect} onHover={this.onHover}
                 />
            </div>
        )
    }
}

function DropDownComponent(props) {
    let dropdownComponent = "";
        if (props.focus &&  props.dropdownList &&  props.dropdownList.length > 0) {
            let dropdownList = props.dropdownList;
            // console.log("RENDERD HOVER:", this.state.hoverIndex);
            dropdownComponent = <div className="dropdown">
                {dropdownList.map(
                    (data, i) => {
                        let className = "dropdown-item";
                        if (props.hoverIndex == i) className = "dropdown-item-hovered";
                        return (
                            <div
                                id={stringUtil.uniqueId()}
                                key={"dropdown-xx-" + stringUtil.uniqueId()}
                                onClick={() => props.onSelect(data.value, data.text)}
                                style={{position:"relative", backgroundColor: '#cccccc'}}
                                className={className}>
                                <DropdownItem onHover={props.onHover} index={i} text={data.text} />
                            </div>
                        )
                    })}
            </div>
        }

        return dropdownComponent;
}


export default InputDropdown;