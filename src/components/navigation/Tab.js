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
            <ul className="nav nav-tabs">
  
                {tabsData.map((tabData,i) => {
                    const onClickHandler = function(e){
                        e.preventDefault();
                        if(tabData.onClick){
                            tabData.onClick(e);
                        }
                    }

                    return (
                        <li key={"tab"+i} className="nav-item">
                            <a className={tabData.active ? "nav-link active" : "nav-link"} onClick={onClickHandler}>
                                {tabData.text}
                            </a>
                        </li>
                    )
                })}
            </ul>
        )
    }
}
export default Tab;