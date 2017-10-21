import React, { Component } from 'react';
import './register.css';
import { Link, Redirect } from 'react-router-dom';
import Form from 'muicss/lib/react/form';
import Row from 'muicss/lib/react/row';
import Col from 'muicss/lib/react/col';
import Input from 'muicss/lib/react/input';
import Button from 'muicss/lib/react/button';
import Panel from 'muicss/lib/react/panel';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

class LoginPage extends Component {
    render() {
        return (
            <div className="pagecontent">
                <ToastContainer />
                <Row>
                    <Col xs="6" xs-offset="3" md="6" md-offset="3">
                        <LoginForm
                            title="Login"
                            buttonClass="btn-login" />
                    </Col>
                </Row>
            </div>
        );
    }
}
class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = { email: '', password: '', redirect: false };
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
        // Send to server/API
        this.sendRequest(this.state.email, this.state.password)
        this.setState({ email: '', password: '' });
    }
    sendRequest(email, password) {
        var data = { "email": email, "password": password }
        // const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const url = 'https://shoppinglist-restful-api.herokuapp.com/auth/login/';
        axios({
            method: "post",
            url: url,
            headers: {
                'Content-Type': 'application/json',
            },
            data: data
        }).then(function (response) {
            if (!response.statusText === 'OK') {
                toast.error(response.data.message)
            }
            //console.log(response.data);
            // Load access token in local storage
            window.localStorage.setItem('token', response.data.access_token);
            // this.setState({ redirect: true });
            toast.success(response.data.message);
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
        console.log(this.state.redirect);
        const redirect = this.state.redirect;
        if (redirect) {
            return (
                <Redirect to="/shoppinglists/" from="/auth/login/" />
            );
        }
        return (
            <div>
                <Panel className="panel-login RegisterForm">
                    <div className="panel-heading">
                        <h5 className="mui--text-title">Login</h5>
                        <hr />
                    </div>
                    <Form onSubmit={this.handelsubmit}>
                        <Input label=' Email ' name="email" value={this.state.email} onChange={this.onInputChange} floatingLabel={true} type="email" ></Input>

                        <Input label=' Password ' name="password" value={this.state.password} onChange={this.onInputChange} floatingLabel={true} type="password"></Input>

                        <Button variant="raised" large className="btn-login"  >{this.props.title}</Button>
                        <div className="mui--text-center">
                            <Link to="/auth/register" class="forgot-password">Don't have an account?Register</Link>
                        </div>
                    </Form>

                </Panel>
            </div>
        );
    }
}
export default LoginPage;