import React, { Component } from 'react';
import Container from 'muicss/lib/react/container';
export class NoContent extends Component {
    render(){
        return(
            <div>
                <Container fluid={true} >
                    <div>
                        <h3 className="black-text">No Content</h3>
                    </div>
                </Container>
            </div>
        );
    }
        
}
export default NoContent;