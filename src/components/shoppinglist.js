import React, { Component } from 'react';
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
import {Navigation} from './navbar';


export class ShoppinglistPage extends Component {
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
        this.getNextPage = this.getNextPage.bind(this);
        this.handleNextClick = this.handleNextClick.bind(this);
        this.getPreviousPage = this.getPreviousPage.bind(this);
        this.handlePrevClick = this.handlePrevClick.bind(this);
        this.handleLimitShoppinglists = this.handleLimitShoppinglists.bind(this);
        this.limitShoppinglists = this.limitShoppinglists.bind(this);

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
            console.log(response.data);
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
    handleSearchShoppinglist(searchText) {
        this.searchShoppinglist(searchText);
    }
    searchShoppinglist(searchText) {
        // Send GET request
        const url = 'https://shoppinglist-restful-api.herokuapp.com/shoppinglists/?q=' + searchText;
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
    handlePrevClick() {
        this.getPreviousPage();
    }
    getPreviousPage() {
        // Send GET request with parameter page
        const prev_page_url = this.state.previous_page;

        if (prev_page_url === 'None') {
            return toast.info("There are no shoppinglist in previous page");
        }
        const url = 'https://shoppinglist-restful-api.herokuapp.com' + prev_page_url;
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
                console.log('Error', error.message);
            }
            console.log(error.config);
        });
    }
    handleNextClick() {
        this.getNextPage();
    }
    getNextPage() {
        // Send GET request with parameter page
        const next_page_url = this.state.next_page;

        if (next_page_url === 'None') {
            return toast.info("There are no shoppinglist in next page");
        }
        const url = 'https://shoppinglist-restful-api.herokuapp.com' + next_page_url;
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
                console.log('Error', error.message);
            }
            console.log(error.config);
        });
    }

    handleLimitShoppinglists(limitValue) {
        this.limitShoppinglists(limitValue);
    }
    limitShoppinglists(limitValue) {
        // Send GET request with limit parameter
        const url = 'https://shoppinglist-restful-api.herokuapp.com/shoppinglists/?limit=' + limitValue;
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
                            onSearchSubmit={this.handleSearchShoppinglist}
                            onLimitSubmit={this.handleLimitShoppinglists} />
                        <AllShoppinglists
                            shopping_lists={this.state.shoppinglists}
                            editFormSubmit={this.handleEditShoppinglist}
                            deleteSubmit={this.handleDeleteShoppinglist} />
                        <NextPreviousPage
                            next_page={this.state.next_page}
                            prev_page={this.state.previous_page}
                            onPrevClick={this.handlePrevClick}
                            onNextClick={this.handleNextClick} />
                    </Container>
                </div>
            </div>
        );
    }
}
export class NextPreviousPage extends Component {
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
                <Col xs="8" xs-offset="2" md="8" md-offset="2">
                    <Button className='orange' waves='light' size="small" onClick={this.handlePrevClick}>Previous Page</Button>
                    <Button className='orange space' waves='light' size="small" onClick={this.handleNextClick}>Next Page</Button>
                </Col>
            </Row>
        );
    }
}
export class ToggleableShoppingForm extends Component {
    constructor(props) {
        super(props);
        this.state = { isOpen: false, isSearchOpen: false, isLimitOpen: false };
        this.handleFormOpen = this.handleFormOpen.bind(this);
        this.handleFormClose = this.handleFormClose.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleSearchOpen = this.handleSearchOpen.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSearchClose = this.handleSearchClose.bind(this);
        this.handleLimitOpen = this.handleLimitOpen.bind(this);
        this.handleLimit = this.handleLimit.bind(this);
        this.handleLimitClose = this.handleLimitClose.bind(this);
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
    handleSearch(searchText) {
        this.props.onSearchSubmit(searchText);
        this.setState({ isSearchOpen: false });
    }
    handleLimitOpen() {
        this.setState({ isLimitOpen: true });
    }
    handleLimitClose() {
        this.setState({ isLimitOpen: false });
    }
    handleLimit(limitValue) {
        this.props.onLimitSubmit(limitValue);
        this.setState({ isLimitOpen: false });
    }
    render() {
        const isOpen = this.state.isOpen;
        const isSearchOpen = this.state.isSearchOpen;
        const isLimitOpen = this.state.isLimitOpen;
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
        } else if (isLimitOpen) {
            return (
                <LimitShoppinglists
                    onLimitSubmit={this.handleLimit}
                    onCancelClick={this.handleLimitClose} />
            );
        }
        else {
            return (
                <Row>
                    <Col xs="8" xs-offset="2" md="8" md-offset="2">
                        <div>
                            <Button floating fab='vertical' icon='mode_edit' className='red' large style={{ bottom: '45px', right: '24px' }}>
                                <Button floating icon='add' id="add" className='blue' waves='light'  onClick={this.handleFormOpen} />
                                <Button floating icon='filter_list'id="filter" className='green' waves='light' onClick={this.handleLimitOpen} />
                                <Button floating icon='search' id="search" className='orange' waves='light'  onClick={this.handleSearchOpen} />
                            </Button>
                        </div>
                    </Col>
                </Row>
            );
        }
    }
}

export class AllShoppinglists extends Component {
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
export class EditableShoppinglist extends Component {
    constructor(props) {
        super(props);
        this.state = { editForm: false }
        this.handelEditBtnClick = this.handelEditBtnClick.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleDeleteBtnClick = this.handleDeleteBtnClick.bind(this);
        this.handleFormClose = this.handleFormClose.bind(this);
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
export class Shoppinglist extends Component {
    render() {
        return (
            <div>
                <Row>
                    <Col xs="8" xs-offset="2" md="8" md-offset="2">
                        <div>
                            <Card className='blue-grey darken-1' textClassName='white-text' title={this.props.name}
                                actions={[<a href={`/shoppinglists/${this.props.sl_id}/items`}>Add Item</a>]}>

                                <br />
                                <Button color="primary" id="edit" size="small" onClick={this.props.onEditSubmit}>Edit</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                                <Button className="red" id="delete" size="small" onClick={this.props.onDeleteSubmit}>Delete</Button>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export class ShoppinglistForm extends Component {
    constructor(props) {
        super(props);
        this.state = { name: '' };
        this.onInputChange = this.onInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancelClick = this.handleCancelClick.bind(this);
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
    handleCancelClick(evt) {
        evt.preventDefault();
        this.props.onFormClose();
    }
    render() {
        const submittext = this.props.name ? 'Update' : 'Create';
        return (
            <Row>
                <Col xs="8" xs-offset="2" md="8" md-offset="2">
                    <div>
                        <Form onSubmit={this.handelsubmit}>
                            <Input label="Shoppinglist name" name="shoppinglistname" value={this.state.name} onChange={this.onInputChange} floatingLabel={true} type="text" required></Input>
                            <Button color="primary" id="update_create" size="large" onClick={this.handleSubmit}>{submittext}</Button>
                            <Button className="red" id="cancel" size="large" onClick={this.handleCancelClick}>Cancel</Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        );
    }
}
export class SearchShoppinglist extends Component {
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
    onSearchInputChange(evt) {
        evt.preventDefault();
        this.setState({ searchText: evt.target.value });
    }
    handleSearch(evt) {
        evt.preventDefault();
        this.props.onSearchSubmit(this.state.searchText);
    }
    handleCancelClick(evt) {
        evt.preventDefault();
        this.props.onCancelClick();
    }
    render() {
        return (
            <Row>
                <Col xs="8" xs-offset="2" md="8" md-offset="2">
                    <div>
                        <Form onSubmit={this.handleSearch}>
                            <Input label="Search shoppinglist" floatingLabel={true} type="text" id='searchtext' name='searchtext' value={this.state.searchText} onChange={this.onSearchInputChange}></Input>
                            <Button color="primary" id='searchBtn' size="small" onClick={this.handleSearch}>Search</Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Button className="red" id='searchCancelBtn' size="small" onClick={this.handleCancelClick}>Cancel</Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        );
    }
}
export class LimitShoppinglists extends Component {
    constructor(props) {
        super(props);
        this.state = { limit: '' };
        this.onLimitInputChange = this.onLimitInputChange.bind(this);
        this.handleLimit = this.handleLimit.bind(this);
        this.handleCancelClick = this.handleCancelClick.bind(this);
    }
    componentDidMount() {
        this.setState({ limit: this.state.limit })
    }
    onLimitInputChange(evt) {
        evt.preventDefault();
        this.setState({ limit: evt.target.value })
    }
    handleLimit(evt) {
        evt.preventDefault();
        this.props.onLimitSubmit(this.state.limit);
    }
    handleCancelClick(evt) {
        evt.preventDefault();
        this.props.onCancelClick();
    }
    render() {
        return (
            <Row>
                <Col xs="8" xs-offset="2" md="8" md-offset="2">
                    <div>
                        <Form onSubmit={this.handleLimit}>
                            <Input label="Limit value" floatingLabel={true} name='limit' value={this.state.limit} onChange={this.onLimitInputChange} type="number"></Input>
                            <Button size="small" id='limit' onClick={this.handleLimit}>Limit</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                            <Button className="red" id='limitCancel' size="small" onClick={this.handleCancelClick}>Cancel</Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        );
    }
}
