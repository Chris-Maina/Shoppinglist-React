import React, { Component } from 'react';
import './register.css';
import Form from 'muicss/lib/react/form';
import Input from 'muicss/lib/react/input';
import Button from 'muicss/lib/react/button';
import Panel from 'muicss/lib/react/panel';
import fetch from 'isomorphic-fetch';

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
        this.state = { username: '', email: '', password: '', cpassword: '', errors: [] };
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
        var errors = '';
        errors = this.validate(this.state.username, this.state.email, this.state.password, this.state.cpassword)
        if (errors.length > 0) {
            this.setState({ errors })

        }
        else {
            this.sendRequest(this.state.email, this.state.password)
            evt.preventDefault();
            this.setState({ username: '', email: '', password: '', cpassword: '' });
        }
    }
    validate(username, email, password, cpassword) {
        var errors = [];
        if (password !== cpassword) {
            errors.push("Password mismatch");
            return errors;
        }
        if (password.length < 6) {
            errors.push("Password length should be atleast 6 characters long");
            return errors;
        }
    }
    sendRequest(email, password) {
        var data = { "email": email, "password": password }
        fetch('http://localhost:5000/auth/register/', {
            method: 'post',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Orgin':'http://localhost:5000/auth/register/',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            },
            body: JSON.stringify(data)
        }).then(function (response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            console.log(response.json());
            return response.json();
        }).then(function (data) {
            // data from the resource
            console.log(data);
        }).catch(function (error) {
            console.log(error);
        });
    }
    render() {
        return (

            <Panel className="panel-login RegisterForm">
                <span style={{ color: 'red' }}>{this.state.errors}</span>
                <div className="panel-heading">
                    <h5 className="mui--text-title">{this.props.title}</h5>
                    <hr />
                </div>
                <Form onSubmit={this.handelsubmit}>
                    <Input label=' Username ' name="username" value={this.state.username} onChange={this.onInputChange} floatingLabel={true} required ></Input>

                    <Input label=' Email ' name="email" value={this.state.email} onChange={this.onInputChange} floatingLabel={true} type="email" required ></Input>

                    <Input label=' Password ' name="password" value={this.state.password} onChange={this.onInputChange} floatingLabel={true} type="password" required ></Input>

                    <Input label=' Confirm password ' name="cpassword" value={this.state.cpassword} onChange={this.onInputChange} floatingLabel={true} type="password" required></Input>

                    <Button variant="raised" large className="btn-register"  >{this.props.title}</Button>
                    <div className="mui--text-center">
                        <a href="/auth/login" class="forgot-password">Already have an account?Login</a>
                    </div>
                </Form>

            </Panel>

        );
    }
}
export default RegisterPage;
