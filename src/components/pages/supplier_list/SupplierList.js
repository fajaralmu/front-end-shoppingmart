import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Link, Switch, withRouter } from 'react-router-dom'
import * as actions from '../../../redux/actionCreators'
import * as menus from '../../../constant/Menus'
import ActionButtons from '../../buttons/ActionButtons'
import ComboBox from '../../inputs/ComboBox'
import * as componentUtil from '../../../utils/ComponentUtil'
import * as url from '../../../constant/Url'
import Card from '../../card/Card'
import ContentTitle from '../../container/ContentTitle'
import NavButtons from '../../navigation/NavButtons'
import GridComponent from '../../container/GridComponent'
import InputField from '../../inputs/InputField'
import SupplierDetail from './SupplierDetail'

const DEFAULT_TITLE =  "Our Suppliers";

class SupplierList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            suppliersData: { entities: [] },
            limit: 10, totalData: 0, suppliers: [],
            supplierPage: 0, firstLoad: true,
            requestOrderBy: null, requestOrderType: null,
            requestSupplierName: "",
            supplierDetail : null
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

        this.showSupplierDetail = (supplier) => {
            document.title = supplier.name;
            this.setState({supplierDetail: supplier});
        }

        this.hideSupplierDetail = () => {
            document.title = DEFAULT_TITLE;
            this.setState({supplierDetail: null});
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

            this.props.app.infoDialog("filter has been cleared, please push the search button to take effect")
        }

        this.next = () => {
            let supplierPage = this.state.supplierPage;
            let totalPage = Math.floor(this.props.suppliersData.totalData / this.state.limit);
            if (supplierPage >= totalPage - 1) { supplierPage = 0; }
            else { supplierPage++; }

            this.getSupplierList(supplierPage);
        }

        this.prev = () => {
            let supplierPage = this.state.supplierPage;
            let totalPage = Math.floor(this.props.suppliersData.totalData / this.state.limit);
            if (supplierPage <= 0) { supplierPage = totalPage - 1; }
            else { supplierPage--; }

            this.getSupplierList(supplierPage);
        }

        this.generateNavButtonsData = () => {
            let suppliers = this.props.suppliersData.entities == null ? [] : this.props.suppliersData.entities;
            let buttonData = [];
            if (suppliers.length > 0) {
                buttonData = componentUtil.createNavButtons(this.props.suppliersData.totalData / this.state.limit, this.state.supplierPage);

            }

            const navButtonsData = [{
                id: "btn-prev",
                buttonClick: this.prev,
                text: "previous"
            }];
            for (let i = 0; i < buttonData.length; i++) {
                const b = buttonData[i];
                let active = (b.value == this.state.supplierPage)
                navButtonsData.push({
                    id: b.value,
                    active: active,
                    buttonClick: () => this.getSupplierList(b.value),
                    text: b.text
                });
            }

            navButtonsData.push({
                id: "btn-next",
                buttonClick: this.next,
                text: "next"
            });
            return navButtonsData;
        }

        this.filterBox = () => {
            let actionButtons = [
                { text: <i className="fas fa-search"></i>, status: "success", onClick: () => this.getSupplierList(0), id: "btn-search" },
                { text: "Clear Filter", status: 'warning', onClick: this.clearField, id: "Clear" }
            ];

            return (<div className="filter-box">
                <GridComponent cols={2} style={{ width: 'max-content' }} items={
                    [
                        <InputField placeholder="search by supplier name" onKeyUp={this.handleInputNameChange} type="search"
                            id="input-supplier-name" />,
                        <ComboBox defaultValue={this.state.requestOrderBy + "-" + this.state.requestOrderType} onChange={this.handleOrderChange}
                            options={filterSupplierOptions} key="k-select-order" id="select-order" />,
                        <ActionButtons style={{ margin: '5px' }} key="btns" buttonsData={actionButtons} />
                    ]
                } />
                <p></p>
            </div>);
        }
    }

    componentWillMount() {

        document.title = DEFAULT_TITLE;
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

        let content;
        if(this.state.supplierDetail){
            content = <SupplierDetail app={this.props.app} hideDetail={this.hideSupplierDetail} supplier={this.state.supplierDetail} />
        } else {
            content = (<div className="section-container">
                <ContentTitle title="Supplier List Page" iconClass="fas fa-warehouse" description="List of our partners" />
                <NavButtons buttonsData={this.generateNavButtonsData()} />
                <this.filterBox />
                <div className="row catalog-container">
                    {suppliers.map(
                        supplier => {
                        return <SupplierCard onClick={this.showSupplierDetail} supplier={supplier} />
                        }
                    )}
                </div>
            </div>);
        }

        return (content)
    }
}

function SupplierCard(props) {
    const supplier = props.supplier;
    const imageUrl = url.baseImageUrl + supplier.iconUrl;
    const content = 
    <div>
        <p><a className="clickable" onClick={()=>props.onClick(supplier)}>{supplier.name}</a></p>
        <span style={{ fontSize: '0.7em' }}>{supplier.address}</span>
    </div>

    return <div className="col-md-3" style={{width:'min-content'}}><Card
        icon={imageUrl}
        key={supplier.id}
        content={content}
    /></div>
}

const filterSupplierOptions = [
    { value: "00", text: "-Select Order-" },
    { value: "name-asc", text: "Name [A-Z]" },
    { value: "name-desc", text: "Name [Z-A]" }
];

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