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

class ShoppingItemsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shoppingitems: [], next_page: '', previous_page: ''
        }
    }
    componentDidMount() {
        this.getShoppinglistsItems();
        console.log(this.props.match)
    }
    getShoppinglistsItems() {
        // Send GET request
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
    render() {
        if (typeof (this.state.shoppingitems) === 'string') {
            return (
                <div className="pagecontent">
                    <Container >
                        <ToggleShoppingItem />
                        <Card textClassName='white-text' title={this.state.shoppingitems}>
                        </Card>
                    </Container>
                </div>
            );
        } else {
            return (

                <div className="pagecontent">
                    <Container >
                        <ToggleShoppingItem />
                        <ShoppingItemTable
                            items={this.state.shoppingitems} />
                    </Container>
                </div>
            );
        }

    }
}
class ToggleShoppingItem extends Component {
    constructor(props) {
        super(props);
        this.state = { isOpen: false };
        this.handleFormOpen = this.handleFormOpen.bind(this);
        this.handleFormClose = this.handleFormClose.bind(this);
    }
    handleFormOpen() {
        this.setState({ isOpen: true });
    }
    handleFormClose() {
        this.setState({ isOpen: false });
    }
    render() {
        if (this.state.isOpen) {
            return (
                <ShoppingItemForm
                    onCancleClick={this.handleFormClose} />
            );
        }
        else {
            return (
                <Row>
                    <Col xs="18" md="12">
                        <div>
                            <Button floating large className='orange' waves='light' icon='add' onClick={this.handleFormOpen} />
                        </div>
                    </Col>
                </Row>
            );
        }
    }
}
class ShoppingItemTable extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Row>
                <Col xs="18" md="12">
                    <div>
                        <Panel className="panel-login">
                            <table class="mui-table mui-table--bordered">
                                <TableHead />
                                <TableBody
                                    items={this.props.items} />
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
                    <th>Save Edit</th>
                    <th>Trash</th>
                </tr>
            </thead>
        );
    }
}
class TableBody extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const shoppingitems = this.props.items.map((item) =>
            <EditableShoppingItem
                key={item.id}
                name={item.name}
                price={item.price}
                quantity={item.quantity}
                onEditClick={this.handelFormOpen}
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
    }

    handelFormOpen() {
        this.setState({ editForm: true });
    }
    handleFormClose() {
        this.setState({ editForm: false });
    }
    render() {
        if (this.state.editForm) {
            return (
                <ShoppingItemForm
                    onCancelClick={this.handleFormClose} />
            );
        }
        return (
            <ShoppingItem
                name={this.props.name}
                price={this.props.price}
                quantity={this.props.quantity}
                onEditClick={this.handelFormOpen}
            />
        );
    }
}
class ShoppingItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <tr>
                <td> {this.props.name} </td>
                <td> {this.props.quantity} </td>
                <td> {this.props.price} </td>
                <td><Button color="primary" size="small" variant="raised" onClick={this.props.onEditClick}>Edit</Button></td>
                <td><Button color="primary" size="small" variant="raised">Delete</Button></td>
            </tr>
        );
    }
}
class ShoppingItemForm extends Component {
    render() {
        return (
            <Row>
                <Col xs="18" md="12">
                    <div>
                        <Form onSubmit={this.handelsubmit}>
                            <Input label='Item name' name='shoppingitemname' type="text" ></Input>
                            <Input label='Price' name='price' type="number" ></Input>
                            <Input label='Quantity' name='quantity' type="number" ></Input>
                            <Button color="primary" size="large" onClick={this.handleSubmit}>Create</Button>
                            <Button className="red" size="large" onClick={this.props.onCancelClick}>Cancel</Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        );
    }
}
export default ShoppingItemsPage;