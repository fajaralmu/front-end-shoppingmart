import React, {Component} from 'react'
import '../css/Home.css'
import '../css/Common.css'

class Home extends Component{
    constructor(props){
        super(props);
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