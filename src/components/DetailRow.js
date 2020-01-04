import React, {Component} from 'react'
import * as url from '../constant/Url'
import '../css/DetailRow.css'

class DetailRow extends Component{

    constructor(props){
        super(props);
    }
    render(){
        return (
            <tr className="detail-item">
                <td><img src={url.baseImageUrl+this.props.icon} width="50" height="50"/></td>
                <td>{this.props.name} <br/><span className="link">{this.props.desc}</span></td>
            </tr>
        )
    }
}

export default DetailRow;