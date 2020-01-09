import React, {Component} from 'react'
import '../css/Input.css'

class Label extends Component{
    constructor(props){
        super(props);
    }

    render(){
        let style = this.props.style?this.props.style:{};
        return(
            <div style={style} className="input-field">
                <label>{this.props.text}</label>
            </div>
        )
    }

}

export default Label;