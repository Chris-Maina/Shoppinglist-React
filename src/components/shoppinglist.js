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

class ShoppinglistPage extends Component {
    constructor(props) {
        super(props);
        this.state = { shoppinglists: [], next_page: '', previous_page: ''};
        this.getShoppinglists =  this.getShoppinglists.bind(this);
        this.handelCreateFormSubmit = this.handelCreateFormSubmit.bind(this);
        this.handleEditInputChange = this.handleEditInputChange.bind(this);

    }
    componentDidMount() {
        this.getShoppinglists();
    }
    getShoppinglists() {
        // Send GET request
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const url = 'https://shoppinglist-restful-api.herokuapp.com/shoppinglists/';
        axios({
            method: "get",
            url: proxyUrl + url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token')
            }
        }).then(function (response) {
            if (!response.statusText === 'OK') {
                toast.error(response.data.message)
            }
            console.log(response.data.shopping_lists);
            this.setState({ 
                shoppinglists: response.data.shopping_lists,
                next_page: response.data.next_page,
                previous_page: response.data.previous_page});
            
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
    handleEditInputChange(shoppinglistname) {
        this.setState({ shoppinglists: this.state.shoppinglists.push(shoppinglistname) });
    }
    handelCreateFormSubmit(shoppinglistname) {
        this.setState({
            shoppinglists: this.state.shoppinglists.concat(shoppinglistname)
        });
    };
    render() {
        return (
            
            <Container fluid={true} >
            <ToastContainer />
                <div className="pagecontent">
                <ToggleableShoppingForm
                    formSubmit={this.handelsubmit} />
                <AllShoppinglists
                    shopping_lists={this.state.shoppinglists}
                    formSubmit={this.handelsubmit} />
                </div>
            </Container>
            
        );
    }
}

class ToggleableShoppingForm extends Component {
    constructor(props) {
        super(props);
        this.state = { isOpen: false };
        this.handleFormOpen = this.handleFormOpen.bind(this);
        this.handleFormClose = this.handleFormClose.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
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
    render() {
        const isOpen = this.state.isOpen;
        if (isOpen) {
            return (
                <ShoppinglistForm
                    onFormSubmit={this.handleFormSubmit}
                    onFormClose={this.handleFormClose} />
            );
        } else {
            return (
                <Row>
                    <Col xs="18" md="12" >
                        <div>
                            <Button floating large className='orange' waves='light' icon='add' onClick={this.handleFormOpen} />
                        </div>
                    </Col>
                </Row>
            );
        }
    }
}
class AllShoppinglists extends Component {
    render() {
        const shopping_lists = this.props.shopping_lists.map((oneshoppinglist) => (
            <EditableShoppinglist
                key={oneshoppinglist.id}
                name={oneshoppinglist.name}
                formSubmit={this.props.formSubmit} />
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
    }
    handelEditBtnClick() {
        this.setState({ editForm: true });
    }
    handleFormSubmit(shoppinglistname) {
        this.props.formSubmit(shoppinglistname);
        this.setState({ editForm: false });
    }
    handleFormClose() {
        this.setState({ editForm: false });
    }
    render() {
        if (this.state.editForm) {
            return (
                <ShoppinglistForm
                    name={this.props.name}
                    onFormSubmit={this.handleFormSubmit}
                    onFormClose={this.handleFormClose}
                />

            );
        } else {
            return (
                <Shoppinglist
                    name={this.props.name}
                    onEditSubmit={this.handelEditBtnClick} />
            );
        }
    }

}
class Shoppinglist extends Component {
    render() {
        console.log(this.props.name);
        return (
            <Row>
                <Col xs="9" md="6">
                    <div>
                        <Card className='blue-grey darken-1' textClassName='white-text' title={this.props.name} actions={[<a href='/shoppingitem'>Add Item</a>]}>
                            <Button color="primary" size="small" onClick={this.props.onEditSubmit}>Edit</Button>
                            <Button className="red" size="small" >Delete</Button>
                        </Card>
                    </div>
                </Col>
            </Row>
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
        this.props.onFormSubmit({
            name: evt.target.shoppinglistname.value,
            id: 3
        });
    };
    render() {
        const submittext = this.props.name ? 'Update' : 'Create';
        return (
            <Row>
                <Col xs="9" md="6">
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
export default ShoppinglistPage;