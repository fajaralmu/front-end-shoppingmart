import React, { Component } from 'react'
import '../css/Common.css'
import '../css/Chart.css'

class Chart extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        let percentage = this.props.value / this.props.maxValue * 100;
        let orientation = this.props.orientation ? this.props.orientation : "horizontal";
        const width = this.props.width ? this.props.width : 400;
        if (percentage < 0 || this.props.maxValue <= 0) {
            percentage = 0;
        }
        let chartStyle = {
            width: percentage + '%'
        };
        let mainStyle = {
            width: width + 'px',
            height: '20px'
        };
        let legendStyle = {
            marginLeft: percentage / 100 * width + 'px',
        };
        if (orientation == "vertical") {
            mainStyle = {
                height: this.props.width ? this.props.width : '400px',
                width: '20px',
                verticalAlign: 'bottom',

            };
            chartStyle = {
                height: percentage + '%',
                marginBottom:0
            };
            legendStyle = {
                marginTop: percentage / 100 * width + 'px',
                writingMode: 'vertical-rl',
                textOrientation: 'mixed'
            };
            if (this.props.type == "success") {
                chartStyle.marginLeft = "5px";
                mainStyle.borderLeft = 'solid 1px gray';
            } else if (this.props.type == "warning") {
                chartStyle.marginRight = "5px";
            }
        } else {
            /**
             * horizontal====
             */ 
            if (this.props.type == "success") {
                mainStyle.borderTop = 'solid 1px gray';
                chartStyle.marginTop = "5px";
            } else if (this.props.type == "warning") {
                chartStyle.marginBottom = "5px";
            }
        }
        let barClassName = this.props.type ? this.props.type : "regular";
        return (
            <div className="chart" style={mainStyle}>
                <div className={"char-bar " + barClassName + "-chart"} style={chartStyle}><span style={legendStyle}>{this.props.text}</span></div>
            </div>
        )
    }
}

export default Chart;