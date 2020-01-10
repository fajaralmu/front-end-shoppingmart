import React, {Component} from 'react'
import '../css/Input.css'

class Label extends Component{
    constructor(props){
        super(props);

        this.onClick = () =>{
            if(this.props.onClick){
                this.props.onClick();
            }
        }
    }

    render(){
        let style = this.props.style?this.props.style:{};
        let className = "input-field ";
        if(this.props.className){
            className+=" "+this.props.className;
        }
        if(this.props.onClick){
            className+=" clickable";
        }
        return(
            <div onClick={this.onClick} style={style} className={className}>
                <label>{this.props.text}</label>
            </div>
        )
    }

}

export default Label;