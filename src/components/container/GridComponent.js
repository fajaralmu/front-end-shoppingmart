import React, { Component } from 'react'

class GridComponent extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        let items = [];
        if (this.props.items) {
            items = this.props.items;
        }

        const repeat = this.props.cols ? this.props.cols : items.length;
        const gridAutoColumns = "auto ".repeat(repeat);

        return (
            <div style={{ ...this.props.style, display: 'grid', verticalAlign: 'middle', gridTemplateColumns: gridAutoColumns }} >
                {items.map(item => {
                    return item;
                })}
            </div>
        )
    }
}

export default GridComponent;