import React, { Component } from 'react'
import { connect } from 'react-redux'
import CatalogItem from './CatalogItem'
import './Catalog.css'
import { BrowserRouter as Router, Route, Link, Switch, withRouter } from 'react-router-dom'
import * as actions from '../redux/actionCreators'

class Catalog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            catalogData: {
                entities: []
            },
            limit:10,
            totalData:0,
            products: [],
            catalogPage: 0,
            firstLoad:true
        };

        this.getProductCatalog = (page) => {
            this.props.getProductCatalog(page);
        }
    }

    componentWillMount() {
        console.log("=======will mount========")
        this.getProductCatalog(this.state.catalogPage);
       
    }

    componentDidUpdate(){
       
        if(this.state.firstLoad){
            if(this.props.catalogData.filter!=null){
                this.setState({limit: this.props.catalogData.filter.limit});
                this.setState({totalData: this.props.catalogData.totalData});
                this.setState({firstLoad:false});
            }
        }
    }

    createNavButtons(totalButton){
        let buttonData = [];
        for (let index = 0; index < totalButton; index++) {
           buttonData.push({
               val:index+1
           }); 
        }
        return buttonData;
    }


    render() {

        let products = this.props.catalogData.entities == null ? [] : this.props.catalogData.entities;
        let buttonData = [];
        if(this.state.totalData>0)
            buttonData = this.createNavButtons(this.state.totalData / this.state.limit);
        return (
            <div className="catalog-container" id="catalog-main" key="catalog-main">
                <h2>Catalog Page</h2>
                <p>current page:{this.state.catalogPage}, displayed items: {products.length} total items:{this.state.totalData}</p>
                {
                    buttonData.map(b=>{
                        return <button>{b.val}</button>
                    })
                }
                <div className="product-panel">
                    {products.map(
                        product => {
                           return <CatalogItem key={product.id} product={product} />
                        }
                    )}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    console.log("Catalog State to props: ", state);
    return {
        catalogData: state.shopState.catalogData
    }
}

const mapDispatchToProps = dispatch => ({
    getProductCatalog: (page) => dispatch(actions.getProductList(page))
    // getExam: (id) => dispatch(getExamById(id)),
    // oneExam: () => dispatch(fetchOneExam()),
    // addExam: (exam) => dispatch(appNewExam(exam)),
    // deleteExam: (id) => dispatch(deleteExam(id)),
    // login: () => dispatch(login()),
    // logout: () => dispatch(logout())
})
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Catalog));