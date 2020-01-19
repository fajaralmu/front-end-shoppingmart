import React, { Component } from 'react'
import '../css/Common.css'
import '../css/Management.css'
import { withRouter } from 'react-router';
import * as actions from '../redux/actionCreators'
import { connect } from 'react-redux'
import ContentTitle from './ContentTitle'
import ActionButtons from './ActionButtons';
import * as entityConfig from '../utils/EntityConfigurations'
import EntityList from './EntityList';

class Management extends Component {
    constructor(props) {
        super(props);
        this.state = {
            entityList: [], 
            currentPage: 0
        }
        this.validateLoginStatus = () => {
            if (this.props.loginStatus != true) this.props.history.push("/login");
        }

        this.getEntity = (config) => {
            this.setState({currentPage:0});
            this.props.getEntities({
                entityName: config.entityName,
                page: 0,
                limit: 10,
                entityConfig:config
            }, this.props.app);
        }
        this.getEntityInPage = (config, page) => {
            this.setState({currentPage:page});
            this.props.getEntities({
                entityName: config.entityName,
                page: page,
                limit: 10,
                entityConfig:config
            }, this.props.app);
        }
    }

    componentWillMount() {
        this.validateLoginStatus();
        document.title = "Management";
        this.props.setMenuCode("management");
    }

    render() {

        let entityList = this.props.entitiesData ? this.props.entitiesData.entities : [];
        if (null == entityList) { entityList = []; }

        let buttonsData = [
            {
                text: "Product",
                onClick: () => { this.getEntity(entityConfig.productConfig) }
            },
            {
                text: "Supplier",
                onClick: () => { this.getEntity(entityConfig.supplierList) }
            }, 
            {
                text: "Customer",
                onClick: () => { this.getEntity(entityConfig.customerList) }
            }
        ];


        return (
            <div className="section-container">
                <ContentTitle title="Management" />
                <div className="management-container">
                    <ActionButtons buttonsData={buttonsData} />
                    <EntityList currentPage={this.state.currentPage} getEntityInPage={this.getEntityInPage} entityConfig={this.props.entitiesData.entityConfig}
                        entitiesData={this.props.entitiesData} />
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => {
    //console.log(state);
    return {
        entitiesData: state.managementState.entitiesData,
    }
}

const mapDispatchToProps = dispatch => ({
    getEntities: (request, app) => dispatch(actions.getEntityList(request, app)),


})
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Management))