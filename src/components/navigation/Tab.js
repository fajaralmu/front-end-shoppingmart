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
            // <div className="tab-container" style={{
            //     ...this.props.style,
            //     width:'auto',
            //     gap:'0px',
            //     display: 'grid',
            //     gridTemplateColumns: autoColumns
            // }} >
            //      <div style={{width:'100%', borderBottom:'solid 1px lightgray'}}></div>
            <ul class="nav nav-tabs">
  
                {tabsData.map((tabData,i) => {
                    return (
                        <li key={"tab"+i} className="nav-item">
                            <a href="#" className={tabData.active ? "nav-link active" : "nav-link"} onClick={tabData.onClick ? tabData.onClick : () => { }}>
                                {tabData.text}
                            </a>
                        </li>
                    // <div key={"tab"+i} className={tabData.active ? "tab-element tab-item-active rounded-top" : "tab-element tab-item"} onClick={tabData.onClick ? tabData.onClick : () => { }}>
                    //     {tabData.text}
                    // </div>
                    )
                })}
            </ul>
            //     <div style={{width:'100%', borderBottom:'solid 1px lightgray'}}></div>
            // </div>
        )
    }
}
export default Tab;