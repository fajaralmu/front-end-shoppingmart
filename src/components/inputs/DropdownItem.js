import React, { Component } from 'react'
 

class DropdownItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false
        }

        this.onHover = (e) => {
            if(this.props.onHover)
                this.props.onHover( this.props.index);
        }
        this.unHover = (e) => { 
            this.setState({ hover: false })
        }
    }


    render() {
          return (
            <div onMouseLeave={this.unHover} onMouseOver ={this.onHover}  >
                {this.props.text}</div>
        )
    }
}
export default DropdownItem;