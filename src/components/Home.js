import React, {Component} from 'react'
import '../css/Home.css'
import '../css/Common.css'
import * as menus from '../constant/Menus'

class Home extends Component{
    constructor(props){
        super(props);
        
    }

    componentDidMount(){
        document.title = "Universal Good Shop";
        this.props.setMenuCode(menus.HOME);
    }

    render(){
        return(
            <div className="section-container">
                <h2>Home Page</h2>
                <p>{this.props.content}</p>
            </div>
        );
    }
}

export default Home;