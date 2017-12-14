import React from 'react';
import { shallow, mount, render } from 'enzyme';
import ReactDOM from 'react-dom';
import sinon from 'sinon';
import moxios from 'moxios';
import { ToastContainer } from 'react-toastify';
import axiosConfig from '../components/baseConfig';
import { SubmitPassword } from '../components/submit_password';
import { LoginForm } from '../components/login';

describe('SubmitPassword test cases', () => {

    it('Change event causes state changes', () => {
        const submitPasswordComponent = shallow(<SubmitPassword />);
        const passwordInput = submitPasswordComponent.find("Input[name='newPassword']");
        const event = {
            target: {
                name: 'newPassword',
                value: 'pass123'
            },
            preventDefault: () => { }
        };
        passwordInput.simulate('change', event);
        expect(submitPasswordComponent.state().newPassword).toBe(event.target.value);
    });
    it('handleSubmit event calls validate function', () => {
        let validateSpy = sinon.spy(SubmitPassword.prototype, 'validate')
        const submitPasswordComponent = shallow(<SubmitPassword />);
        const event = {
            preventDefault: () => { }
        };
        submitPasswordComponent.instance().handleSubmit(event);

        expect(validateSpy.calledOnce).toEqual(true);
    });
    it('Validate password returns password mismatch errors', () => {
        const submitPasswordComponent = shallow(<SubmitPassword />);
        let result = submitPasswordComponent.instance().validate('pass123', 'chrismaina');
        expect(result).toEqual('Password mismatch');
    });
    it('Renders Login component when state of redirect changes', () => {
        const submitPasswordComponent = shallow(<SubmitPassword />);
        submitPasswordComponent.setState({ redirect: true });
        expect(LoginForm).toHaveLength(1);
    })


});
describe('Reset Password Api request test case', () => {
    let parentUrl;
    beforeEach(function () {
        moxios.install(axiosConfig);
        parentUrl = { url: 'https://shoppinglist-restful-api.herokuapp.com/user/reset/password/token-is-here' };
    })
    afterEach(function () {
        moxios.uninstall();
    })
    it('Resets a password unsuccessfully', (done) => {
        const submitPasswordComponent = mount(<SubmitPassword match={parentUrl} />);
        submitPasswordComponent.setState({ redirect: false });
        submitPasswordComponent.instance().resetPassword("chris");
        moxios.stubRequest(parentUrl.url, {
            status: 403,
            response: { message: "Your password should be atleast 6 characters long." }
        });
        moxios.wait(function () {
            // Test state changes
            expect(submitPasswordComponent.find('ToastContainer').text()).toContain("Your password should be atleast 6 characters long.");
            done();
        });
    });
});
