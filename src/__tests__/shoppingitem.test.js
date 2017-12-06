import React from 'react';
import { shallow, mount, render } from 'enzyme';
import ReactDOM from 'react-dom';
import { LoginForm } from '../components/login';
import ShoppingItemsPage from '../components/shoppingitem';
import { ShoppinglistPage } from '../components/shoppinglist';
import sinon from 'sinon';
import moxios from 'moxios';
import { ToastContainer } from 'react-toastify';


let shoppinglistPageComponent;
let parentUrl;

describe('ShoppingItemsPage component', () => {
    beforeEach(function () {
        moxios.install();
        shoppinglistPageComponent = mount(<ShoppinglistPage />);
        shoppinglistPageComponent.instance().handelShoppinglistNameSubmit('Furniture');
        moxios.stubRequest('https://shoppinglist-restful-api.herokuapp.com/shoppinglists/', {
            status: 200,
            response: { name: "Furniture", id: 1 }
        })
        parentUrl = { url: 'https://shoppinglist-restful-api.herokuapp.com/shoppinglists/1/items' };
    })
    afterEach(function () {
        moxios.uninstall();
    })
    it('Renders ShoppingItemsPage component', () => {
        const shoppingItemComponent = shallow(<ShoppingItemsPage match={parentUrl} />);
        moxios.stubRequest('https://shoppinglist-restful-api.herokuapp.com/shoppinglists/1/items', {
            status: 200,
            response: { next_page: "None", previous_page: "None", shopping_items: "You have no shopping items" }
        })
        expect(shoppingItemComponent.length).toEqual(1);
    });
    it('Changes state when getShoppingItems is called', (done) => {
        const shoppingItemComponent = shallow(<ShoppingItemsPage match={parentUrl} />);
        shoppingItemComponent.instance().getShoppinglistsItems();
        moxios.stubRequest('https://shoppinglist-restful-api.herokuapp.com/shoppinglists/1/items', {
            status: 200,
            response: { next_page: "None", previous_page: "None", shopping_items: "You have no shopping items" }
        })
        moxios.wait(function () {
            expect(shoppingItemComponent.instance().state.shoppingitems).toEqual("You have no shopping items");
            done();
        })

    });
    it('Toast has an error message when getShoppinglistsItems responds with an error', (done) => {
        let noParent = { url: 'https://shoppinglist-restful-api.herokuapp.com/shoppinglists/3/items' };
        const shoppingItemComponent = mount(<ShoppingItemsPage match={noParent} />);
        shoppingItemComponent.instance().getShoppinglistsItems();
        moxios.stubRequest('https://shoppinglist-restful-api.herokuapp.com/shoppinglists/3/items', {
            status: 404,
            response: { message: "No such shoppinglist" }
        })
        shoppingItemComponent.setState({ isLoading: false });
        moxios.wait(function () {
            expect(shoppingItemComponent.find('ToastContainer').text()).toContain("No such shoppinglist");
            done();
        })
    });
    it('Toast has an error message when getShoppinglistsItems responds with a timeout error', (done) => {
        const shoppingItemComponent = mount(<ShoppingItemsPage match={parentUrl} />);
        const login = mount(<LoginForm />)
        shoppingItemComponent.instance().getShoppinglistsItems();
        moxios.stubRequest('https://shoppinglist-restful-api.herokuapp.com/shoppinglists/3/items', {
            status: 408,
            response: { message: "Invalid token. Please register or login" }
        })
        moxios.wait(function () {
            expect(login.length).toEqual(1);
            done();
        })
    });
    it('Creates a shopping item successfully', (done) => {
        const createItemSpy = sinon.spy(ShoppingItemsPage.prototype, 'createShoppingItem')
        const shoppingItemComponent = mount(<ShoppingItemsPage match={parentUrl} />);
        let shoppingItem = {shoppingitemname:'Bread',price:20,quantity:2}
        shoppingItemComponent.instance().handleShoppingItemCreate(shoppingItem);
        moxios.stubRequest('https://shoppinglist-restful-api.herokuapp.com/shoppinglists/1/items', {
            status: 200,
            response: { name: "Bread", id: 8, created_by: 2 }
        })
        shoppingItemComponent.setState({ isLoading: false });
        moxios.wait(function () {
            // Test method createShoppingItem is called
            // Test toast message has the item name
            expect(createItemSpy.calledOnce).toEqual(true);
            expect(shoppingItemComponent.find('ToastContainer').text()).toContain("Shoppingitem Bread created");
            done();
        })
    })
    it('Creates a shopping item successfully', (done) => {
        const shoppingItemComponent = mount(<ShoppingItemsPage match={parentUrl} />);
        let shoppingItem = {shoppingitemname:'Bread!',price:20,quantity:2}
        shoppingItemComponent.instance().handleShoppingItemCreate(shoppingItem);
        moxios.stubRequest('https://shoppinglist-restful-api.herokuapp.com/shoppinglists/1/items', {
            status: 400,
            response: { message: "No special characters in name" }
        })
        shoppingItemComponent.setState({ isLoading: false });
        moxios.wait(function () {
            // Test toast message has the error message 
            expect(shoppingItemComponent.find('ToastContainer').text()).toContain("No special characters in name");
            done();
        })
    })
});