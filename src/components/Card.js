import React, {Component} from 'react'
import '../css/Common.css'
import '../css/Card.css'
 

class Card extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="card rounded ">
                <div className="panel-title rounded-top">
                    {this.props.title}
                </div>
                <div className="card-content">
                    {this.props.content}
                </div>
            </div>
        )
    }
}

export default Card;