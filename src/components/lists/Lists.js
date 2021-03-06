import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ListsTable from './ListsTable';
import {destroyDataTable, initializeDataTable, showNotification} from '../helperComponents/sharedFunctions';
import CreateListForm from './CreateListForm';
import * as listActions from '../../actions/listActions';
import JQuery from 'jquery';
import LoadingAnimation from '../helperComponents/LoadingAnimation';
import LogoutBtn from "../helperComponents/LogoutButton";
import { confirmAlert } from 'react-confirm-alert';

export class Lists extends React.Component{

    constructor(props, context) {
        super(props, context);
        this.state = {
            updateList: props.updateList,
            existingShoppingList: props.existingShoppingList,
            newShoppingList: props.newShoppingList,
            loading: props.loading
        };

        this.editList = {
            initialize: (event) => {
                let oldShoppingList = {};
                const listsRow = JQuery(event.target).closest('tr');
                oldShoppingList.title = JQuery(listsRow).find('.list-title').text();
                oldShoppingList.id = JQuery(listsRow).attr('id');
                props.initializeListEditor(oldShoppingList);
            },
            onchange: (event) => {
                let oldShoppingList = this.state.updateList;
                oldShoppingList.data = event.target.value;
                this.setState({updateList: oldShoppingList});
            },
            onblur: (event) => {
                const updatedList = Object.assign({}, this.state.updateList);
                props.updateShoppingList(updatedList).then(() => {
                    showNotification('success', 'Update Successful');
                }).catch((error) => {
                    showNotification('error', error);
                });
            },
            listToUpdate: this.state.updateList
        };

    }

    componentDidMount(){
        this.props.loadShoppingLists();
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.loading !== this.state.loading){
            this.setState({
                loading: nextProps.loading
            });
        }
        if(nextProps.existingShoppingList !== this.state.existingShoppingList){
            this.setState({
                existingShoppingList: nextProps.existingShoppingList
            });
            destroyDataTable('#shoppinglistTable');
        }

        if(nextProps.updateList !== this.state.updateList){
            if(nextProps.updateList.type === "list" || nextProps.updateList.type === "") {
                this.setState({updateList: nextProps.updateList});
                this.editList.listToUpdate = nextProps.updateList;
            }
        }
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.existingShoppingList !== this.state.existingShoppingList) {
            initializeDataTable('#shoppinglistTable');
        }
    }

    updateListState = (event) => {
        const field = event.target.name;
        let newShoppingList = this.state.newShoppingList;
        newShoppingList[field] = event.target.value;
        return this.setState({newShoppingList: newShoppingList});
    };

    deleteList = (event) => {
        const listsRow = JQuery(event.target).closest('tr');
        const shoppingList = JQuery(listsRow).find('.list-title').text();
        const listsId = JQuery(event.target).closest('tr').attr('id');
        confirmAlert({
            title: 'Confirm Delete',
            message: 'Are you sure to delete  `'+shoppingList+'`?',
            confirmLabel: 'Confirm',
            cancelLabel: 'Cancel',
            onConfirm: () => {
                this.props.deleteShoppingList(listsId)
                    .then(() => {
                        showNotification('success', '`'+shoppingList+'` has been deleted.');
                    }).catch(error => {
                    showNotification('error', error);
                });
            },
            onCancel: () => {}
        });
    };

    createShoppingList = (event) => {
        event.preventDefault();
        this.props.createList(this.state.newShoppingList)
            .then(() => {
                showNotification('success', this.state.newShoppingList.title +' has been created.');
        }).catch(error => {
            showNotification('error', error);
        });
    };


    render(){
        return(
            <div className="mid-center">
                <h3>My shopping-lists</h3>
                <LogoutBtn />
                {this.state.loading && <LoadingAnimation />}
                <div id="shoppinglist">
                    <ListsTable
                        editHandler={this.editList}
                        deleteHandler={this.deleteList}
                        loading={this.state.loading}
                        lists={this.state.existingShoppingList}/>
                    <br />
                    <CreateListForm
                        onSubmit={this.createShoppingList}
                        onChange={this.updateListState}
                        loading={this.state.loading}
                        list={this.state.newShoppingList} />
                </div>
            </div>

        );
    }
}


Lists.propTypes = {
    existingShoppingList: PropTypes.array,
    updateList: PropTypes.object,
    loading: PropTypes.bool,
    newShoppingList: PropTypes.object,
    createList: PropTypes.func,
    deleteShoppingList: PropTypes.func,
    initializeListEditor: PropTypes.func,
    updateShoppingList: PropTypes.func,
    loadShoppingLists: PropTypes.func
};


function mapStateToProps(state) {
    return {
        newShoppingList: state.lists.newShoppingList,
        updateList: state.edit,
        existingShoppingList: state.lists.existingShoppingList,
        loading: state.ajaxCallsInProgress > 0
    };
}

function mapDispatchToProps(dispatch) {
    return {
        deleteShoppingList: bindActionCreators(listActions.deleteShoppingList, dispatch),
        updateShoppingList: bindActionCreators(listActions.updateShoppingList, dispatch),
        loadShoppingLists: bindActionCreators(listActions.loadShoppingLists, dispatch),
        createList : bindActionCreators(listActions.createList, dispatch),
        initializeListEditor : bindActionCreators(listActions.initializeListEditor, dispatch)
    };
}


export default connect(mapStateToProps, mapDispatchToProps) (Lists);