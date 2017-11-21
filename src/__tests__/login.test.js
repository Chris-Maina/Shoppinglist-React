import React from 'react';
import { shallow, mount, render } from 'enzyme';
import ReactDOM from 'react-dom';
import { Redirect, Router } from 'react-router-dom';
import { LoginForm } from '../components/login';
import {ShoppinglistPage} from '../components/shoppinglist';
import sinon from 'sinon';
import moxios from 'moxios';
import axios from 'axios';

describe('<LoginForm/> components', () => {
    it('Renders Form by default correctly', () => {
        const login = shallow(<LoginForm />);
        const loginForm = login.find('Form');
        expect(loginForm).toHaveLength(1);
        // Check that a container is the first div
        const container = login.first('div');
        expect(container).toHaveLength(1);
    });
    describe('Mocking axios request to login ', () => {
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
        it('Logins in a user successfully', () => {
            axios.post('https://shoppinglist-restful-api.herokuapp.com/auth/login/', {
                email: 'chris@gmail.com',
                password: 'chris12345'
            }).then(onFulfilled)
            moxios.wait(function () {
                let request = moxios.request.mostRecent()
                request.respondWith({
                    status: 200,
                    respondText: "Success login"
                }).then(function () {
                    equal(onFulfilled.getCall(0).args(0).data, "Success login")
                    done()
                })
            })

        })
        it('Raises error when password is not submited', () => {

            axios.post('https://shoppinglist-restful-api.herokuapp.com/auth/login/', {
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
        // it('renders without crashing', () => {
        //     const div = document.createElement('div');
        //     ReactDOM.shallow(<LoginForm/>, div);
        // });
        it('Renders props correctly', () => {
            const login = shallow(<LoginForm title="Sign In" />);
            expect(login.instance().props.title).toBe("Sign In");

        })
        it('Changes state when form is submitted', () => {
            const login = shallow(<LoginForm />);
            login.setState({ email: 'chris@gmail.com', password: 'chris1234' });
            const loginForm = login.find('Form');
            loginForm.simulate('submit', {  preventDefault () {}  });
            expect(login.state().email).toBe('');
        })
        it('Calls sendRequest when form is submitted ', () => {
            sinon.spy(LoginForm.prototype, 'sendRequest');
            const wrapper = shallow(<LoginForm />);
            wrapper.setState({ email: 'chris@gmail.com', password: 'maina1234' });
            const pageForm = wrapper.find('Form')
            pageForm.simulate('submit', {  preventDefault () {}  })
            expect(LoginForm.prototype.sendRequest.calledOnce).toEqual(true);
        });
        it('Calls handleSubmit when form is submitted ', () => {
            sinon.spy(LoginForm.prototype, 'handelsubmit');
            const wrapper = shallow(<LoginForm />);
            wrapper.setState({ email: 'chris@gmail.com', password: 'maina1234' });
            const pageForm = wrapper.find('Form')
            pageForm.simulate('submit', {  preventDefault () {}  })
            expect(LoginForm.prototype.handelsubmit.calledOnce).toEqual(true);
        });
        it('Changes email state when on change event is called', () => {
            const login = shallow(<LoginForm />);
            const inputEmail = login.find("Input[name='email']");
            const event = {
                target: {
                    name: 'email',
                    value: 'chris@gmail.com'
                },
                preventDefault: () => {
                    return true
                }
            }
            inputEmail.simulate('change', event);
            expect(login.state().email).toBe(event.target.value);

        })
        // it('Redirects when redirect state is changed', () => {
        //     const login = shallow(<LoginForm/>);
        //     login.setState({isLoggedIn: true})
            
        //     expect(login.find('Redirect').calledOnce).toEqual(true);
            

        // })
    })
});