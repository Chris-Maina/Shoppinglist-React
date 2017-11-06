import React, { Component } from 'react';
import Container from 'muicss/lib/react/container';
import axios from 'axios';
import { Button, Row, Col, Input, Icon, Card } from 'react-materialize';
import Form from 'muicss/lib/react/form';
import { ToastContainer, toast } from 'react-toastify';
import {LoginForm }from './login';
import './forgot_password.css';

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = { redirect: false, email:'' };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.emailSubmit = this.emailSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    handleInputChange(evt){
        evt.preventDefault();
        this.setState({ email: evt.target.value });
    }
    handleSubmit(evt){
        evt.preventDefault();
        this.emailSubmit(this.state.email);
    }
    emailSubmit(user_email){
        // Send POST request
        var data = {email: user_email};
        const url = 'https://shoppinglist-restful-api.herokuapp.com/user/reset';
        axios({
            method: "post",
            url: url,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        }).then((response) => {
            console.log(response.data);
            toast.success("Email sent successfully ");
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
        let redirect = this.state.redirect;
        if (redirect) {
            return (
                <LoginForm />
            );
        }
        return (
            <div className="page_content">
                <Container fluid={true} >
                    <ToastContainer />
                    <Row>
                        <Col s={12} m={8} offset="m2">
                            <Card
                                className="mui--text-center card_forgot_password "
                                textClassName='yellow-text'
                                actions={<Button size="small" >THANK YOU</Button>}>
                                <Row>
                                    <h4>Forgot Password?</h4>
                                    <span className="black-text">Not to worry, we got you! Let's get you a new password ! Just provide your email address below</span><br />
                                    <Form onSubmit={this.handleSubmit}>
                                        <Input s={6} label="Email" className="black-text" validate type='email' name="email" onChange={this.handleInputChange}><Icon>email</Icon></Input><br/>
                                        <Button s={6} size="small" waves='light'>Submit </Button>
                                    </Form> 
                                </Row>

                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }

}
export default ForgotPassword;