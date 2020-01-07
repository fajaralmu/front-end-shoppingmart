import React, { Component } from 'react'
import { connect } from 'react-redux'
import CatalogItem from './CatalogItem'
import NavButton from './NavButton'
import '../css/Catalog.css'
import { BrowserRouter as Router, Route, Link, Switch, withRouter } from 'react-router-dom'
import * as actions from '../redux/actionCreators'
import * as menus from '../constant/Menus'
import CatalogItemSupplier from './CatalogItemSupplier'
import ActionButtons from './ActionButtons'
import InputField from './InputField'
import ComboBox from './ComboBox'
import * as componentUtil from '../utils/ComponentUtil'

class SupplierList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            suppliersData: { entities: [] },
            limit: 10, totalData: 0, suppliers: [], supplierPage: 0, firstLoad: true, requestOrderBy: null, requestOrderType: null,
            requestSupplierName: "",
        };

        this.getSupplierList = (_page) => {
            console.log("will go to page: ", _page)

            this.props.getSupplierList({
                page: _page,
                name: this.state.requestSupplierName,
                orderby: this.state.requestOrderBy,
                ordertype: this.state.requestOrderType
            });
            this.setState({ supplierPage: _page });
            this.setState({ totalData: this.props.suppliersData.totalData });
        }

        this.handleOrderChange = () => {
            console.log("==selectbox changed==");
            let selectBox = document.getElementById("select-order");
            let value = selectBox.value;
            if (value == null || value.length == 0 || value.split("-").length != 2) {
                return;
            } else {
                let rawOrderRequest = value.split("-");
                this.setState({ requestOrderBy: rawOrderRequest[0] });
                this.setState({ requestOrderType: rawOrderRequest[1] });
            }

        }

        this.handleInputNameChange = () => {
            console.log("==input name changed==");
            let input = document.getElementById("input-supplier-name");
            this.setState({ catalogPage: 0 })
            this.setState({ requestSupplierName: input.value });
        }

        this.clearField = () => {
            document.getElementById("input-supplier-name").value = "";
            this.setState({ requestSupplierName: "" });

            document.getElementById("select-order").value = "00";
            this.setState({ requestOrderBy: null, requestOrderType: null });

            alert("filter has been cleared, please push the search button to take effect")
        }

        this.next = () => {
            let supplierPage = this.state.supplierPage;
            let totalPage = this.props.suppliersData.totalData / this.state.limit
            if (supplierPage >= totalPage - 1) { supplierPage = 0; }
            else { supplierPage++; }

            this.getSupplierList(supplierPage);
        }

        this.prev = () => {
            let supplierPage = this.state.supplierPage;
            let totalPage = this.props.suppliersData.totalData / this.state.limit
            if (supplierPage <= 0) { supplierPage = totalPage - 1; }
            else { supplierPage--; }

            this.getSupplierList(supplierPage);
        }

    }

    componentWillMount() {
        console.log("=======will mount========")
        document.title = "Our Suppliers";
        this.getSupplierList(this.state.supplierPage);
        this.props.setMenuCode(menus.SUPPLIERLIST);

    }

    componentDidUpdate() {
        console.log("Entity:", this.props.selectedSupplier);
        if (this.state.firstLoad && this.props.suppliersData.filter != null) {
            this.setState({
                limit: this.props.suppliersData.filter.limit,
                totalData: this.props.suppliersData.totalData,
                firstLoad: false
            });
        }
    }




    render() {

        let suppliers = this.props.suppliersData.entities == null ? [] : this.props.suppliersData.entities;
        let buttonData = [];
        if (suppliers.length > 0)
            buttonData = componentUtil.createNavButtons(this.props.suppliersData.totalData / this.state.limit);

        let filterBox = <div className="filter-box">
            <InputField placeholder="search by supplier name" onKeyUp={this.handleInputNameChange} type="search"
                id="input-supplier-name" />
            <ComboBox defaultValue="00" onChange={this.handleOrderChange}
                options={[
                    { value: "00", text: "-Select Order-" },
                    { value: "name-asc", text: "Name [A-Z]" },
                    { value: "name-desc", text: "Name [Z-A]" }
                ]} id="select-order" />

            <ActionButtons buttonsData={[{
                text: "Search", status: "success", onClick: () => this.getSupplierList(this.state.supplierPage), id: "btn-search"
            }, {
                text: "Clear", status: 'warning', onClick: this.clearField, id: "Clear"
            }]} />

            <p></p>
        </div>;

        let supplierCatalog = (<div className="section-container" id="catalog-main" key="catalog-main">
            <h2>Supplier List Page</h2>
            <p>List of our partners</p>
            <div className="nav-containter">
                <NavButton buttonClick={this.prev} key="nav-prev" text="<" />
                {buttonData.map(b => {
                    let active = (b.value == this.state.supplierPage)
                    return <NavButton active={active} buttonClick={() => this.getSupplierList(b.value)} value={b.value} text={b.text} />
                })}
                <NavButton buttonClick={this.next} key="nav-next" text=">" />
            </div>
            {filterBox}
            <div className="supplier-panel">
                {suppliers.map(
                    supplier => {
                        return <CatalogItemSupplier key={supplier.id} supplier={supplier} />
                    }
                )}
            </div>
        </div>);

        return (
            supplierCatalog
        )
    }
}

const mapStateToProps = state => {
    console.log("Supplier List State to props: ", state);
    return {
        suppliersData: state.shopState.suppliersData
    }
}

const mapDispatchToProps = dispatch => ({
    getSupplierList: (request) => dispatch(actions.getSupplierList(request))

})
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(SupplierList));