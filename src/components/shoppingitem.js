import React, { Component } from 'react';
import { Route} from 'react-router-dom';
import Container from 'muicss/lib/react/container';
import Row from 'muicss/lib/react/row';
import Col from 'muicss/lib/react/col';
import Panel from 'muicss/lib/react/panel';
import Form from 'muicss/lib/react/form';
import Input from 'muicss/lib/react/input';
import { Button } from 'react-materialize';
import './shoppinglist.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { Navigation } from './navbar';
import requireLogin from './authenticate';
import { Spinner } from './spinner';

class ShoppingItemsPage extends Component {
    constructor(props) {
        super(props);
        this.state = { shoppingitems: [], next_page: '', previous_page: '', isLoading: false }
        this.handleShoppingItemCreate = this.handleShoppingItemCreate.bind(this);
        this.createShoppingItem = this.createShoppingItem.bind(this);
        this.editShoppingItem = this.editShoppingItem.bind(this);
        this.handleUpdateItem = this.handleUpdateItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.handleDeleteItem = this.handleDeleteItem.bind(this);
        this.searchShoppingItem = this.searchShoppingItem.bind(this);
        this.handleShoppingItemSearch = this.handleShoppingItemSearch.bind(this);
        this.handleShoppingItemsLimit = this.handleShoppingItemsLimit.bind(this);
        this.limitShoppingItems = this.limitShoppingItems.bind(this);
        this.handleNextClick = this.handleNextClick.bind(this);
        this.getNextPage = this.getNextPage.bind(this);
        this.handlePrevClick = this.handlePrevClick.bind(this);
        this.getPreviousPage = this.getPreviousPage.bind(this);
    }
    componentWillMount() {
        this.setState({ isLoading: true });
        this.getShoppinglistsItems();
    }
    getShoppinglistsItems() {
        // Send GET request
        // this.props.match.url = /shoppinglists/4/items from shoppinglist file
        axios({
            method: "get",
            url: this.props.match.url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token')
            }
        }).then((response) => {
            this.setState({ isLoading: false });
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
                toast.error(error.response.data.message);
                if(error.response.status === 408){
                    window.localStorage.removeItem('token');
                    return <Route exact path={`/shoppinglists/:sl_id/items`} component={requireLogin(ShoppingItemsPage)} />
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
        });
    }
    handleShoppingItemCreate(item) {
        this.createShoppingItem(item);
    }
    createShoppingItem(item) {
        // Send POST request
        let data = {
            name: item.shoppingitemname,
            price: item.price,
            quantity: item.quantity
        }
        axios({
            method: "post",
            url: this.props.match.url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token')
            },
            data: data
        }).then((response) => {
            toast.success("Shoppingitem " + response.data.name + " created");
            // Get all shopping items
            this.getShoppinglistsItems();
            return response.data;
        }).catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                toast.error(error.response.data.message);
                if(error.response.status === 408){
                    window.localStorage.removeItem('token');
                    return <Route exact ={true} path={`/shoppinglists/:sl_id/items`} component={requireLogin(ShoppingItemsPage)} />
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
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
        axios({
            method: "put",
            url: this.props.match.url + '/' + item.item_id,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token')
            },
            data: data
        }).then((response) => {
            toast.success("Successfully edited shopping item ");
            // Get all shopping items
            this.getShoppinglistsItems();
            return response.data;
        }).catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                toast.error(error.response.data.message);
                if(error.response.status === 408){
                    window.localStorage.removeItem('token');
                    return <Route exact ={true} path={`/shoppinglists/:sl_id/items`} component={requireLogin(ShoppingItemsPage)} />
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
        });

    }
    handleDeleteItem(shoppingitem, item_id) {
        this.deleteItem(shoppingitem, item_id);
    }
    deleteItem(shoppingitem, item_id) {
        var data = { name: shoppingitem }
        axios({
            method: "delete",
            url: this.props.match.url + '/' + item_id,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token')
            },
            data: data
        }).then((response) => {
            toast.success(response.data.message);
            // Get all shopping items
            this.getShoppinglistsItems();
            return response.data;
        }).catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                toast.error(error.response.data.message);
                if(error.response.status === 408){
                    window.localStorage.removeItem('token');
                    return <Route exact ={true} path={`/shoppinglists/:sl_id/items`} component={requireLogin(ShoppingItemsPage)} />
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
        });
    }
    handleShoppingItemSearch(searchtext) {
        this.searchShoppingItem(searchtext);
    }
    searchShoppingItem(searchtext) {
        // Send GET request
        axios({
            method: "get",
            url: this.props.match.url + '?q=' + searchtext,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token')
            }
        }).then((response) => {
            this.setState({
                shoppingitems: response.data
            });

            return response.data;
        }).catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                toast.error(error.response.data.message);
                if(error.response.status === 408){
                    window.localStorage.removeItem('token');
                    return <Route exact path={`/shoppinglists/:sl_id/items`} component={requireLogin(ShoppingItemsPage)} />
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
        });
    }
    handleShoppingItemsLimit(limitValue) {
        this.limitShoppingItems(limitValue);
    }
    limitShoppingItems(limitValue) {
        // Send GET request with limit parameter
        axios({
            method: "get",
            url: this.props.match.url + '?limit=' + limitValue,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token')
            }
        }).then((response) => {
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
                toast.error(error.response.data.message);
                if(error.response.status === 408){
                    window.localStorage.removeItem('token');
                    return <Route exact path={`/shoppinglists/:sl_id/items`} component={requireLogin(ShoppingItemsPage)} />
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
        });
    }

    handleNextClick() {
        this.getNextPage();
    }
    getNextPage() {
        // Send GET request with parameter page
        const next_page_url = this.state.next_page;
        axios({
            method: "get",
            url: next_page_url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token')
            }
        }).then((response) => {
            // console.log(response.data);
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
                toast.error(error.response.data.message);
                if(error.response.status === 408){
                    window.localStorage.removeItem('token');
                    return <Route exact path={`/shoppinglists/:sl_id/items`} component={requireLogin(ShoppingItemsPage)} />
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
        });
    }

    handlePrevClick() {
        this.getPreviousPage();
    }
    getPreviousPage() {
        // Send GET request with parameter page
        const prev_page_url = this.state.previous_page;
        axios({
            method: "get",
            url: prev_page_url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token')
            }
        }).then((response) => {
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
                toast.error(error.response.data.message);
                if(error.response.status === 408){
                    window.localStorage.removeItem('token');
                    return <Route exact path={`/shoppinglists/:sl_id/items`} component={requireLogin(ShoppingItemsPage)} />
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
        });
    }

    render() {
        const isLoading = this.state.isLoading;
        return (
            <div>
                <Navigation />
                <div className="pagecontent">
                { isLoading ? <Spinner/>: 
                    <Container >
                        <ToastContainer />
                        <ToggleShoppingItem
                            formSubmit={this.handleShoppingItemCreate}
                            onSearchSubmit={this.handleShoppingItemSearch}
                            onLimitSubmit={this.handleShoppingItemsLimit} />
                        <ShoppingItemTable
                            items={this.state.shoppingitems}
                            onUpdateSubmit={this.handleUpdateItem}
                            onDeleteClick={this.handleDeleteItem} />
                        <NextPreviousPage
                            next_page = {this.state.next_page}
                            prev_page = {this.state.previous_page}
                            onPrevClick={this.handlePrevClick}
                            onNextClick={this.handleNextClick} />
                    </Container>
                }
                </div>
            </div>
        );


    }
}

class NextPreviousPage extends Component {
    constructor(props) {
        super(props);
        this.handleNextClick = this.handleNextClick.bind(this);
        this.handlePrevClick = this.handlePrevClick.bind(this);
    }
    handlePrevClick(evt) {
        evt.preventDefault();
        this.props.onPrevClick();
    }
    handleNextClick(evt) {
        evt.preventDefault();
        this.props.onNextClick();
    }
    render() {
        return (
            <Row>
                <Col md="6" className="center">
                { this.props.prev_page === 'None'? '':
                    <Button className='teal next_prev_btn' waves='light' size="small" onClick={this.handlePrevClick}>Previous Page</Button>}
                </Col>
                <Col md="6" className="center">
                {this.props.next_page === 'None'? '':
                    <Button className='teal next_prev_btn' waves='light' size="small" onClick={this.handleNextClick}>Next Page</Button> }
                </Col>
            </Row>
        );
    }
}

class ToggleShoppingItem extends Component {
    constructor(props) {
        super(props);
        this.state = { isOpen: false, isSearchOpen: false, isLimitOpen: false };
    }
    handleFormOpen = () => {
        this.setState({ isOpen: true });
    }
    handleFormClose = () => {
        this.setState({ isOpen: false });
    }
    handleCreateSubmit = (item) => {
        this.props.formSubmit(item);
        this.setState({ isOpen: false });
    }
    handleSearchOpen = () => {
        this.setState({ isSearchOpen: true });
    }
    handleSearchClose = () => {
        this.setState({ isSearchOpen: false });
    }
    handleSearch = (searchText) => {
        this.props.onSearchSubmit(searchText);
        this.setState({ isSearchOpen: false });
    }
    handleLimitOpen = () => {
        this.setState({ isLimitOpen: true });
    }
    handleLimitClose = () => {
        this.setState({ isLimitOpen: false });
    }
    handleLimit = (limitValue) => {
        this.props.onLimitSubmit(limitValue);
        this.setState({ isLimitOpen: false });
    }
    render() {
        const isOpen = this.state.isOpen;
        const isSearchOpen = this.state.isSearchOpen;
        const isLimitOpen = this.state.isLimitOpen;
        if (isOpen) {
            return (
                <ShoppingItemForm
                    onCancelClick={this.handleFormClose}
                    formSubmit={this.handleCreateSubmit} />
            );
        }
        else if (isSearchOpen) {
            return (
                <SearchShoppingItem
                    onCancelClick={this.handleSearchClose}
                    onSearchSubmit={this.handleSearch} />
            );
        } else if (isLimitOpen) {
            return (
                <LimitShoppingItems
                    onLimitSubmit={this.handleLimit}
                    onCancelClick={this.handleLimitClose} />
            );
        }
        else {
            return (
                <Row>
                    <Col xs="18" md="12">
                        <div>

                            <Button floating fab='vertical' icon='expand_less' className='red' large style={{ bottom: '45px', right: '24px' }}>
                                <Button floating icon='add' className='blue' waves='light' onClick={this.handleFormOpen} />
                                <Button floating icon='filter_list' className='green ' waves='light' onClick={this.handleLimitOpen} />
                                <Button floating icon='search' className='orange' waves='light' onClick={this.handleSearchOpen} />
                            </Button>
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
                            <table className="mui-table mui-table--bordered">
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

        if (typeof (this.props.items) === 'string') {
            return (
                <EditableShoppingItem
                    items={this.props.items} />
            );
        }

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
    }

    handelFormOpen = () => {
        this.setState({ editForm: true });
    }
    handleFormClose = () => {
        this.setState({ editForm: false });
    }
    handleUpdateSubmit = (item) => {
        this.props.formSubmit(item);
        this.setState({ editForm: false });
    }
    handleDeleteClick = () => {
        this.props.onDeleteClick(this.props.name, this.props.item_id);

    }
    render() {
        if (this.props.items) {
            return (
                <tbody>
                    <tr>
                        <td>
                            {this.props.items}
                        </td>
                    </tr>
                </tbody>
            );
        }
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
                <td><Button floating className="teal" icon='mode_edit' size="small" onClick={this.props.onEditClick}></Button></td>
                <td><Button floating className="red" icon='delete' size="small" onClick={this.props.onDeleteClick}></Button></td>
            </tr>
        );
    }
}
class ShoppingItemForm extends Component {
    constructor(props) {
        super(props);
        this.state = { shoppingitemname: '', price: '', quantity: '' }
    }
    componentDidMount() {
        this.setState({ shoppingitemname: this.props.name, price: this.props.price, quantity: this.props.quantity });
    }
    onInputChange = (evt) => {
        evt.preventDefault();
        let fields = {};
        fields[evt.target.name] = evt.target.value;
        this.setState(fields);
    }
    handelsubmit = (evt) => {
        evt.preventDefault();
        this.props.formSubmit({
            item_id: this.props.item_id,
            shoppingitemname: this.state.shoppingitemname,
            price: this.state.price,
            quantity: this.state.quantity,
        });

    }
    handleCancelClick = (evt) => {
        evt.preventDefault();
        this.props.onCancelClick();
    }
    render() {
        const submittext = this.props.name ? 'Update' : 'Create';
        return (
            <Row>
                <Col xs="8" xs-offset="2" md="8" md-offset="2">

                    <Form onSubmit={this.handelsubmit}>
                        <Input label="Item name" name="shoppingitemname" value={this.state.shoppingitemname} type="text" onChange={this.onInputChange}></Input>
                        <Input label="Price" name="price" value={this.state.price} type="number" onChange={this.onInputChange}></Input>
                        <Input label="Quantity" name="quantity" value={this.state.quantity} type="number" onChange={this.onInputChange}></Input>
                        <Button color="primary" size="small" onClick={this.handleSubmit}>{submittext}</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                            <Button className="red" size="small" onClick={this.handleCancelClick}>Cancel</Button>
                    </Form>

                </Col>
            </Row>
        );
    }
}
class SearchShoppingItem extends Component {
    constructor(props) {
        super(props);
        this.state = { searchText: '' };
        this.handleSearch = this.handleSearch.bind(this);
        this.onSearchInputChange = this.onSearchInputChange.bind(this);
        this.handleCancelClick = this.handleCancelClick.bind(this);
    }
    componentDidMount() {
        this.setState({ searchText: this.props.searchText });
    }
    onSearchInputChange = (evt) => {
        evt.preventDefault();
        this.setState({ searchText: evt.target.value });
    }
    handleSearch = (evt) => {
        evt.preventDefault();
        this.props.onSearchSubmit(this.state.searchText);
    }
    handleCancelClick = (evt) => {
        evt.preventDefault();
        this.props.onCancelClick();
    }
    render() {
        return (
            <Row>
                <Col xs="8" xs-offset="2" md="8" md-offset="2">
                    <div>
                        <Form onSubmit={this.handleSearch}>
                            <Input label="Search shoppinglist" floatingLabel={true} type="text" name='searchtext' value={this.state.searchText} onChange={this.onSearchInputChange}></Input>
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

class LimitShoppingItems extends Component {
    constructor(props) {
        super(props);
        this.state = { limit_shoppingitem: '' };
    }
    componentDidMount() {
        this.setState({ limit: this.state.limit_shoppingitem })
    }
    onLimitInputChange = (evt) => {
        evt.preventDefault();
        this.setState({ limit_shoppingitem: evt.target.value })
    }
    handleLimitItems = (evt) => {
        evt.preventDefault();
        console.log(this.state.limit_shoppingitem);
        this.props.onLimitSubmit(this.state.limit_shoppingitem);
    }
    handleCancelClick = (evt) => {
        evt.preventDefault();
        this.props.onCancelClick();
    }
    render() {
        return (
            <Row>
                <Col xs="8" xs-offset="2" md="8" md-offset="2">
                    <div>
                        <Form onSubmit={this.handleLimitItems}>
                            <Input label="Limit value" floatingLabel={true} name='limit' value={this.state.limit_shoppingitem} onChange={this.onLimitInputChange} type="number"></Input>
                            <Button size="small" onClick={this.handleLimitItems}>Limit</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                            <Button className="red" size="small" onClick={this.handleCancelClick}>Cancel</Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        );
    }
}
export default ShoppingItemsPage;