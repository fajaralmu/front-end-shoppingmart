import React, { Component } from 'react' 

class ActionButton extends Component {
    constructor(props) {
        super(props);

        this.onClick = () => {
            if(this.props.onClick){
                this.props.onClick();
            }
        }
    }

    render() {
        let className = "btn btn-secondary";
        if(this.props.status!= null ){
            className= "btn ".concat("btn-").concat(this.props.status);
        }
        return (
            <div >
                <button style={{...this.props.style, margin:'1px'}} className={className} id={this.props.id} onClick={this.onClick}>{this.props.text}</button>
            </div>
        )
    }

}

export default ActionButton;