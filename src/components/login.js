import React, { Component } from 'react';
import './register.css';
import Form from 'muicss/lib/react/form';
import Input from 'muicss/lib/react/input';
import Button from 'muicss/lib/react/button';
import Panel from 'muicss/lib/react/panel';

class LoginPage extends Component {
    render() {
        return (
            <div >
                <LoginForm
                    title="Login"
                    buttonClass="btn-login" />
            </div>
        );
    }
}
class LoginForm extends Component {
    render() {
        return (

            <Panel className="panel-login RegisterForm">
                <div className="panel-heading">
                    <h5 className="mui--text-title">Login</h5>
                    <hr />
                </div>
                <Form >
                    <Input label=' Email ' floatingLabel={true} type="email" required ></Input>

                    <Input label=' Password ' floatingLabel={true} type="password" required ></Input>

                    <Button variant="raised" large className="btn-login"  >{this.props.title}</Button>
                    <div className="mui--text-center">
                        <a href="/auth/register" class="forgot-password">Don't have an account?Register</a>
                    </div>
                </Form>

            </Panel>

        );
    }
}
export default LoginPage;