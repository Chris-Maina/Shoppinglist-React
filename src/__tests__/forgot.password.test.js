import React from 'react';
import { shallow, mount, render } from 'enzyme';
import ReactDOM from 'react-dom';
import sinon from 'sinon';
import moxios from 'moxios';
import { ToastContainer } from 'react-toastify';
import axiosConfig from '../components/baseConfig';
import ForgotPassword from '../components/forgot_password';
import { LoginForm } from '../components/login';

describe('ForgotPassword test cases',()=>{
    beforeEach(function () {
        moxios.install(axiosConfig);
    })
    afterEach(function () {
        moxios.uninstall();
    })
    it('Change event causes state changes', ()=>{
        const forgotPasswordComponent = shallow(<ForgotPassword/>);
        const emailInput = forgotPasswordComponent.find("Input[name='email']");
        const event = {
            target: {
                name: 'email',
                value: 'chris@gmail.com'
            },
            preventDefault: () => { }
        };
        emailInput.simulate('change', event);
        expect(forgotPasswordComponent.state().email).toBe(event.target.value);
    });
    it('handleSubmit event calls emailSubmit function',()=>{
        let emailSubmitSpy = sinon.spy(ForgotPassword.prototype, 'emailSubmit')
        const forgotPasswordComponent = shallow(<ForgotPassword/>);
        const event = {
            preventDefault: () => { }
        };
        forgotPasswordComponent.instance().handleSubmit( event );
        
        expect(emailSubmitSpy.calledOnce).toEqual(true);
    });
    it('Sends an email successfully',(done)=>{
        const forgotPasswordComponent = mount(<ForgotPassword/>);
        forgotPasswordComponent.instance().emailSubmit("chris@gmail.com");
        moxios.stubRequest('https://shoppinglist-restful-api.herokuapp.com/user/reset', {
            status: 200
        });
        moxios.wait(function () {
            // Test toast message has success message
            expect(forgotPasswordComponent.find('ToastContainer').text()).toContain("Email sent successfully ");
            done();
        });
    })
    it('Sends an email unsuccessfully',(done)=>{
        const forgotPasswordComponent = mount(<ForgotPassword/>);
        forgotPasswordComponent.instance().emailSubmit("");
        moxios.stubRequest('https://shoppinglist-restful-api.herokuapp.com/user/reset', {
            status: 400,
            response: { message: "Please fill email field." }
        });
        moxios.wait(function () {
            // Test toast message has error message
            expect(forgotPasswordComponent.find('ToastContainer').text()).toContain("Please fill email field.");
            done();
        });
    })
    it('Renders Login page if redirected', ()=>{
        const forgotPasswordComponent = mount(<ForgotPassword/>);
        forgotPasswordComponent.setState({redirect: true});
        expect(LoginForm).toHaveLength(1);
    });
});
