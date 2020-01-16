import React, { Component } from 'react'

import '../css/Input.css'

class DropdownItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false
        }

        this.onHover = (e) => {
            if(this.props.hover)
                this.props.hover( );
        }
        this.unHover = (e) => {
            console.log("~UN HOVER: ", e)
            this.setState({ hover: false })
        }
    }


    render() {
          return (
            <div onMouseLeave={this.unHover} onMouseEnter={this.onHover}  >
                {this.props.text}</div>
        )
    }
}
export default DropdownItem;