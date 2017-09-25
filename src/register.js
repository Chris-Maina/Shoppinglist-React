import React, { Component } from 'react';
import './register.css';
import Form from 'muicss/lib/react/form';
import Input from 'muicss/lib/react/input';
import Button from 'muicss/lib/react/button';
import Panel from 'muicss/lib/react/panel';

class RegisterPage extends Component {
    render() {
        return (
            <div >
                <RegisterForm 
                title="Register"
                buttonClass="btn-register"/>
            </div>
        );
    }
}
class RegisterForm extends Component {
    render() {
        return (

            <Panel className="panel-login RegisterForm">
                    <div className="panel-heading">
                        <h5 className="mui--text-title">{this.props.title}</h5>
                    <hr/>
                    </div>
                    <Form >
                        <Input label=' Username ' floatingLabel={true} required ></Input>

                        <Input label=' Email ' floatingLabel={true} type="email" required ></Input>

                        <Input label=' Password ' floatingLabel={true} type="password" required ></Input>

                        <Input label=' Confirm password ' floatingLabel={true} type="password" required></Input>

                        <Button variant="raised" large className={this.props.buttonClass}  >{this.props.title}</Button>
                        <div className="mui--text-center">
                            <a href="/auth/login" class="forgot-password">Already have an account?Login</a>
                        </div>
                    </Form>
               
            </Panel>

        );
    }
}
export default RegisterPage;
