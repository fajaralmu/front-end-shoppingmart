import React, { Component } from 'react'
import './Management.css'
import { withRouter } from 'react-router';
import * as actions from '../../../redux/actionCreators'
import { connect } from 'react-redux'
import ContentTitle from '../../container/ContentTitle' 
import EntityList from './EntityList';
import Tab from '../../navigation/Tab';
import { CenterLoading } from '../../messages/SimpleLoader';

class Management extends Component {
    constructor(props) {
        super(props);
        this.state = {
            entityList: [],
            currentPage: 0,
            entityConfig: null
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
            this.props.getEntityProperty(config.entityName, this.props.app);
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
            if(!this.state.entityConfig || !this.props.entitiesData.entityConfig){
                return false;
            }
            return (this.state.entityConfig.entityName == name) || (this.props.entitiesData.entityConfig.entityName == name);
        }

        this.getTabMenusData = () => {

            if(this.props.entityConfigList == null) {
                return [];
            }

            const configList = this.props.entityConfigList;
            const buttonsData = [];
            for (let i = 0; i < configList.length; i++) {
                const config = configList[i];
                buttonsData.push( {
                    text: config.label,
                    active: this.checkIfCurrentMenuName(config.entityName),
                    onClick: () => { this.loadEntityManagement(config) }
                });
            }

            if(!this.state.entityConfig &&  (configList).length > 0){
                this.loadEntityManagement(configList[0]);
            }

            return buttonsData; 
            
        }

        this.updateEntity = (name, entity, flag) => {
            const app = this;
            this.props.app.confirmDialog("Are you sure will update " + name + "?",
                function (e) {
                    let newRecord = flag == "addNew"; 
                    app.props.updateEntity({ entityName: name, entity: entity, isNewRecord: newRecord }, app, function (ref) {
                        ref.callbackHandleUpdate();
                    });
                }, function (e) { }); 

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

    componentDidUpdate() {
        this.validateLoginStatus();
    }

    componentWillMount() {
        this.validateLoginStatus();
        document.title = "Management";
        this.props.setMenuCode("management");
        if(!this.props.entityConfigList || this.props.entityConfigList.length == 0){
            this.props.getManagementMenus(this.props.app);
        }
       
        
    }

    render() {

        let entityList = this.props.entitiesData ? this.props.entitiesData.entities : [];
        if (null == entityList) { entityList = []; }

        const buttonsData = this.getTabMenusData();

        return (
            <div className="section-container">
                <ContentTitle iconClass="fas fa-database" title={"Master Data " + (this.props.entityProperty ?
                        this.props.entityProperty.alias : "")}

                    description="manage master data" />
                <div className="management-container">
                    <Tab tabsData={buttonsData} />
                    {this.props.entityProperty? 
                    <EntityList currentPage={this.state.currentPage}
                        app={this.props.app}
                        getEntityInPage={this.getEntityInPage}
                        entityConfig={this.props.entitiesData.entityConfig}
                        entitiesData={this.props.entitiesData}
                        managedEntity={this.props.managedEntity}
                        getEntityById={this.getEntityById}
                        removeManagedEntity={this.removeManagedEntity}
                        updateEntity={this.updateEntity}
                        entityProperty={this.props.entityProperty}
                    /> :<CenterLoading />}
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => {
    //console.log(state);
    return {
        entitiesData: state.managementState.entitiesData,
        managedEntity: state.managementState.managedEntity,
        entityProperty: state.managementState.entityProperty,
        entityConfigList: state.managementState.managementMenus
    }
}

const mapDispatchToProps = dispatch => ({
    getEntities: (request, app) => dispatch(actions.getEntityList(request, app)),
    getEntityProperty: (entityName, app) => dispatch(actions.getEntityProperty(entityName, app)),
    getEntityById: (name, id, app) => dispatch(actions.getEntityById(name, id, app)),
    removeManagedEntity: () => dispatch(actions.removeManagedEntity()),
    updateEntity: (request, referer, callback) => dispatch(actions.updateEntity(request, referer, callback)),
    getManagementMenus: (app) => dispatch(actions.getManagementMenus(app))

})
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Management))