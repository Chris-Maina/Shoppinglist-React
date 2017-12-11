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
        let shoppingItem = { shoppingitemname: 'Bread', price: 20, quantity: 2 }
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
    it('Creates a shopping item unsuccessfully', (done) => {
        const shoppingItemComponent = mount(<ShoppingItemsPage match={parentUrl} />);
        let shoppingItem = { shoppingitemname: 'Bread!', price: 20, quantity: 2 }
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

describe('Editing, delete test case scenarions', () => {
    let shoppinglistPageComponent;
    let parentUrl;
    let shoppingItemComponent;
    beforeEach(function () {
        moxios.install();
        // Create a shoppinglist
        shoppinglistPageComponent = mount(<ShoppinglistPage />);
        shoppinglistPageComponent.instance().handelShoppinglistNameSubmit('Furniture');
        moxios.stubRequest('https://shoppinglist-restful-api.herokuapp.com/shoppinglists/', {
            status: 200,
            response: { name: "Furniture", id: 1 }
        })
        // URL for the shopping items page
        parentUrl = { url: 'https://shoppinglist-restful-api.herokuapp.com/shoppinglists/1/items' };
        // Mount the shopping items component
        shoppingItemComponent = mount(<ShoppingItemsPage match={parentUrl} />);

    });
    afterEach(function () {
        moxios.uninstall();
    });
    it('Updates/ edits a shopping item successfully', (done) => {
        let editItemSpy = sinon.spy(ShoppingItemsPage.prototype, 'editShoppingItem')
        const shoppingItemComponent = mount(<ShoppingItemsPage match={parentUrl} />);
        let editedShoppingItem = { shoppingitemname: 'Milk', price: 20, quantity: 2, item_id: 8 }
        shoppingItemComponent.instance().handleUpdateItem(editedShoppingItem);
        moxios.stubRequest(parentUrl.url + '/' + editedShoppingItem.item_id, {
            status: 200,
            response: { message: "Successfully edited shopping item" }
        })
        shoppingItemComponent.setState({ isLoading: false });
        moxios.wait(function () {
            // Test method editShoppingItem is called
            // Test toast message has the item name
            expect(editItemSpy.calledOnce).toEqual(true);
            expect(shoppingItemComponent.find('ToastContainer').text()).toContain("Successfully edited shopping item");
            done();
        })
    });
    it('Updates/edits a shopping item unsuccessfully', (done) => {
        let editedShoppingItem = { shoppingitemname: 'Milk!', price: 20, quantity: 2, item_id: 8 }
        shoppingItemComponent.instance().handleUpdateItem(editedShoppingItem);
        moxios.stubRequest(parentUrl.url + '/' + editedShoppingItem.item_id, {
            status: 400,
            response: { message: "No special characters in name" }
        })
        shoppingItemComponent.setState({ isLoading: false });
        moxios.wait(function () {
            // Test toast message has an error message
            expect(shoppingItemComponent.find('ToastContainer').text()).toContain("No special characters in name");
            done();
        })
    });
    it('Deletes a shopping item successfully', (done) => {
        let deleteItemSpy = sinon.spy(ShoppingItemsPage.prototype, 'deleteItem')
        const shoppingItemComponent = mount(<ShoppingItemsPage match={parentUrl} />);
        shoppingItemComponent.instance().deleteItem('Bread', 8);
        moxios.stubRequest(parentUrl.url + '/8', {
            status: 200,
            response: { message: "item Bread deleted" }
        })
        shoppingItemComponent.setState({ isLoading: false });
        moxios.wait(function () {
            // Test toast message has a success message
            // Test method deleteItem is stored
            expect(deleteItemSpy.calledOnce).toEqual(true);
            expect(shoppingItemComponent.find('ToastContainer').text()).toContain("item Bread deleted");
            done();
        })
    });
    it('Searches for a shoppinglist successfully', (done) => {
        let searchItemSpy = sinon.spy(ShoppingItemsPage.prototype, 'searchShoppingItem')
        const shoppingItemComponent = mount(<ShoppingItemsPage match={parentUrl} />);
        shoppingItemComponent.instance().searchShoppingItem('Bread');
        moxios.stubRequest(parentUrl.url + '?q=Bread', {
            status: 200,
            response: { created_by: 2, id: 8, name: "Bread", price: 100, quantity: 9 }
        })
        shoppingItemComponent.setState({ isLoading: false });
        moxios.wait(function () {
            // Test state changes to contain data
            expect(shoppingItemComponent.instance().state.shoppingitems).toEqual({ created_by: 2, id: 8, name: "Bread", price: 100, quantity: 9 });
            done();
        })

    })

});