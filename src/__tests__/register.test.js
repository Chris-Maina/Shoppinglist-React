import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import moxios from 'moxios';
import axiosConfig from '../components/baseConfig';
import ReactDOM from 'react-dom';
import { RegisterPage, RegisterForm } from '../components/register';
import { ToastContainer } from 'react-toastify';

describe('<RegisterPage/> component', () => {
    it('Renders RegisterPage component', () => {
        const registerPage = shallow(<RegisterPage />);
        expect(registerPage).toHaveLength(1);
    });
    it('Renders RegisterForm component by default', () => {
        const registerPage = shallow(<RegisterPage />);
        const registerForm = registerPage.find('RegisterForm');
        expect(registerForm).toHaveLength(1);
    });
    it('Renders props correctly', () => {
        const registerForm = shallow(<RegisterForm title="Register" />);
        expect(registerForm.instance().props.title).toBe('Register');
    });
});
describe('Form Validation in Register page', () => {
   
    beforeEach(function () {
        moxios.install(axiosConfig);
        
    })
    afterEach(function () {
        moxios.uninstall()
    })
    it('Registration success', (done) => {
        const register = mount(<RegisterPage/>);
        const registerForm = shallow(<RegisterForm/>)
        registerForm.instance().sendRequest("regTest@gmail.com", "pass123")
        moxios.stubRequest('https://shoppinglist-restful-api.herokuapp.com/auth/register/', {
            status: 200,
            responseText: {message: 'You have been registered successfully. Please login'}
        })
        moxios.wait(function () {
            expect(register.find('ToastContainer').text()).toContain("You have been registered successfully. Please login");
            done()
        })
    });
    it('Raises error when email is not submited', (done) => {
        const register = mount(<RegisterPage/>);
        const registerForm = shallow(<RegisterForm/>)
        registerForm.instance().sendRequest("regTest@gmail", "pass123");
        moxios.stubRequest('https://shoppinglist-restful-api.herokuapp.com/auth/register/', {
            status: 403,
            responseText: {message: 'Please provide a valid email address.'}
        })
        moxios.wait(function () {
            expect(register.find('ToastContainer').text()).toContain("Please provide a valid email address.");
            done()
        })

    })
    it('Changes state on form submission ', () => {
        const registerForm = mount(<RegisterForm />);
        registerForm.setState({ username: 'chris', email: 'chris@gmail.com', password: 'chris1234', cpassword: 'chris1234' });
        const pageForm = registerForm.find('Form')
        pageForm.simulate('submit')
        expect(registerForm.state().username).toBe('');
    });

    it('Raises an error when password dont match', () => {
        const registerForm = mount(<RegisterForm />);
        registerForm.setState({ username: 'chris', email: 'chris@gmail.com', password: 'maina1234', cpassword: 'chris1234' });
        const pageForm = registerForm.find('Form')
        pageForm.simulate('submit')
        expect(registerForm.state().errors).toBe('Password mismatch');
    });
    it('Raises an error when username has special characters', () => {
        const registerForm = mount(<RegisterForm />);
        registerForm.setState({ username: 'chris+*', email: 'chris@gmail.com', password: 'maina1234', cpassword: 'maina1234' });
        const pageForm = registerForm.find('Form')
        pageForm.simulate('submit')
        expect(registerForm.state().errors).toBe('Username cannot have special characters');
    });
    it('Raises an error when username is empty', () => {
        const registerForm = mount(<RegisterForm />);
        registerForm.setState({ username: '', email: 'chris@gmail.com', password: 'maina1234', cpassword: 'maina1234' });
        const pageForm = registerForm.find('Form')
        pageForm.simulate('submit')
        expect(registerForm.state().errors).toBe('Please provide a username');
    });
    it('Calls sendRequest when form is submitted ', () => {
        sinon.spy(RegisterForm.prototype, 'sendRequest');
        const wrapper = mount(<RegisterForm />);
        wrapper.setState({ username: 'chris', email: 'chris@gmail.com', password: 'maina1234', cpassword: 'maina1234' });
        const pageForm = wrapper.find('Form')
        pageForm.simulate('submit')
        expect(RegisterForm.prototype.sendRequest.calledOnce).toEqual(true);
    });
    it('Calls validate when form is submitted ', () => {
        sinon.spy(RegisterForm.prototype, 'validate');
        const wrapper = mount(<RegisterForm />);
        wrapper.setState({ username: 'chris', email: 'chris@gmail.com', password: 'maina1234', cpassword: 'maina1234' });
        const pageForm = wrapper.find('Form')
        pageForm.simulate('submit')
        expect(RegisterForm.prototype.validate.calledOnce).toEqual(true);
    });
    it('Changes password state when on change event is called', () => {
        const register = mount(<RegisterForm/>);
        const inputEmail = register.find("input[name='password']");
        const event = {
            target: {
                name: 'password',
                value: 'chris12345'
            },
            preventDefault: () => {
                return true
            }
        }
        inputEmail.simulate('change', event);
        expect(register.state().password).toBe(event.target.value);
        
    })
});
