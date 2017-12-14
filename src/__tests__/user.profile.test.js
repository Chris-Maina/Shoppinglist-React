import React from 'react';
import { shallow, mount, render } from 'enzyme';
import ReactDOM from 'react-dom';
import sinon from 'sinon';
import moxios from 'moxios';
import UserProfile from '../components/user_profile';
import axiosConfig from '../components/baseConfig';
import { ToastContainer, toast } from 'react-toastify';


describe('UserProfile test cases',()=>{
    beforeEach(function () {
        moxios.install(axiosConfig);
    })
    afterEach(function () {
        moxios.uninstall();
    })
    it('handleSubmit event calls validate function', () => {
        let updatePasswordEmailSpy = sinon.spy(UserProfile.prototype, 'updatePasswordEmail')
        const userProfileComponent = shallow(<UserProfile />);
        const event = {
            preventDefault: () => { }
        };
        userProfileComponent.instance().handleSubmit(event);

        expect(updatePasswordEmailSpy.calledOnce).toEqual(true);
    });
    it('Change event triggers state change',()=>{
        const userProfileComponent = shallow(<UserProfile />);
        userProfileComponent.setState({email: "reacttest@gmail.com", password:"pass123"});    
        const event = {
            preventDefault: () => { },
            target: {
                name: 'password',
                value: 'newpassword1'
            }
        };
        userProfileComponent.instance().onInputChange(event)
        expect(userProfileComponent.instance().state.password).toBe(event.target.value);
    });
    it('It updates password successfully',(done)=>{
        const userProfileComponent = mount(<UserProfile />);
        userProfileComponent.instance().updatePasswordEmail("reacttest@gmail.com", "newpassword1");
        moxios.stubRequest( "https://shoppinglist-restful-api.herokuapp.com/user" , {
            status: 200,
            response: { message: "Successfully updated profile" }
        });
        moxios.wait(function () {
            expect(userProfileComponent.find('ToastContainer').text()).toContain("Successfully updated profile");
            done();
        });   
    });
    it('It updates password unsuccessfully',(done)=>{
        const userProfileComponent = mount(<UserProfile />);
        userProfileComponent.instance().updatePasswordEmail("reacttest@gmail.com", "new");
        moxios.stubRequest( "https://shoppinglist-restful-api.herokuapp.com/user" , {
            status: 403,
            response: { message: "Your password should be atleast 6 characters long" }
        });
        moxios.wait(function () {
            expect(userProfileComponent.find('ToastContainer').text()).toContain("Your password should be atleast 6 characters long");
            done();
        });   
    })
})