import React, {Component} from 'react'

class Home extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div>
                <h2>Home Page</h2>
                <p>{this.props.content}</p>
            </div>
        );
    }
}

export default Home;