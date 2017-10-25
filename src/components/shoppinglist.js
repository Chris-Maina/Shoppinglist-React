import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Container from 'muicss/lib/react/container';
import Row from 'muicss/lib/react/row';
import Col from 'muicss/lib/react/col';
import Input from 'muicss/lib/react/input';
import { Card, Button } from 'react-materialize';
import Form from 'muicss/lib/react/form';
import './shoppinglist.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Navigation from './navbar';


class ShoppinglistPage extends Component {
    constructor(props) {
        super(props);
        this.state = { shoppinglists: [], next_page: '', previous_page: '' };
        this.getShoppinglists = this.getShoppinglists.bind(this);
        this.handelShoppinglistNameSubmit = this.handelShoppinglistNameSubmit.bind(this);
        this.handleDeleteShoppinglist = this.handleDeleteShoppinglist.bind(this);
        this.deleteShoppinglist = this.deleteShoppinglist.bind(this);
        this.handleEditShoppinglist = this.handleEditShoppinglist.bind(this);
        this.editShoppinglist = this.editShoppinglist.bind(this);
        this.searchShoppinglist = this.searchShoppinglist.bind(this);
        this.handleSearchShoppinglist = this.handleSearchShoppinglist.bind(this);

    }
    componentDidMount() {
        this.getShoppinglists();
    }
    getShoppinglists() {
        // Send GET request
        const url = 'https://shoppinglist-restful-api.herokuapp.com/shoppinglists/';
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
            console.log(response.data.shopping_lists);
            this.setState({
                shoppinglists: response.data.shopping_lists,
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
                console.log('Error', JSON.stringify(error.message));
            }
            console.log(error.config);
        });
    }
    handleDeleteShoppinglist(shoppinglistname, sl_id) {
        // DELETE request
        this.deleteShoppinglist(shoppinglistname, sl_id);
    }
    deleteShoppinglist(shoppinglistname, sl_id) {
        // DELETE
        var data = { name: shoppinglistname };
        const url = 'https://shoppinglist-restful-api.herokuapp.com/shoppinglists/' + sl_id;
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
            toast.success("Shoppinglist " + shoppinglistname + " deleted.");
            // Get ALL shopping list
            this.getShoppinglists();
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

    handleEditShoppinglist(shoppinglistname, sl_id) {
        // PUT request
        this.editShoppinglist(shoppinglistname, sl_id);
    }
    editShoppinglist(shoppinglistname, sl_id) {
        // PUT
        var data = { name: shoppinglistname };
        const url = 'https://shoppinglist-restful-api.herokuapp.com/shoppinglists/' + sl_id;
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
            toast.success("Shoppinglist edited to " + response.data.name);
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
        // Get ALL shopping list
        this.getShoppinglists();
    }
    handelShoppinglistNameSubmit(shoppinglistname) {
        // POST request
        this.postShoppinglist(shoppinglistname);

    };
    postShoppinglist(shoppinglistname) {
        // Send POST request
        var data = { name: shoppinglistname };
        const url = 'https://shoppinglist-restful-api.herokuapp.com/shoppinglists/';
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
            toast.success("Shoppinglist " + response.data.name + " created");
            // Get ALL shopping list
            this.getShoppinglists();
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
    handleSearchShoppinglist(searchText){
        this.searchShoppinglist(searchText);
    }
    searchShoppinglist(searchText){
        // Send GET request
        const url = 'https://shoppinglist-restful-api.herokuapp.com/shoppinglists/?q='+ searchText;
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
                shoppinglists: response.data,
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
        return (
            <div>
                <Navigation />
                <div className="pagecontent">
                    <Container  >
                        <ToastContainer />

                        <ToggleableShoppingForm
                            formSubmit={this.handelShoppinglistNameSubmit}
                            onSearchSubmit={this.handleSearchShoppinglist} />
                        <AllShoppinglists
                            shopping_lists={this.state.shoppinglists}
                            editFormSubmit={this.handleEditShoppinglist}
                            deleteSubmit={this.handleDeleteShoppinglist} />
                        <NextPreviousPage
                            next_page={this.state.next_page}
                            prev_page={this.state.previous_page} />
                    </Container>
                </div>
            </div>
        );
    }
}
class NextPreviousPage extends Component {
    render() {
        if (this.props.prev_page !== "None") {
            return (
                <Row>
                    <Col xs="8" xs-offset="2" md="8" md-offset="2">
                        <Button className='orange' waves='light' size="small" ><Link to={this.props.prev_page}>Previous Page</Link></Button>
                    </Col>
                </Row>
            );
        }
        else if (this.props.next_page !== 'None') {
            return (
                <Row>
                    <Col xs="8" xs-offset="2" md="8" md-offset="2">

                        <Button className='orange' waves='light' size="small" ><Link to={this.props.next_page}>Next Page</Link></Button>
                    </Col>
                </Row>
            );
        }
        else if (this.props.prev_page !== 'None' & this.props.next_page !== 'None') {
            return (
                <Row>
                    <Col xs="8" xs-offset="2" md="8" md-offset="2">
                        <Button className='orange' waves='light' size="small" ><Link to={this.props.prev_page}>Previous Page</Link></Button>
                        <Button className='orange' waves='light' size="small" ><Link to={this.props.next_page}>Next Page</Link></Button>
                    </Col>
                </Row>
            );
        }
        return (
            <Row>
                <Col xs="8" xs-offset="2" md="8" md-offset="2">
                    <Button className='orange' waves='light' size="small" >Previous Page</Button>
                    <Button className='orange space' waves='light' size="small" >Next Page</Button>
                </Col>
            </Row>
        );
    }
}
class ToggleableShoppingForm extends Component {
    constructor(props) {
        super(props);
        this.state = { isOpen: false, isSearchOpen: false };
        this.handleFormOpen = this.handleFormOpen.bind(this);
        this.handleFormClose = this.handleFormClose.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleSearchOpen = this.handleSearchOpen.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSearchClose = this.handleSearchClose.bind(this);
    }
    handleFormSubmit(shoppinglistname) {
        this.props.formSubmit(shoppinglistname);
        this.setState({ isOpen: false });
    }
    handleFormClose() {
        this.setState({ isOpen: false });
    }
    handleFormOpen() {
        this.setState({ isOpen: true });
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
                <ShoppinglistForm
                    onFormSubmit={this.handleFormSubmit}
                    onFormClose={this.handleFormClose} />
            );
        } else if (isSearchOpen) {
            return (
                <SearchShoppinglist
                    onCancelClick={this.handleSearchClose}
                    onSearchSubmit={this.handleSearch} />
            );
        }
        else {
            return (
                <Row>
                    <Col xs="8" xs-offset="2" md="8" md-offset="2">
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
class AllShoppinglists extends Component {
    render() {
        if (typeof (this.props.shopping_lists) === 'string') {
            return (
                <EditableShoppinglist
                    shoppinglist={this.props.shopping_lists} />
            );

        }
        const shopping_lists = this.props.shopping_lists.map((oneshoppinglist) => (
            <div>
                <EditableShoppinglist
                    key={oneshoppinglist.id}
                    sl_id={oneshoppinglist.id}
                    name={oneshoppinglist.name}
                    editFormSubmit={this.props.editFormSubmit}
                    deleteSubmit={this.props.deleteSubmit} />
            </div>
        ));
        return (
            <div>
                {shopping_lists}
            </div>
        );
    }
}
class EditableShoppinglist extends Component {
    constructor(props) {
        super(props);
        this.state = { editForm: false }
        this.handelEditBtnClick = this.handelEditBtnClick.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleDeleteBtnClick = this.handleDeleteBtnClick.bind(this);
    }
    handelEditBtnClick() {
        this.setState({ editForm: true });
    }
    handleDeleteBtnClick() {
        this.props.deleteSubmit(this.props.name, this.props.sl_id);
    }
    handleFormSubmit(shoppinglistname) {
        this.props.editFormSubmit(shoppinglistname, this.props.sl_id);
        this.setState({ editForm: false });
    }
    handleFormClose() {
        this.setState({ editForm: false });
    }
    render() {
        if (this.props.shoppinglist) {
            return (
                <Row>
                    <Col xs="8" xs-offset="2" md="8" md-offset="2">
                        <Card textClassName='white-text' title={this.props.shoppinglist}>
                        </Card>
                    </Col>
                </Row>
            );
        }

        if (this.state.editForm) {
            return (
                <ShoppinglistForm
                    name={this.props.name}
                    sl_id={this.props.sl_id}
                    onFormSubmit={this.handleFormSubmit}
                    onFormClose={this.handleFormClose}
                />

            );
        } else {
            return (
                <Shoppinglist
                    name={this.props.name}
                    sl_id={this.props.sl_id}
                    onEditSubmit={this.handelEditBtnClick}
                    onDeleteSubmit={this.handleDeleteBtnClick} />
            );
        }
    }

}
class Shoppinglist extends Component {
    render() {
        return (
            <div>
                <Row>
                    <Col xs="8" xs-offset="2" md="8" md-offset="2">
                        <div>
                            <Card className='blue-grey darken-1' textClassName='white-text' title={this.props.name}
                                actions={[<Link to={`/shoppinglists/${this.props.sl_id}/items`}>Add Item</Link>]}>

                                <br />
                                <Button color="primary" size="small" onClick={this.props.onEditSubmit}>Edit</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                                <Button className="red" size="small" onClick={this.props.onDeleteSubmit}>Delete</Button>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

class ShoppinglistForm extends Component {
    constructor(props) {
        super(props);
        this.state = { name: '' };
        this.onInputChange = this.onInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    };
    componentDidMount() {
        this.setState({ name: this.props.name });
    }
    onInputChange(evt) {
        evt.preventDefault();
        this.setState({ name: evt.target.value });
    }
    handleSubmit(evt) {
        evt.preventDefault();
        this.props.onFormSubmit(this.state.name);
    };
    render() {
        const submittext = this.props.name ? 'Update' : 'Create';
        return (
            <Row>
                <Col xs="8" xs-offset="2" md="8" md-offset="2">
                    <div>
                        <Form onSubmit={this.handelsubmit}>
                            <Input label='Shoppinglist name' name='shoppinglistname' value={this.state.name} onChange={this.onInputChange} floatingLabel={true} type="text" required></Input>
                            <Button color="primary" size="large" onClick={this.handleSubmit}>{submittext}</Button>
                            <Button className="red" size="large" onClick={this.props.onFormClose}>Cancel</Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        );
    }
}
class SearchShoppinglist extends Component {
    constructor(props){
        super(props);
        this.state = { searchText: '' };
        this.handleSearch = this.handleSearch.bind(this);
        this.onSearchInputChange = this.onSearchInputChange.bind(this);
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
    render() {
        return (
            <Row>
                <Col xs="8" xs-offset="2" md="8" md-offset="2">
                    <div>
                        <Form onSubmit={this.handleSearch}>
                            <Input label="Search shoppinglist" floatingLabel={true} type="text"  name='searchtext' value={this.state.searchText} onChange={this.onSearchInputChange}></Input>
                            <Button color="primary" size="small" onClick={this.handleSearch}>Search</Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Button className="red" size="small" onClick={this.props.onCancelClick}>Cancel</Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        );
    }
}

export default ShoppinglistPage;