import React, { Component } from 'react'
import '../css/Common.css'
import '../css/Content.css'

class ContentTitle extends Component {
    constructor(props) {
        super(props);

    }

    render() {

        let title = this.props.title ? this.props.title : "";
        let description = this.props.description ? this.props.description : "";
        return (
            <div className="content-title">
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
        )
    }
}

export default ContentTitle;