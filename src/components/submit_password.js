import React, { Component } from 'react';
import Container from 'muicss/lib/react/container';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { Button, Row, Col, Input, Card } from 'react-materialize';
import Form from 'muicss/lib/react/form';
import './forgot_password.css';
import { Navigation } from './navbar';
import { Redirect } from 'react-router-dom';


export class SubmitPassword extends Component {
    constructor(props) {
        super(props);
        this.state = { newPassword: '', cNewPassword: '', redirect: false };
    }
    handleInputChange = (evt) => {
        evt.preventDefault();
        let fields = {}
        fields[evt.target.name] = evt.target.value;
        this.setState(fields);
    }
    handleSubmit = (evt) => {
        evt.preventDefault();
        var formError = '';
        formError = this.validate(this.state.newPassword, this.state.cNewPassword);
        if (formError) {
            return toast.error(formError);
        }
        this.resetPassword(this.state.newPassword)
    }
    validate(pwd, cpwd) {
        var errors = '';
        if (pwd !== cpwd) {
            errors = "Password mismatch";
            return errors;
        }
        if (cpwd.length === 0 || pwd.length === 0) {
            errors = "Please fill in all the fields";
            return errors;
        }
    }
    resetPassword = (pwd) => {
        var data = { "password": pwd }
        const url = 'https://shoppinglist-restful-api.herokuapp.com' + this.props.match.url;
        axios({
            method: "put",
            url: url,
            headers: {
                'Content-Type': 'application/json',
            },
            data: data
        }).then((response) => {
            toast.success(response.data.message);
            this.setState({ redirect: true });
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
        const redirect = this.state.redirect;
        if (redirect) {
            return <Redirect to="/auth/login/" />
        }
        return (
            <div>
                <Navigation />
                <div className="page_content">
                    <Container fluid={true} >
                        <ToastContainer />
                        <Row>
                            <Col s={12} m={8} offset="m2">
                                <Card
                                    className="mui--text-center card_forgot_password "
                                    textClassName='grey lighten-4 teal-text'
                                >
                                    <Row>
                                        <h4>Reset Password</h4>
                                        <Form onSubmit={this.handleSubmit}>
                                            <Input label="New password" className="black-text" validate type='password' name="newPassword" onChange={this.handleInputChange}></Input>
                                            <Input label="Confirm password" className="black-text" validate type='password' name="cNewPassword" onChange={this.handleInputChange}></Input><br />
                                            <Button size="small" waves='light'>Reset </Button>
                                        </Form>
                                    </Row>

                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        );
    }
}
export default SubmitPassword;
