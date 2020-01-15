import React, { Component } from 'react'
import '../css/About.css'
import '../css/Common.css'
import * as menus from '../constant/Menus'
import InstantTable from './InstantTable'
import '../css/Common.css'

class About extends Component {

    constructor(props) {
        super(props)

    }

    componentDidMount() {
        document.title = "About Us";
        this.props.setMenuCode(menus.ABOUT);
    }

    render() {
        return (
            <div  className="section-container about-section  " >
                <h2>About Us</h2>
                <div className="rounded box-shadow abount-content" style={{padding:'5px',  
                    width: '500px',
                    fontFamily: 'Consolas'}}>
                <InstantTable
                    rows={[
                        { values: ["Name","Universal Good Shop"] },
                        { values: ["Version","1.0.0"] },
                        { values: ["Description","Friendly shopping mart application"] },
                        { values: ["Front End Technology","React Js "+React.version +" [Javascript]"] },
                        { values: ["Back End Technology","Spring Framework [Java]"] },
                        { values: ["Database","MySql"] },
                        { values: ["Address","Trikarso, Sruweng, Kebumen"] },
                        { values: ["Contact","somabangsa@gmail.com"] },

                    ]} /></div>
            </div>
        )
    }
}

export default About;