import React, { Component } from 'react'
import GridComponent from './../../container/GridComponent';
import Label from './../../container/Label';


class GraphChart extends Component {

    constructor(props) {
        super(props);
    }

    isHorizontal() {
        return this.props.orientation == 'horizontal';
    }

    getChartComponents() {

        const components = [];
        const chartData = this.props.chartData;
        const chartGroups = this.props.chartGroups;

        for (let g = 0; g < chartGroups.length; g++) {
            const group = chartGroups[g];

            const groupedComponents = new Array();
            for (let i = 0; i < chartData.length; i++) {
                const element = chartData[i];
                if (element.group == group.value) {
                    const component = <ChartItem orientation={this.props.orientation} element={element} maxValue={this.props.maxValue} />
                    groupedComponents.push(component);
                }
            }

            let groupedComponent;
            if (this.isHorizontal()) {
                groupedComponent = <div className="row">
                    <div className="col-2"><Label style={{ fontSize: '0.9em', fontFamily: 'TNR' }} text={group.label} /></div>
                    <div className="col-10">{groupedComponents.map(g => g)}</div>
                </div>
            } else {
                groupedComponent = <div>
                    <div style={{ display: 'grid', width: 'min-content', gridTemplateColumns: 'auto auto' }}>{groupedComponents.map(g => g)}</div>
                    
                    <div><Label style={{ fontSize: '0.9em', fontFamily: 'TNR' }} text={group.label} /></div>
                </div>
            }
            components.push(groupedComponent);
        }
        return components;
    }

    render() {

        return (
            <div className="graph-chart" style={{ width: '80%' }}>
                <GridComponent cols={this.props.orientation == "horizontal" ? 1 : this.props.chartGroups.length} style={{ width: '100%' }} items={this.getChartComponents()} />
            </div>
        )
    }

}

function ChartItem(props) {
    const element = props.element;
    const value = element.value ? element.value : 0;
    let percentage = (value / props.maxValue) * 100;
    const orientation = props.orientation;

    let style;
    let bgStyle = { margin: '3px', fontSize: '0.6em' };
    let className;
    if (orientation == 'horizontal') {
        style = {
            backgroundColor: element.color ? element.color : '#cccccc',
            width: percentage + '%',
            height: '20px'
        }
        bgStyle.backgroundColor = '#ffffff';
        bgStyle.width = '100%';
        bgStyle.height = '20px';

    } else if (orientation == 'vertical') {
        style = {
            backgroundColor: '#ffffff',
            height: (100 - percentage) + '%',
            width: '20px'
        }
        bgStyle.backgroundColor = element.color ? element.color : '#cccccc';
        bgStyle.height = '200px';
        bgStyle.width = '20px';
        className = "col";
    }
    return (
        <div className={className} >
            <div style={bgStyle}>
                <div style={style} >{element.label}</div>
            </div>
        </div>
    );
}

export default GraphChart;