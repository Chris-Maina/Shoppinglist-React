import React, { Component } from 'react';
import Container from 'muicss/lib/react/container';
import Row from 'muicss/lib/react/row';
import Col from 'muicss/lib/react/col';
import { Card, CardTitle, Button, Icon } from 'react-materialize';
import './shoppinglist.css';

class ShoppinglistPage extends Component {
    render() {
        return (
            <Container fluid={true} className="pagecontent">
                <Row>
                    <Col xs="18" md="12">
                        <div>
                            <Button floating large className='orange' waves='light' icon='add' />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs="9" md="6">
                        <div>
                            <Card className='small'
                                header={<CardTitle image='images/iloveshopping.png'>List name</CardTitle>}
                                actions={[<a href='/shoppingitem'>Add Item</a>]}
                            >
                                <Button color="primary" size="small" variant="raised">Edit</Button>
                                <Button color="primary" size="small" variant="raised">Delete</Button>
                            </Card>
                        </div>
                    </Col>
                    <Col xs="9" md="6">
                        <div>
                            <Card className='small'
                                header={<CardTitle image='images/trolley.png'>List name</CardTitle>}
                                actions={[<a href='/shoppingitem'>Add Item</a>]}
                            >
                                <Button color="primary" size="small" variant="raised">Edit</Button>
                                <Button color="primary" size="small" variant="raised">Delete</Button>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}
export default ShoppinglistPage;