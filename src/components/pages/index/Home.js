import React, { Component } from 'react'
import * as homeCss from './Home.css'
import * as menus from '../../../constant/Menus'
import ContentTitle from '../../container/ContentTitle';
import * as url from '../../../constant/Url'

class Home extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        const profile = this.props.applicationProfile ? this.props.applicationProfile : {};
        document.title = profile.name;
        this.props.setMenuCode(menus.HOME);
    }

    render() {
        const profile = this.props.applicationProfile ? this.props.applicationProfile : {};
        return (
            <div className="section-container">
                <ContentTitle title={profile.name} description={profile.welcomingMessage} />
                <div style={{ textAlign: 'center' }} className="article-content">
                    <img width="800" src={url.baseImageUrl + "/" + profile.backgroundUrl} />
                </div>
            </div>
        );
    }
}

export default Home;