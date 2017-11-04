import React from 'react';
import { shallow, mount } from 'enzyme';
import ReactDOM from 'react-dom';
import { LoginForm } from '../components/login';
import ShoppinglistPage from '../components/shoppinglist';
import sinon from 'sinon';

describe('Mocking axios ', () => {})
describe ('<LoginForm/> components', () => {
    it('Renders Form by default correctly', () => {
        const login = shallow(<LoginForm/>);
        const loginForm = login.find('Form');
        expect(loginForm).toHaveLength(1);
        // Check that a container is the first div
        const container = login.first('div');
        expect(container).toHaveLength(1);
    });
    // it('Redirects on when state of redirect is True ',() => {
    //     const loginForm = shallow(<LoginForm/>);
    //     loginForm.setState({redirect: true});
    //     const shoppinglistPage = shallow(<ShoppinglistPage/>);
    //     const shoppinglist = shoppinglistPage.find('ShoppinglistPage');
    //     expect(shoppinglist).toHaveLength(1);
    // });
});