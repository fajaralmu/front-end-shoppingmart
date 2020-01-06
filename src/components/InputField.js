import React, { Component } from 'react'
import '../css/Common.css'
import '../css/Input.css'

class InputField extends Component {
    constructor(props) {
        super(props); 
        this.handleKeyup = () => {
            if(this.props.onKeyUp)
                this.props.onKeyUp(document.getElementById(this.props.id).value);
        } 
        
    }

    componentDidMount(){
        if(this.props.value){
            document.getElementById(this.props.id).value = this.props.value;
        }
    }

    render() {
        let type = this.props.type ? this.props.type : "text"; 
        let placeholder = this.props.placeholder? this.props.placeholder:"";
        return (
            <div className="input-field ">
               {this.props.disabled == true ? 
               <input className="rounded" id={this.props.id} type={type} onKeyUp={this.handleKeyup} placeholder={placeholder} disabled/>
               : <input  id={this.props.id} type={type} onKeyUp={this.handleKeyup} placeholder={placeholder} />}
            </div>
        )
    }
}

export default InputField;