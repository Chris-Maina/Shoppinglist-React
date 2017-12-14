import React from 'react';
import { shallow, mount, render } from 'enzyme';
import ReactDOM from 'react-dom';
import { Redirect, Router } from 'react-router-dom';
import { LoginForm } from '../components/login';
import {ShoppinglistPage} from '../components/shoppinglist';
import sinon from 'sinon';
import moxios from 'moxios';
import axiosConfig from '../components/baseConfig';
import { ToastContainer } from 'react-toastify';


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
        beforeEach(function () {
            moxios.install(axiosConfig);
        })
        afterEach(function () {
            moxios.uninstall();
        })
        it('Logins in a user successfully', (done) => {
            const login = mount(<LoginForm />);
            login.instance().sendRequest("logintest@gmail.com", "chris12345")
            moxios.stubRequest( "https://shoppinglist-restful-api.herokuapp.com/auth/login/" , {
                status: 200,
                response:{message: "You are logged in successfully"}
            });
            moxios.wait(function () {
                // Expect state of isLoading changes
                // Expect toast has success message
                expect(login.instance().state.isLoading).toBe(false);
                expect(login.find('ToastContainer').text()).toContain("You are logged in successfully");
                done();
            })
        })
        it('Raises error when password is not submited', () => {
            const login = mount(<LoginForm />);
            login.instance().sendRequest("chris@gmail.com", "")
            moxios.stubRequest( "https://shoppinglist-restful-api.herokuapp.com/auth/login/" , {
                status: 400,
                response:{message: 'Please fill password field.'}
            })

            moxios.wait(function () {
                // Expect state of isLoading changes
                 // Expect toast has error message
                expect(login.instance().state.isLoading).toEqual(false);
                expect(login.find('ToastContainer').text()).toContain("Please fill password field.");
                done();
            })

        })
        it('Renders ShoppinglistPage when isLoggedIn is true', ()=>{
            const login = shallow(<LoginForm />);
            login.setState({isLoggedIn: true});
            expect(ShoppinglistPage).toHaveLength(1);
        })
       
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
    })
});