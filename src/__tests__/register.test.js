import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import moxios from 'moxios';
import axios from 'axios';
import ReactDOM from 'react-dom';
import { RegisterPage, RegisterForm } from '../components/register';

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
    let onFulfilled
    let onRejected
    beforeEach(function () {
        moxios.install()
        onFulfilled = sinon.spy()
        onRejected = sinon.spy()
    })
    afterEach(function () {
        moxios.uninstall()
    })
    it('Submits user details to API server, registration success', () => {
        moxios.stubRequest('https://shoppinglist-restful-api.herokuapp.com/auth/register/', {
            status: 200,
            responseText: "Successful registration"
        })
        axios.post('https://shoppinglist-restful-api.herokuapp.com/auth/register/', {
            email: 'chris@gmail.com',
            password: 'chris1234'
        }).then(onFulfilled)
        moxios.wait(function () {
            expect(onFulfilled.getCall(0).args[0].data).toBe('Successful registration');
            done()
        })
    });
    it('Raises error when email is not submited', () => {

        axios.post('https://shoppinglist-restful-api.herokuapp.com/auth/register/', {
            email: '',
            password: 'chris1234'
        }).then(onFulfilled, onRejected)

        moxios.wait(function () {
            let request = moxios.requests.mostRecent()
            request.respondWith({
                status: 400,
                response: "Error"
            }).then(function () {
                expect(onRejected.getCall(0).args[0].data).toBe('Error');
                done()
            })
        })

    })
    it('Raises error when password is not submited', () => {

        axios.post('https://shoppinglist-restful-api.herokuapp.com/auth/register/', {
            email: 'chris@gmail.com',
            password: ''
        }).then(onFulfilled, onRejected)

        moxios.wait(function () {
            let request = moxios.requests.mostRecent()
            request.respondWith({
                status: 400,
                response: "Error"
            }).then(function () {
                expect(onRejected.getCall(0).args[0].data).toBe('Error');
                done()
            })
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
});
