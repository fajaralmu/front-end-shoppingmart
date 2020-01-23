import React, { Component } from 'react'
import '../css/About.css'
import '../css/Common.css'
import * as menus from '../constant/Menus'
import InstantTable from './InstantTable'
import * as url from '../constant/Url'
import '../css/Common.css'
import ContentTitle from './ContentTitle'

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
            <div className="section-container about-section  " >
                <ContentTitle title="About Us" />
                <div className=" abount-content" style={{
                    padding: '5px',
                    width: '90%',
                    fontFamily: 'Consolas', margin: '5px'
                }}>
                    <InstantTable
                        rows={[
                            { values: ["Name", "Universal Good Shop"] },
                            { values: ["Version", "1.0.0"] },
                            { values: ["Description", "Friendly shopping mart application"] },


                        ]} />
                    <h2>Powered By</h2>
                    <img style={{ width: '80%' }} src={url.baseResUrl + "POWERED_BY.png"} />
                </div></div>
 
        )
    }
}

export default About;