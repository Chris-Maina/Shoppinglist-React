import React from 'react';
import { Row, Col, Preloader } from 'react-materialize';

export function Spinner() {
    var centerSpinner = {
        textAlign: 'center'
    };
    return (
        <div>
            <Row>
                <Col s={12} style={centerSpinner}>
                    <Preloader flashing size='big' />
                </Col>
            </Row>
        </div>
    );
}