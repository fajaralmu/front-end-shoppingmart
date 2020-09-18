import React from 'react';
import './Tab.css'

class Tab extends React.Component {
    constructor(props) {
        super(props);

    }
    render() {
        let tabsData = this.props.tabsData ? this.props.tabsData : [];

        let autoColumns = "5% "+("min-content ".repeat(tabsData.length ))+" auto";
        return (
            <div className="tab-container" style={{
                ...this.props.style,
                width:'auto',
                gap:'0px',
                display: 'grid',
                gridTemplateColumns: autoColumns
            }} >
                 <div style={{width:'100%', borderBottom:'solid 1px lightgray'}}></div>
                {tabsData.map((tabData,i) => {
                    return <div key={"tab"+i} className={tabData.active ? "tab-element tab-item-active rounded-top" : "tab-element tab-item"} onClick={tabData.onClick ? tabData.onClick : () => { }}>
                        {tabData.text}
                    </div>
                })}
                <div style={{width:'100%', borderBottom:'solid 1px lightgray'}}></div>
            </div>
        )
    }
}
export default Tab;