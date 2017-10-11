import React, { Component } from 'react';
import Container from 'muicss/lib/react/container';
import Row from 'muicss/lib/react/row';
import Col from 'muicss/lib/react/col';
import Input from 'muicss/lib/react/input';
import { Card, CardTitle, Button } from 'react-materialize';
import './shoppinglist.css';

class ShoppinglistPage extends Component {
    render() {
        return (
            <Container fluid={true} className="pagecontent">
                <ToggleableShoppingForm 
                    isOpen={true} />
                <Shoppinglists/>
            </Container>
        );
    }
}
class Shoppinglists extends Component {
    render() {
        return (
            <div>
                <EditableShoppinglist
                    name='Easter shopping'
                    editForm={true} />
                <EditableShoppinglist
                    name='Back to school'
                    editForm={false} />
            </div>
        );
    }
}
class EditableShoppinglist extends Component {
    render() {
        if (this.props.editForm) {
            return (
                <Shoppinglist
                    name={this.props.name} />
            );
        } else {
            return (
                <ShoppinglistForm
                    name={this.props.name} />
            );
        }
    }

}
class Shoppinglist extends Component {
    render() {
        return (
            <Row>
                <Col xs="9" md="6">
                    <div>
                        <Card className='small'
                            header={<CardTitle image='images/iloveshopping.png'>{this.props.name}</CardTitle>}
                            actions={[<a href='/shoppingitem'>Add Item</a>]}
                        >
                            <Button color="primary" size="small" variant="raised">Edit</Button>
                            <Button color="primary" size="small" variant="raised">Delete</Button>
                        </Card>
                    </div>
                </Col>
            </Row>
        );
    }
}
class ShoppinglistForm extends Component {
    render() {
        const submittext = this.props.name ? 'Update' : 'Create';
        return (
            <Row>
                <Col xs="9" md="6">
                    <div>
                        <Input label=' Shoppinglist name ' floatingLabel={true} type="text" required value={this.props.name}></Input>

                        <Button color="primary" size="large" variant="raised" >{submittext}</Button>
                    </div>
                </Col>
            </Row>
        );
    }
}
class ToggleableShoppingForm extends Component {
    render() {
        if (this.props.isOpen) {
            return (

                <Row>
                    <Col xs="18" md="12">
                        <div>
                            <Button floating large className='orange' waves='light' icon='add' />
                        </div>
                    </Col>
                </Row>
            );
        } else {
            return (
                <ShoppinglistForm />
            );
        }
    }
}
export default ShoppinglistPage;