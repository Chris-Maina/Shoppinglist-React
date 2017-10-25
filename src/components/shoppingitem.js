import React, { Component } from 'react';
import Container from 'muicss/lib/react/container';
import Row from 'muicss/lib/react/row';
import Col from 'muicss/lib/react/col';
import Panel from 'muicss/lib/react/panel';
import Form from 'muicss/lib/react/form';
import Input from 'muicss/lib/react/input';
import { Button, Card } from 'react-materialize';
import './shoppinglist.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Navigation from './navbar';

class ShoppingItemsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shoppingitems: [], next_page: '', previous_page: ''
        }
        this.handleShoppingItemCreate = this.handleShoppingItemCreate.bind(this);
        this.createShoppingItem = this.createShoppingItem.bind(this);
        this.editShoppingItem = this.editShoppingItem.bind(this);
        this.handleUpdateItem = this.handleUpdateItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.handleDeleteItem = this.handleDeleteItem.bind(this);
        this.searchShoppingItem = this.searchShoppingItem.bind(this);
        this.handleShoppingItemSearch = this.handleShoppingItemSearch.bind(this);
    }
    componentDidMount() {
        this.getShoppinglistsItems();
    }
    getShoppinglistsItems() {
        // Send GET request
        // this.props.match.url = /shoppinglists/4/items from shoppinglist file
        const url = 'https://shoppinglist-restful-api.herokuapp.com' + this.props.match.url;
        axios({
            method: "get",
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token')
            }
        }).then((response) => {
            if (!response.statusText === 'OK') {
                toast.error(response.data.message)
            }

            console.log(response.data.shopping_items);
            this.setState({
                shoppingitems: response.data.shopping_items,
                next_page: response.data.next_page,
                previous_page: response.data.previous_page
            });

            return response.data;
        }).catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                toast.error(error.response.data.message)
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        });
    }
    handleShoppingItemCreate(item) {
        this.createShoppingItem(item);
    }
    createShoppingItem(item) {
        // Send POST request
        var data = {
            name: item.shoppingitemname,
            price: item.price,
            quantity: item.quantity
        }
        const url = 'https://shoppinglist-restful-api.herokuapp.com' + this.props.match.url;
        axios({
            method: "post",
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token')
            },
            data: data
        }).then((response) => {
            if (!response.statusText === 'OK') {
                toast.error(response.data.message)
            }
            console.log(response.data);
            toast.success("Shoppingitem " + response.data.name + " created");
             // Get all shopping items
            this.getShoppinglistsItems();
            return response.data;
        }).catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                toast.error(error.response.data.message)
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        });
        
    }
    handleUpdateItem(item) {
        this.editShoppingItem(item);
    }
    editShoppingItem(item) {
        // send PUT request
        var data = {
            name: item.shoppingitemname,
            price: item.price,
            quantity: item.quantity
        }
        const url = 'https://shoppinglist-restful-api.herokuapp.com' + this.props.match.url + '/' + item.item_id;
        axios({
            method: "put",
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token')
            },
            data: data
        }).then((response) => {
            if (!response.statusText === 'OK') {
                toast.error(response.data.message)
            }
            console.log(response.data);
            toast.success("Successfully edited shopping item ");
             // Get all shopping items
            this.getShoppinglistsItems();
            return response.data;
        }).catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                toast.error(error.response.data.message)
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        });

    }
    handleDeleteItem(shoppingitem, item_id) {
        this.deleteItem(shoppingitem, item_id);
    }
    deleteItem(shoppingitem, item_id) {
        var data = { name: shoppingitem }
        const url = 'https://shoppinglist-restful-api.herokuapp.com' + this.props.match.url + '/' + item_id;
        axios({
            method: "delete",
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token')
            },
            data: data
        }).then((response) => {
            if (!response.statusText === 'OK') {
                toast.error(response.data.message)
            }
            console.log(response.data);
            toast.success(response.data.message);
             // Get all shopping items
            this.getShoppinglistsItems();
            return response.data;
        }).catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                toast.error(error.response.data.message)
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        });
    }
    handleShoppingItemSearch(searchtext){
        this.searchShoppingItem(searchtext);
    }
    searchShoppingItem(searchtext){
        // Send GET request
        const url = 'https://shoppinglist-restful-api.herokuapp.com' + this.props.match.url +'?q='+ searchtext;
        axios({
            method: "get",
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token')
            }
        }).then((response) => {
            if (!response.statusText === 'OK') {
                toast.error(response.data.message)
            }

            console.log(response.data);
            this.setState({
                shoppingitems: response.data
            });

            return response.data;
        }).catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                toast.error(error.response.data.message)
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        });
    }
    render() {
        if (typeof (this.state.shoppingitems) === 'string') {
            return (
                <div>
                    <Navigation />
                    <div className="pagecontent">
                        <Container >
                            <ToggleShoppingItem
                            formSubmit={this.handleShoppingItemCreate}/>
                            <Card textClassName='white-text' title={this.state.shoppingitems}>
                            </Card>
                        </Container>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <Navigation />
                    <div className="pagecontent">
                        <Container >
                            <ToastContainer />
                            <ToggleShoppingItem
                                formSubmit={this.handleShoppingItemCreate}
                                onSearchSubmit={this.handleShoppingItemSearch} />
                            <ShoppingItemTable
                                items={this.state.shoppingitems}
                                onUpdateSubmit={this.handleUpdateItem}
                                onDeleteClick={this.handleDeleteItem} />
                        </Container>
                    </div>
                </div>
            );
        }

    }
}
class ToggleShoppingItem extends Component {
    constructor(props) {
        super(props);
        this.state = { isOpen: false, isSearchOpen: false };
        this.handleFormOpen = this.handleFormOpen.bind(this);
        this.handleFormClose = this.handleFormClose.bind(this);
        this.handleCreateSubmit = this.handleCreateSubmit.bind(this);
        this.handleSearchOpen = this.handleSearchOpen.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSearchClose = this.handleSearchClose.bind(this);
    }
    handleFormOpen() {
        this.setState({ isOpen: true });
    }
    handleFormClose() {
        this.setState({ isOpen: false });
    }
    handleCreateSubmit(item) {
        this.props.formSubmit(item);
        this.setState({ isOpen: false });
    }
    handleSearchOpen() {
        this.setState({ isSearchOpen: true });
    }
    handleSearchClose() {
        this.setState({ isSearchOpen: false });
    }
    handleSearch(searchText){
        this.props.onSearchSubmit(searchText);
        this.setState({ isSearchOpen: false });
    }
    render() {
        const isOpen = this.state.isOpen;
        const isSearchOpen = this.state.isSearchOpen;
        if (isOpen) {
            return (
                <ShoppingItemForm
                    onCancelClick={this.handleFormClose}
                    formSubmit={this.handleCreateSubmit} />
            );
        }
        else if(isSearchOpen){
            return(
                <SearchShoppingItem
                onCancelClick={this.handleSearchClose}
                onSearchSubmit={this.handleSearch}/>
            );
        }
        else {
            return (
                <Row>
                    <Col xs="18" md="12">
                        <div>
                            <Button floating large className='orange' waves='light' icon='add' onClick={this.handleFormOpen} />

                            <Button floating large className='orange space' waves='light' icon='search' onClick={this.handleSearchOpen} />
                        </div>
                    </Col>
                </Row>
            );
        }
    }
}
class ShoppingItemTable extends Component {
    render() {
        return (
            <Row>
                <Col xs="18" md="12">
                    <div>
                        <Panel className="panel-login">
                            <table class="mui-table mui-table--bordered">
                                <TableHead />
                                <TableBody
                                    items={this.props.items}
                                    onUpdateSubmit={this.props.onUpdateSubmit}
                                    onDeleteClick={this.props.onDeleteClick} />
                            </table>
                        </Panel>
                    </div>
                </Col>
            </Row>
        );

    }
}
class TableHead extends Component {
    render() {
        return (
            <thead>
                <tr>
                    <th>Activity Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Edit</th>
                    <th>Trash</th>
                </tr>
            </thead>
        );
    }
}
class TableBody extends Component {
    render() {
        const shoppingitems = this.props.items.map((item) =>
            <EditableShoppingItem
                key={item.id}
                item_id={item.id}
                name={item.name}
                price={item.price}
                quantity={item.quantity}
                onEditClick={this.handelFormOpen}
                formSubmit={this.props.onUpdateSubmit}
                onDeleteClick={this.props.onDeleteClick}
            />
        );
        return (
            <tbody>
                {shoppingitems}
            </tbody>
        );
    }
}
class EditableShoppingItem extends Component {
    constructor(props) {
        super(props);
        this.state = { editForm: false }
        this.handelFormOpen = this.handelFormOpen.bind(this);
        this.handleFormClose = this.handleFormClose.bind(this);
        this.handleUpdateSubmit = this.handleUpdateSubmit.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
    }

    handelFormOpen() {
        this.setState({ editForm: true });
    }
    handleFormClose() {
        this.setState({ editForm: false });
    }
    handleUpdateSubmit(item) {
        this.props.formSubmit(item);
        this.setState({ editForm: false });
    }
    handleDeleteClick() {
        this.props.onDeleteClick(this.props.name, this.props.item_id);

    }
    render() {
        if (this.state.editForm) {
            return (
                <ShoppingItemForm
                    onCancelClick={this.handleFormClose}
                    item_id={this.props.item_id}
                    name={this.props.name}
                    price={this.props.price}
                    quantity={this.props.quantity}
                    onEditClick={this.handelFormOpen}
                    formSubmit={this.handleUpdateSubmit} />
            );
        }
        return (
            <ShoppingItem
                name={this.props.name}
                price={this.props.price}
                quantity={this.props.quantity}
                onEditClick={this.handelFormOpen}
                onDeleteClick={this.handleDeleteClick}
            />
        );
    }
}
class ShoppingItem extends Component {
    render() {
        return (
            <tr>
                <td> {this.props.name} </td>
                <td> {this.props.quantity} </td>
                <td> {this.props.price} </td>
                <td><Button color="primary" size="small" variant="raised" onClick={this.props.onEditClick}>Edit</Button></td>
                <td><Button color="primary" size="small" variant="raised" onClick={this.props.onDeleteClick}>Delete</Button></td>
            </tr>
        );
    }
}
class ShoppingItemForm extends Component {
    constructor(props) {
        super(props);
        this.state = { shoppingitemname: '', price: '', quantity: '' }
        this.onInputChange = this.onInputChange.bind(this);
        this.handelsubmit = this.handelsubmit.bind(this);
        this.handleCancelClick = this.handleCancelClick.bind(this);
    }
    componentDidMount() {
        this.setState({ shoppingitemname: this.props.name, price: this.props.price, quantity: this.props.quantity });
    }
    onInputChange(evt) {
        evt.preventDefault();
        let fields = {};
        fields[evt.target.name] = evt.target.value;
        this.setState(fields);
    }
    handelsubmit(evt) {
        evt.preventDefault();
        this.props.formSubmit({
            item_id: this.props.item_id,
            shoppingitemname: this.state.shoppingitemname,
            price: this.state.price,
            quantity: this.state.quantity,
        });

    }
    handleCancelClick(evt) {
        evt.preventDefault();
        this.props.onCancelClick();
    }
    render() {
        const submittext = this.props.name ? 'Update' : 'Create';
        return (
            <Row>
                <Col xs="18" md="12">
                    <div>
                        <Form onSubmit={this.handelsubmit}>
                            <Input label='Item name' name='shoppingitemname' type="text" value={this.state.shoppingitemname} onChange={this.onInputChange}></Input>
                            <Input label='Price' name='price' type="number" value={this.state.price} onChange={this.onInputChange}></Input>
                            <Input label='Quantity' name='quantity' type="number" value={this.state.quantity} onChange={this.onInputChange}></Input>
                            <Button color="primary" size="small" onClick={this.handleSubmit}>{submittext}</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                            <Button className="red" size="small" onClick={this.handleCancelClick}>Cancel</Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        );
    }
}
class SearchShoppingItem extends Component{
    constructor(props){
        super(props);
        this.state = { searchText: '' };
        this.handleSearch = this.handleSearch.bind(this);
        this.onSearchInputChange = this.onSearchInputChange.bind(this);
        this.handleCancelClick = this.handleCancelClick.bind(this);
    }
    componentDidMount(){
        this.setState({ searchText: this.props.searchText });
    }
    onSearchInputChange(evt){
        evt.preventDefault();
        this.setState({ searchText: evt.target.value });
    }
    handleSearch(evt){
        evt.preventDefault();
        this.props.onSearchSubmit(this.state.searchText);
    }
    handleCancelClick(evt) {
        evt.preventDefault();
        this.props.onCancelClick();
    }
    render(){
        return(
            <Row>
            <Col xs="8" xs-offset="2" md="8" md-offset="2">
                <div>
                    <Form onSubmit={this.handleSearch}>
                        <Input label="Search shoppinglist" floatingLabel={true} type="text"  name='searchtext' value={this.state.searchText} onChange={this.onSearchInputChange}></Input>
                        <Button color="primary" size="small" onClick={this.handleSearch}>Search</Button>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button className="red" size="small" onClick={this.handleCancelClick}>Cancel</Button>
                    </Form>
                </div>
            </Col>
        </Row>
        );
    }
}

export default ShoppingItemsPage;