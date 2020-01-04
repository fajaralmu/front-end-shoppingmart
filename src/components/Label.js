import React, {Component} from 'react'
import '../css/Input.css'

class Label extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="input-field">
                <label>{this.props.text}</label>
            </div>
        )
    }

}

export default Label;