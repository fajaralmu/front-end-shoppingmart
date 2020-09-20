import React, { Component } from 'react'

class Alert extends Component {

    constructor(props) {
        super(props);

        this.onOk = (e) => {
             
            if (this.props.onOk) {
                this.props.onOk(e);
            }
        }
        this.onNo = (e) => {
            
            if (this.props.onNo) {
                this.props.onNo(e);
            }
        }
        this.onClose = (e) => {
            if (this.props.onClose) {
                this.props.onClose(e);
            }
        }
    }

    render() {
        const title = this.props.title ? this.props.title : "Info";
        const yesOnly = this.props.yesOnly == true;
        return (
            <>
                <Backdrop />
                <div className="modal fade show" style={{ display: 'block' }} id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <Header title={title} onClose={this.onClose} />
                            <Body content={this.props.message} />
                            <Footer yesOnly={yesOnly} onOk={this.onOk} onNo={this.onNo} />
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

function Backdrop(props) {
    return (
        <div className="modal-backdrop" style={{backgroundColor: 'rgba(100,100,100,0.7)'}} ></div>
    );
}

function Body(props) {
    return (
        <div className="modal-body"> 
            {props.content}
        </div>
    );
}

function Footer(props) {
    return (
        <div className="modal-footer">
            <button type="button"
                onClick={props.onOk} className="btn btn-primary">Ok</button>
            {props.yesOnly ? null : <button type="button"
                onClick={props.onNo} className="btn btn-secondary">No</button>}
        </div>
    )
}

function Header(props) {
    return (<div className="modal-header">
        <h5 className="modal-title" id="exampleModalCenterTitle">{props.title}</h5>
        <button onClick={props.onClose} type="button" className="close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>)
}

export default Alert;