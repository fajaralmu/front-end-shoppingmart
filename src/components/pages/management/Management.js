import React, { Component } from 'react' 
import './Management.css'
import { withRouter } from 'react-router';
import * as actions from '../../../redux/actionCreators'
import { connect } from 'react-redux'
import ContentTitle from '../../container/ContentTitle'
import ActionButtons from '../../buttons/ActionButtons';
import * as entityConfig from '../../../utils/EntityConfigurations'
import EntityList from './EntityList';
import Tab from '../../navigation/Tab';

class Management extends Component {
    constructor(props) {
        super(props);
        this.state = {
            entityList: [],
            currentPage: 0,
            entityConfig: { name: "" }
        }
        this.validateLoginStatus = () => {
            if (this.props.loginStatus != true) this.props.history.push("/login");
        }

        this.refresh = () => {
            this.getEntityInPage(this.state.entityConfig, this.state.currentPage);
        }

        this.loadEntityManagement = (config) => {
            this.props.removeManagedEntity();
            this.setState({ currentPage: 0, entityConfig: config });
            this.props.getEntities({
                entityName: config.entityName,
                page: 0,
                limit: 10,
                entityConfig: config
            }, this.props.app);
        }

        this.getEntityInPage = (config, page) => {
            this.setState({ currentPage: page });

            const request = {
                entityName: config.entityName,
                page: page,
                limit: 10,
                entityConfig: config,
                fieldsFilter: config.filter,
                orderBy: config.orderBy,
                orderType: config.orderType,
            };

            console.log("REQUEST: ", request)

            this.props.getEntities(request, this.props.app);
        }

        this.checkIfCurrentMenuName = (name) => {
            return this.state.entityConfig.entityName == name || (this.props.entitiesData.entityConfig && this.props.entitiesData.entityConfig.entityName == name);
        }

        this.getButtonsData = () => {
            return [
                {
                    text: "Product",
                    active: this.checkIfCurrentMenuName("product"),
                    onClick: () => { this.loadEntityManagement(entityConfig.productConfig) }
                },
                {
                    active: this.checkIfCurrentMenuName("supplier"),
                    text: "Supplier",
                    onClick: () => { this.loadEntityManagement(entityConfig.supplierList) }
                },
                {
                    active: this.checkIfCurrentMenuName("customer"),
                    text: "Customer",
                    onClick: () => { this.loadEntityManagement(entityConfig.customerList) }
                },
                {
                    active: this.checkIfCurrentMenuName("transaction"),
                    text: "Transaction",
                    onClick: () => { this.loadEntityManagement(entityConfig.transactionConfig) }
                }
            ];
        }

        this.updateEntity = (name, entity, flag) => {
            if (!window.confirm("Are you sure will update " + name + "?")) {
                return;
            }

            let newRecord = flag == "addNew";

            this.props.updateEntity({ entityName: name, entity: entity, isNewRecord: newRecord }, this, function (ref) {
                ref.callbackHandleUpdate();
            });
        }

        this.getEntityById = (name, id) => {
            this.props.getEntityById(name, id, this.props.app);
        }
        this.removeManagedEntity = () => {
            this.props.removeManagedEntity();
        }

        this.callbackHandleUpdate = () => {
            this.refresh();
            this.removeManagedEntity();
           
        }
    }

    componentDidUpdate(){
        this.validateLoginStatus();
    }

    componentWillMount() {
        this.validateLoginStatus();
        document.title = "Management";
        this.props.setMenuCode("management");
    }

    render() {

        let entityList = this.props.entitiesData ? this.props.entitiesData.entities : [];
        if (null == entityList) { entityList = []; }

        let buttonsData = this.getButtonsData();

        return (
            <div className="section-container">
                <ContentTitle title={"Management " + (this.state.entityConfig.title ?
                    this.state.entityConfig.title :
                    this.props.entitiesData && this.props.entitiesData.entityConfig ?
                        this.props.entitiesData.entityConfig.title : "")}
                        
                        description="manage master data"/>
                <div className="management-container">
                    <Tab tabsData={buttonsData} />
                    <EntityList currentPage={this.state.currentPage}
                        app={this.props.app}
                        getEntityInPage={this.getEntityInPage}
                        entityConfig={this.props.entitiesData.entityConfig}
                        entitiesData={this.props.entitiesData}
                        managedEntity={this.props.managedEntity}
                        getEntityById={this.getEntityById}
                        removeManagedEntity={this.removeManagedEntity}
                        updateEntity={this.updateEntity}
                    />
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => {
    //console.log(state);
    return {
        entitiesData: state.managementState.entitiesData,
        managedEntity: state.managementState.managedEntity
    }
}

const mapDispatchToProps = dispatch => ({
    getEntities: (request, app) => dispatch(actions.getEntityList(request, app)),
    getEntityById: (name, id, app) => {
        let action = actions.getEntityById(name, id, app);
        dispatch(action);
    },
    removeManagedEntity: () => dispatch(actions.removeManagedEntity()),
    updateEntity: (request, referer, callback) => dispatch(actions.updateEntity(request, referer, callback))

})
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Management))