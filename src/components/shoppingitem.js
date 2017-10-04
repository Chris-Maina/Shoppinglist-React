import React, { Component } from 'react';
import Container from 'muicss/lib/react/container';
import Row from 'muicss/lib/react/row';
import Col from 'muicss/lib/react/col';
import Panel from 'muicss/lib/react/panel';
import { Button } from 'react-materialize';
import './shoppinglist.css';

class ShoppingItemsPage extends Component {
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
                    <Col xs="18" md="12">
                        <div>
                            <Panel className="panel-login">
                                <table class="mui-table mui-table--bordered">
                                    <thead>
                                        <tr>
                                            <th>Activity Name</th>
                                            <th>Save Edit</th>
                                            <th>Trash</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td> Bread </td>
                                            <td><Button color="primary" size="small" variant="raised">Edit</Button></td>
                                            <td><Button color="primary" size="small" variant="raised">Delete</Button></td>
                                        </tr>
                                        <tr>
                                            <td> Kimbo </td>
                                            <td><Button color="primary" size="small" variant="raised">Edit</Button></td>
                                            <td><Button color="primary" size="small" variant="raised">Delete</Button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Panel>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}
export default ShoppingItemsPage;