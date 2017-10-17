import React, { Component } from 'react';
import Container from 'muicss/lib/react/container';
import Row from 'muicss/lib/react/row';
import Col from 'muicss/lib/react/col';
import Panel from 'muicss/lib/react/panel';
import Form from 'muicss/lib/react/form';
import Input from 'muicss/lib/react/input';
import { Button } from 'react-materialize';
import './shoppinglist.css';

class ShoppingItemsPage extends Component {
    render() {
        return (
            <div className="pagecontent">
                <Container >
                    <ToggleShoppingItem />
                    <ShoppingItemTable />
                </Container>
            </div>
        );
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

    render() {

        return (
            <Row>
                <Col xs="18" md="12">
                    <div>
                        <Panel className="panel-login">
                            <table class="mui-table mui-table--bordered">
                                <TableHead />
                                <TableBody />
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
            <tbody>
                <ShoppingItem
                    onEditClick={this.handelFormOpen} />
            </tbody>
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
                <td> Bread </td>
                <td>1</td>
                <td>10.0</td>
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