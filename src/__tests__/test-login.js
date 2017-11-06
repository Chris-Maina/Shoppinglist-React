import React from 'react';
import { shallow, mount } from 'enzyme';
import ReactDOM from 'react-dom';
import { LoginForm } from '../components/login';
import ShoppinglistPage from '../components/shoppinglist';
import sinon from 'sinon';
import moxios from 'moxios';
import axios from 'axios';

describe ('<LoginForm/> components', () => {
    it('Renders Form by default correctly', () => {
        const login = shallow(<LoginForm/>);
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
            axios.post('https://shoppinglist-restful-api.herokuapp.com/auth/login/',{
                email: 'chris@gmail.com',
                password: 'chris12345'
            }).then(onFulfilled)
            moxios.wait( function () {
                let request = moxios.request.mostRecent()
                request.respondWith({
                    status: 200,
                    respondText: "Success login"
                }).then( function () {
                    equal(onFulfilled.getCall(0).args(0).data, "Success login")
                    done()
                })
            })

        })
        it('Renders props correctly', () =>{
            const login = shallow(<LoginForm title="Sign In"/>);
            expect(login.instance().props.title).toBe("Sign In");

        })
        it('Changes state when form is submitted',()=>{
            const login = mount(<LoginForm/>);
            login.setState({email: 'chris@gmail.com', password: 'chris1234'});
            const loginForm = login.find('form');
            loginForm.simulate('submit');
            expect(login.state().email).toBe('');
        })
        it('Calls sendRequest when form is submitted ', () => {
            sinon.spy(LoginForm.prototype, 'sendRequest');
            const wrapper = mount(<LoginForm />);
            wrapper.setState({ email: 'chris@gmail.com', password: 'maina1234' });
            const pageForm = wrapper.find('Form')
            pageForm.simulate('submit')
            expect(LoginForm.prototype.sendRequest.calledOnce).toEqual(true);
        });
        it('Calls handleSubmit when form is submitted ', () => {
            sinon.spy(LoginForm.prototype, 'handelsubmit');
            const wrapper = mount(<LoginForm />);
            wrapper.setState({ email: 'chris@gmail.com', password: 'maina1234' });
            const pageForm = wrapper.find('Form')
            pageForm.simulate('submit')
            expect(LoginForm.prototype.handelsubmit.calledOnce).toEqual(true);
        });
        it('Changes email state when on change event is called', () => {
            const login = mount(<LoginForm/>);
            const inputEmail = login.find("input[name='email']");
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