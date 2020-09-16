import React, { Component } from 'react'
import './Content.css'

class ContentTitle extends Component {
    constructor(props) {
        super(props);

    }

    render() {

        let title = this.props.title ? this.props.title : "";
        let description = this.props.description ? this.props.description : "";
        let iconClass = this.props.iconClass ? this.props.iconClass : "fas fa-home";

        return (
            <div className="content-title">
                <h2><i className={iconClass}></i>&nbsp;{title}</h2>
                <p>{description}</p>
                {this.props.children}
            </div>
        )
    }
}

export default ContentTitle;