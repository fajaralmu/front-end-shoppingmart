import React, { Component } from 'react'
import { connect } from 'react-redux'
import NavButton from './NavButton'
import '../css/Catalog.css'
import { BrowserRouter as Router, Route, Link, Switch, withRouter } from 'react-router-dom'
import * as actions from '../redux/actionCreators'
import * as menus from '../constant/Menus'
import ActionButtons from './ActionButtons'
import InputField from './InputField'
import ComboBox from './ComboBox'
import * as componentUtil from '../utils/ComponentUtil'
import * as stringUtil from '../utils/StringUtil'
import * as url from '../constant/Url'
import Card from './Card'

class SupplierList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            suppliersData: { entities: [] },
            limit: 10, totalData: 0, suppliers: [], supplierPage: 0, firstLoad: true, requestOrderBy: null, requestOrderType: null,
            requestSupplierName: "",
        };

        this.getSupplierList = (_page) => {
            this.props.getSupplierList({
                page: _page,
                name: this.state.requestSupplierName,
                orderby: this.state.requestOrderBy,
                ordertype: this.state.requestOrderType
            }, this.props.app);
            this.setState({ supplierPage: _page });
            this.setState({ totalData: this.props.suppliersData.totalData });
        }

        this.handleOrderChange = (value) => {
            if (value == null || value.length == 0 || value.split("-").length != 2) {
                return;
            } else {
                let rawOrderRequest = value.split("-");
                this.setState({ requestOrderBy: rawOrderRequest[0] });
                this.setState({ requestOrderType: rawOrderRequest[1] });
            }

        }

        this.handleInputNameChange = (value) => {
            this.setState({ catalogPage: 0 })
            this.setState({ requestSupplierName: value });
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

        document.title = "Our Suppliers";
        this.getSupplierList(this.state.supplierPage);
        this.props.setMenuCode(menus.SUPPLIERLIST);

    }

    componentDidUpdate() {
        if (this.state.firstLoad && this.props.suppliersData.filter != null) {
            this.setState({
                //limit: this.props.suppliersData.filter.limit,
                totalData: this.props.suppliersData.totalData,
                firstLoad: false
            });
        }
    }

    render() {

        let suppliers = this.props.suppliersData.entities == null ? [] : this.props.suppliersData.entities;
        let buttonData = [];
        if (suppliers.length > 0) {
            buttonData = componentUtil.createNavButtons(this.props.suppliersData.totalData / this.state.limit);
            console.log("_________________will create nav buttons__________________"
                , this.props.suppliersData.totalData, this.state.limit);
        }


        let filterBox = <div className="filter-box">
            <InputField placeholder="search by supplier name" onKeyUp={this.handleInputNameChange} type="search"
                id="input-supplier-name" />
            <ComboBox defaultValue="00" onChange={this.handleOrderChange}
                options={[
                    { value: "00", text: "-Select Order-" },
                    { value: "name-asc", text: "Name [A-Z]" },
                    { value: "name-desc", text: "Name [Z-A]" }
                ]} key="k-select-order" id="select-order" />

            <ActionButtons key="btns" buttonsData={[{
                text: "Search", status: "success", onClick: () => this.getSupplierList(0), id: "btn-search"
            }, {
                text: "Clear", status: 'warning', onClick: this.clearField, id: "Clear"
            }]} />

            <p></p>
        </div>;

        let supplierCatalog = (<div className="section-container" id="catalog-main" key="catalog-main">
            <h2>Supplier List Page</h2>
            <p>List of our partners</p>
            <div className="nav-containter">
                <NavButton key={stringUtil.uniqueId()} buttonClick={this.prev} key="nav-prev" text="<" />
                {buttonData.map(b => {
                    let active = (b.value == this.state.supplierPage)
                    return <NavButton key={stringUtil.uniqueId()} active={active} buttonClick={() => this.getSupplierList(b.value)} value={b.value} text={b.text} />
                })}
                <NavButton key={stringUtil.uniqueId()} buttonClick={this.next} key="nav-next" text=">" />
            </div>
            {filterBox}
            <div className="supplier-panel">
                {suppliers.map(
                    supplier => {
                        let imageUrl = url.baseImageUrl + supplier.iconUrl;
                        let content = <div  >
                            <a href={supplier.website}>{supplier.name}
                            </a>
                            <br />
                            <span style={{ fontSize: '0.7em' }}>{supplier.address}</span>
                        </div>

                        return <Card
                            icon={imageUrl}
                            style={{ float: 'left' }}
                            key={supplier.id}
                            content={content}
                        />
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
    return {
        suppliersData: state.shopState.suppliersData
    }
}

const mapDispatchToProps = dispatch => ({
    getSupplierList: (request, app) => dispatch(actions.getSupplierList(request, app))

})
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(SupplierList));