import React, { Component } from 'react';
import './register.css';
import { Redirect } from 'react-router-dom';
import Form from 'muicss/lib/react/form';
import Row from 'muicss/lib/react/row';
import Col from 'muicss/lib/react/col';
import Input from 'muicss/lib/react/input';
import Button from 'muicss/lib/react/button';
import Panel from 'muicss/lib/react/panel';
import { ToastContainer, toast } from 'react-toastify';
import { Navigation } from './navbar';
import { Spinner } from './spinner';
import 'react-toastify/dist/ReactToastify.min.css';
import axiosConfig from './baseConfig';

export class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = { email: '', password: '', isLoggedIn: false, isLoading: false };
        this.handelsubmit = this.handelsubmit.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.sendRequest = this.sendRequest.bind(this);
    }

    onInputChange(evt) {
        evt.preventDefault();
        let fields = {};
        fields[evt.target.name] = evt.target.value;
        this.setState(fields);
    }

    handelsubmit(evt) {
        evt.preventDefault();
        this.setState({ isLoading: true });
        // Send to server/API
        this.sendRequest(this.state.email, this.state.password)
        this.setState({ email: '', password: '' });
    }

    sendRequest(email, password) {
        var data = { "email": email, "password": password };
        axiosConfig.request({
            method: "post",
            url: `/auth/login/`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: data
        }).then((response) => {
            this.setState({ isLoading: false });
            toast.success(response.data.message);
            setTimeout(() => {
                // Load access token in local storage
                window.localStorage.setItem('token', response.data.access_token);
                this.setState({ isLoggedIn: true });
            }, 5000);
        }).catch((error) => {
            this.setState({ isLoading: false });
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                toast.error(error.response.data.message);
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', JSON.stringify(error.message));
            }
        });
    }
    render() {
        const isLoggedIn = this.state.isLoggedIn;
        const isLoading = this.state.isLoading;
        if (isLoggedIn) {
            return (
                <Redirect to="/shoppinglists/" />
            );
        }
        
        return (
            <div>
                <Navigation />
                <div className="pagecontent">
                    <ToastContainer />
                    <Row>
                        <Col xs="6" xs-offset="3" md="6" md-offset="3">
                            <Panel className="panel-login RegisterForm">
                                <div className="panel-heading">
                                    <h5 className="mui--text-title">Login</h5>
                                    <hr />
                                </div>
                                <Form onSubmit={this.handelsubmit}>
                                    <Input label=' Email ' name="email" value={this.state.email} onChange={this.onInputChange} floatingLabel={true} type="email" ></Input>

                                    <Input label=' Password ' name="password" value={this.state.password} onChange={this.onInputChange} floatingLabel={true} type="password"></Input>
                                    { isLoading ? <Spinner/>:
                                    <Button variant="raised" className="btn-login"  >Login</Button>
                                    }

                                </Form>
                                <div className="mui--text-center">
                                    <a href="/user/reset">Forgot Password?</a>
                                </div>
                                <div className="mui--text-center">
                                    <a href="/auth/register">Don't have an account?Register</a>
                                </div>
                            </Panel>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}