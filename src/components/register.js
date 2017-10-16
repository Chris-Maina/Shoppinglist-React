import React, { Component } from 'react';
import { Redirect } from 'react-router';
import './register.css';
import Form from 'muicss/lib/react/form';
import Input from 'muicss/lib/react/input';
import Button from 'muicss/lib/react/button';
import Panel from 'muicss/lib/react/panel';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

class RegisterPage extends Component {

    render() {
        return (
            <div >
                <RegisterForm
                    title="Register"
                />
            </div>
        );
    }
}
class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = { username: '', email: '', password: '', cpassword: '', errors: '', redirect: false };
        this.handelsubmit = this.handelsubmit.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.validate = this.validate.bind(this);
    }

    onInputChange(evt) {
        evt.preventDefault();
        let fields = {};
        fields[evt.target.name] = evt.target.value;
        this.setState(fields);
    }
    handelsubmit(evt) {
        evt.preventDefault();
        var errors = '';
        errors = this.validate(this.state.username, this.state.email, this.state.password, this.state.cpassword)
        if (errors) {
            toast.error(errors)
            return this.setState({ errors })
        }
        // Send to server/API
        this.sendRequest(this.state.email, this.state.password)
        this.setState({ username: '', email: '', password: '', cpassword: '' });
    }
    validate(username, email, password, cpassword) {
        var errors = '';
        if (password !== cpassword) {
            errors = "Password mismatch";
            return errors;
        }
        // Regular expression to check for special characters
        var re = /[a-z]|[A-Z]|[0-9]|_/;
        // console.log(re.test(username))
        if (!re.test(username)) {
            errors = "Username cannot have special characters";
            return errors;
        }
    }
    sendRequest(email, password) {
        var data = { "email": email, "password": password }
        // const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const url = 'https://shoppinglist-restful-api.herokuapp.com/auth/register/';
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
            console.log(response.data);
            toast.success(response.data.message);
            this.setState({ redirect: true })
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
        if (this.state.redirect) {
            return <Redirect to="/auth/login/" />
        }
        return (
            <div>
                <ToastContainer />
                <Panel className="panel-login RegisterForm">
                    <div className="panel-heading">
                        <h5 className="mui--text-title">{this.props.title}</h5>
                        <hr />
                    </div>
                    <Form onSubmit={this.handelsubmit}>
                        <Input label=' Username ' name="username" value={this.state.username} onChange={this.onInputChange} floatingLabel={true} required ></Input>

                        <Input label=' Email ' name="email" value={this.state.email} onChange={this.onInputChange} floatingLabel={true} type="email" ></Input>

                        <Input label=' Password ' name="password" value={this.state.password} onChange={this.onInputChange} floatingLabel={true} type="password"  ></Input>

                        <Input label=' Confirm password ' name="cpassword" value={this.state.cpassword} onChange={this.onInputChange} floatingLabel={true} type="password" required></Input>

                        <Button variant="raised" large className="btn-register"  >{this.props.title}</Button>
                        <div className="mui--text-center">
                            <a href="/auth/login" class="forgot-password">Already have an account?Login</a>
                        </div>
                    </Form>

                </Panel>
            </div>
        );

    }
}
export default RegisterPage;
