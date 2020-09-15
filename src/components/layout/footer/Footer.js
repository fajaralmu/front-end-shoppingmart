import React, { Component } from 'react';
import '../footer/Footer.css'

class Footer extends Component{

    constructor(props){
        super(props);
    }

    render(){
        let date = new Date().getFullYear();

        return (
            <div className="App-footer">
               <span class="fas fa-coffee"></span> Somabangsa {date+" powered by React Js "+React.version}
            </div>
        )
    }

}

export default Footer;