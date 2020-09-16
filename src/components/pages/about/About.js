import React, { Component } from 'react' 
import * as menus from '../../../constant/Menus' 
import * as url from '../../../constant/Url' 
import ContentTitle from '../../container/ContentTitle'
import InstantTable from '../../container/InstantTable'

class About extends Component {

    constructor(props) {
        super(props)

    }

    componentDidMount() {
        document.title = "About Us";
        this.props.setMenuCode(menus.ABOUT);
    }

    render() {
        const profile = this.props.applicationProfile;

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
                            { values: ["Name", profile.name] },
                            { values: ["Version", "1.0.0"] },
                            { values: ["Description", profile.shortDescription] },


                        ]} />
                    <h2>Powered By</h2>
                    <img style={{ width: '80%' }} src={url.baseResUrl + "POWERED_BY.png"} />
                </div></div>
 
        )
    }
}

export default About;