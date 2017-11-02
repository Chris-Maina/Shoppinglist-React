import React from 'react';
import { shallow, mount } from 'enzyme';
import ReactDOM from 'react-dom';
import {RegisterPage, RegisterForm} from '../components/register';

describe('<RegisterPage/> component', () => {
    it('Renders RegisterPage component',() =>{
        const registerPage = shallow(<RegisterPage/>);
        expect(registerPage).toHaveLength(1);
    });
});
describe('<RegisterForm/> component', () => {
    it('Renders RegisterForm component by default',() =>{
        const registerPage = shallow(<RegisterPage/>);
        const registerForm = registerPage.find('RegisterForm');
        expect(registerForm).toHaveLength(1);
    });
    it('Renders props correctly',() =>{
        const registerForm = shallow(<RegisterForm title="Register"/>);
        expect(registerForm.instance().props.title).toBe('Register');
    });
    // it('Redirects on when state of redirect is True ',() => {
    //     const registerForm = shallow(<RegisterPage/>);
    //     registerForm.setState({redirect: true});
    //     const loginPage = registerForm.find('LoginForm');
    //     expect(loginPage).toHaveLength(1);
    // });
    it('Changes state on form submission ',() => {
        const registerForm = mount(<RegisterForm/>);
        registerForm.setState({username: 'chris', email: 'chris@gmail.com', password: 'chris1234', cpassword: 'chris1234'});
        const pageForm = registerForm.find('Form')
        pageForm.simulate('submit')
        expect(registerForm.state().username).toBe('');
    });
    
});
describe('Form Validation in Register page', () => {
    it('Raises an error when password dont match',() => {
        const registerForm = mount(<RegisterForm/>);
        registerForm.setState({username: 'chris', email: 'chris@gmail.com', password: 'maina1234', cpassword: 'chris1234'});
        const pageForm = registerForm.find('Form')
        pageForm.simulate('submit')
        expect(registerForm.state().errors).toBe('Password mismatch');
    });
    it('Raises an error when username has special characters',() => {
        const registerForm = mount(<RegisterForm/>);
        registerForm.setState({username: 'chris+*', email: 'chris@gmail.com', password: 'maina1234', cpassword: 'maina1234'});
        const pageForm = registerForm.find('Form')
        pageForm.simulate('submit')
        expect(registerForm.state().errors).toBe('Username cannot have special characters');
    });
    it('Raises an error when username is empty',() => {
        const registerForm = mount(<RegisterForm/>);
        registerForm.setState({username: '', email: 'chris@gmail.com', password: 'maina1234', cpassword: 'maina1234'});
        const pageForm = registerForm.find('Form')
        pageForm.simulate('submit')
        expect(registerForm.state().errors).toBe('Please provide a username');
    });
});