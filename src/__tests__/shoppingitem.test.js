import React from 'react';
import { shallow, mount, render } from 'enzyme';
import ReactDOM from 'react-dom';
import { LoginForm } from '../components/login';
import {ShoppingItemsPage, NextPreviousPage, ToggleShoppingItem, ShoppingItemForm, SearchShoppingItem, LimitShoppingItems }from '../components/shoppingitem';
import { ShoppinglistPage } from '../components/shoppinglist';
import sinon from 'sinon';
import moxios from 'moxios';
import { ToastContainer } from 'react-toastify';
import axiosConfig from '../components/baseConfig';


let shoppingItemComponent;
let parentUrl;

describe('ShoppingItemsPage component', () => {
    beforeEach(function () {
        moxios.install(axiosConfig);
        parentUrl = { url: 'https://shoppinglist-restful-api.herokuapp.com/shoppinglists/1/items' };
        shoppingItemComponent = shallow(<ShoppingItemsPage match={parentUrl} />);
    })
    afterEach(function () {
        moxios.uninstall();
    })
    it('Renders ShoppingItemsPage component', () => {
        moxios.stubRequest(parentUrl.url, {
            status: 200,
            response: { next_page: "None", previous_page: "None", shopping_items: "You have no shopping items" }
        })
        expect(shoppingItemComponent.length).toEqual(1);
    });
    it('Changes state when getShoppingItems is called', (done) => {
        const shoppingItemComponent = shallow(<ShoppingItemsPage match={parentUrl} />);
        shoppingItemComponent.instance().getShoppinglistsItems();
        moxios.stubRequest(parentUrl.url, {
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
    it(' GetshoppinglistItems responds with a 404 error', (done) => {
        const shoppingItemComponent = mount(<ShoppingItemsPage match={parentUrl} />);
        let getShoppinglist = shoppingItemComponent.instance().getShoppinglistsItems();
        moxios.stubRequest(parentUrl.url, {
            status: 408,
            response: { message: "Invalid token. Please register or login" }
        })
        shoppingItemComponent.setState({ isLoading: false });
        moxios.wait(function () {
            // Test toast message has the error message 
            expect(shoppingItemComponent.find('ToastContainer').text()).toContain("Invalid token. Please register or login");
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
    it('Creates a shopping item unsuccessfully responds with a 400 error', (done) => {
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
    });

    it('Creates a shopping item unsuccessfully responds with a 408 error', (done) => {
        const shoppingItemComponent = mount(<ShoppingItemsPage match={parentUrl} />);
        let shoppingItem = { shoppingitemname: 'Bread!', price: 20, quantity: 2 }
        shoppingItemComponent.instance().handleShoppingItemCreate(shoppingItem);
        moxios.stubRequest('https://shoppinglist-restful-api.herokuapp.com/shoppinglists/1/items', {
            status: 408,
            response: { message: "Invalid token. Please register or login" }
        })
        shoppingItemComponent.setState({ isLoading: false });
        moxios.wait(function () {
            // Test toast message has the error message 
            expect(shoppingItemComponent.find('ToastContainer').text()).toContain("Invalid token. Please register or login");
            done();
        })
    });
});

describe('Editing, delete test case scenarions', () => {
    let shoppinglistPageComponent;
    let parentUrl;
    let shoppingItemComponent;
    beforeEach(function () {
        moxios.install(axiosConfig);
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

    it('Updates/edits a shopping item unsuccessfully responds with a 408 error', (done) => {
        let editedShoppingItem = { shoppingitemname: 'Milk!', price: 20, quantity: 2, item_id: 8 }
        shoppingItemComponent.instance().editShoppingItem(editedShoppingItem);
        moxios.stubRequest(parentUrl.url + '/' + editedShoppingItem.item_id, {
            status: 408,
            response: { message: "Invalid token. Please register or login" }
        })
        shoppingItemComponent.setState({ isLoading: false });
        moxios.wait(function () {
            // Test toast message has an error message
            expect(shoppingItemComponent.find('ToastContainer').text()).toContain("Invalid token. Please register or login");
            done();
        })
    });

    it('Deletes a shopping item successfully', (done) => {
        let deleteItemSpy = sinon.spy(ShoppingItemsPage.prototype, 'deleteItem')
        const shoppingItemComponent = mount(<ShoppingItemsPage match={parentUrl} />);
        shoppingItemComponent.instance().handleDeleteItem('Bread', 8);
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
    it('Deletes a shopping item unsuccessfully with a 408 error', (done) => {
        shoppingItemComponent.instance().deleteItem('Bread', 8);
        moxios.stubRequest(parentUrl.url + '/8', {
            status: 408,
            response: { message: "Invalid token. Please register or login" }
        });
        shoppingItemComponent.setState({ isLoading: false });
        moxios.wait(function () {
            // Test toast message has a error message
            expect(shoppingItemComponent.find('ToastContainer').text()).toContain("Invalid token. Please register or login");
            done();
        })
    });

    it('Searches for a shoppinglist successfully', (done) => {
        let searchItemSpy = sinon.spy(ShoppingItemsPage.prototype, 'searchShoppingItem')
        const shoppingItemComponent = mount(<ShoppingItemsPage match={parentUrl} />);
        shoppingItemComponent.instance().handleShoppingItemSearch('Bread');
        moxios.stubRequest(parentUrl.url + '?q=Bread', {
            status: 200,
            response: { created_by: 2, id: 8, name: "Bread", price: 100, quantity: 9 }
        })
        shoppingItemComponent.setState({ isLoading: false });
        moxios.wait(function () {
            // Test state changes to contain data
            // Test searchShoppingItem is called
            expect(searchItemSpy.calledOnce).toEqual(true);
            expect(shoppingItemComponent.instance().state.shoppingitems).toEqual({ created_by: 2, id: 8, name: "Bread", price: 100, quantity: 9 });
            done();
        })

    })
    it('Searches for a shoppinglist unsuccessfully', (done) => {
        shoppingItemComponent.instance().searchShoppingItem('Bread1');
        moxios.stubRequest(parentUrl.url + '?q=Bread1', {
            status: 400,
            response: { message: "No special characters in name" }
        })
        shoppingItemComponent.setState({ isLoading: false });
        moxios.wait(function () {
            // Test state changes to contain data
            expect(shoppingItemComponent.find('ToastContainer').text()).toContain("No special characters in name");
            done();
        })

    });

    it('Searches for a shoppinglist unsuccessfully with a 408 error', (done) => {
        shoppingItemComponent.instance().searchShoppingItem('Bread');
        moxios.stubRequest(parentUrl.url + '?q=Bread', {
            status: 408,
            response: {message: "Invalid token. Please register or login"}
        })
        shoppingItemComponent.setState({ isLoading: false });
        moxios.wait(function () {
            // Toast has error message
            expect(shoppingItemComponent.find('ToastContainer').text()).toContain("Invalid token. Please register or login");
            done();
        })

    });

    it('Limits a shoppinglist', (done) => {
        let limitItemSpy = sinon.spy(ShoppingItemsPage.prototype, 'limitShoppingItems')
        const shoppingItemComponent = mount(<ShoppingItemsPage match={parentUrl} />);
        shoppingItemComponent.instance().handleShoppingItemsLimit(1);
        moxios.stubRequest(parentUrl.url + '?limit=1', {
            status: 200,
            response:{next_page: "/shoppinglists/4/items?limit=1&page=2", previous_page: "None", 
                        shopping_items: [{id: 5, name: "Sukuma wiki", price: 15, quantity: 3}]}
        })
        shoppingItemComponent.setState({ isLoading: false });
        moxios.wait(function () {
            // Test state changes to contain data
            // Test limitShoppingItems is called
            expect(limitItemSpy.calledOnce).toEqual(true);
            expect(shoppingItemComponent.instance().state.shoppingitems).toEqual([ { id: 5, name: 'Sukuma wiki', price: 15, quantity: 3 } ]);
            done();
        })
    });
    it('Limits a shoppinglist items is unsuccessful', (done) => {
        shoppingItemComponent.instance().handleShoppingItemsLimit(-1);
        moxios.stubRequest(parentUrl.url + '?limit=-1', {
            status: 400,
            response:{message: "Limit must be a positive integer"}
        })
        shoppingItemComponent.setState({ isLoading: false });
        moxios.wait(function () {
            // Test toast message has the error
            expect(shoppingItemComponent.find('ToastContainer').text()).toContain("Limit must be a positive integer");
            done();
        })
    });
    it('Limits a shoppinglist items responds with a 408 error', (done) => {
        shoppingItemComponent.instance().handleShoppingItemsLimit(1);
        moxios.stubRequest(parentUrl.url + '?limit=1', {
            status: 408,
            response:{message: "Invalid token. Please register or login"}
        })
        shoppingItemComponent.setState({ isLoading: false });
        moxios.wait(function () {
            // Test toast message has the error
            expect(shoppingItemComponent.find('ToastContainer').text()).toContain("Invalid token. Please register or login");
            done();
        })
    });
    it('Get next page of a shoppingitems', (done) => {
        let nextPageSpy = sinon.spy(ShoppingItemsPage.prototype, 'getNextPage')
        const shoppingItemComponent = mount(<ShoppingItemsPage match={parentUrl} />);
        shoppingItemComponent.setState({ next_page: "/shoppinglists/1/items?limit=7&page=2" });
        shoppingItemComponent.instance().handleNextClick();
        moxios.stubRequest(parentUrl.url + '?limit=7&page=2', {
            status: 200,
            response:{next_page: "None", previous_page: "/shoppinglists/1/items?limit=7&page=1", 
                    shopping_items: [{id: 30, name: "rubber", price: 5, quantity: 1}]}

        })
        shoppingItemComponent.setState({ isLoading: false });
        moxios.wait(function () {
            // Test state changes to contain data
            // Test getNextPage is called
            expect(nextPageSpy.calledOnce).toEqual(true);
            expect(shoppingItemComponent.instance().state.shoppingitems).toEqual([ {id: 30, name: "rubber", price: 5, quantity: 1}]);
            done();
        })
    });
    it('Get next page of a shoppingitems unsuccessful', (done) => {
        shoppingItemComponent.setState({ next_page: "/shoppinglists/1/items?limit=7&page=2" });
        shoppingItemComponent.instance().handleNextClick();
        moxios.stubRequest(parentUrl.url + '?limit=7&page=2', {
            status: 408,
            response:{message: "Invalid token. Please register or login"}

        })
        shoppingItemComponent.setState({ isLoading: false });
        moxios.wait(function () {
            // Toast has error message
            expect(shoppingItemComponent.find('ToastContainer').text()).toContain("Invalid token. Please register or login");
            done();
        })
    });
    it('Get previous page of a shoppingitems', (done) => {
        let prevPageSpy = sinon.spy(ShoppingItemsPage.prototype, 'getPreviousPage')
        const shoppingItemComponent = mount(<ShoppingItemsPage match={parentUrl} />);
        shoppingItemComponent.setState({ previous_page: "/shoppinglists/1/items?limit=2&page=1" });
        shoppingItemComponent.instance().handlePrevClick();
        moxios.stubRequest(parentUrl.url + '?limit=2&page=1', {
            status: 200,
            response:{next_page: "/shoppinglists/4/items?limit=2&page=2", previous_page: "None",
                    shopping_items: [
                        {id: 28, name: "Cup cake", price: 80, quantity: 1},
                        {id: 29, name: "Pencil", price: 5, quantity: 3}]}

        })
        shoppingItemComponent.setState({ isLoading: false });
        moxios.wait(function () {
            // Test state changes to contain data
            // Test getPreviousPage is called
            expect(prevPageSpy.calledOnce).toEqual(true);
            expect(shoppingItemComponent.instance().state.shoppingitems).toEqual([ { id: 28, name: 'Cup cake', price: 80, quantity: 1 },
                        { id: 29, name: 'Pencil', price: 5, quantity: 3 } ]);
            done();
        })
    });
    it('Get previous page of a shoppingitems unsuccessful', (done) => {
        shoppingItemComponent.setState({ previous_page: "/shoppinglists/1/items?limit=2&page=1" });
        shoppingItemComponent.instance().handlePrevClick();
        moxios.stubRequest(parentUrl.url + '?limit=2&page=1', {
            status: 408,
            response:{message: "Invalid token. Please register or login"}

        })
        shoppingItemComponent.setState({ isLoading: false });
        moxios.wait(function () {
            // Toast has error message
            expect(shoppingItemComponent.find('ToastContainer').text()).toContain("Invalid token. Please register or login");
            done();
        })
    });

});
describe('NextPreviousPage component test cases',() => {
    it('Calls onPrevClick prop when Next page button is clicked', () => {
        // Spy on onPrevClick prop function
        const onPrevClickSpy = jest.fn();
        const nextPrevComponent = shallow(<NextPreviousPage onPrevClick={onPrevClickSpy} />)
        nextPrevComponent.find('#prevBtn').simulate('click', { preventDefault() { } });
        expect(onPrevClickSpy).toHaveBeenCalled();


    });
    it('Calls onNextClick prop when Next page button is clicked', () => {
        // Spy on onNextClick prop function
        const onNextClickSpy = jest.fn();
        const nextPrevComponent = shallow(<NextPreviousPage onNextClick={onNextClickSpy} />)
        nextPrevComponent.find('#nextBtn').simulate('click', { preventDefault() { } });
        expect(onNextClickSpy).toHaveBeenCalled();

    });
});
describe('ToggleShoppingItem component icon click tests', ()=>{
    let toggleComponent;
    beforeEach(function (){
        toggleComponent = shallow(<ToggleShoppingItem />)
    });
    it('It opens up ShoppingItemForm when Add button is clicked', () => {
        
        toggleComponent.setState({isOpen: false});
        const addButton = toggleComponent.find('#add');
        addButton.simulate('click');
        // Test state change of isOpen
        // And if ShoppingItemForm is rendered.
        expect(toggleComponent.instance().state.isOpen).toEqual(true);
        expect(ShoppingItemForm).toHaveLength(1);
    });
    it('It opens up SearchShoppingItem when search button is clicked', () => {
        toggleComponent.setState({isSearchOpen: false});
        const searchButton = toggleComponent.find('#search');
        searchButton.simulate('click');
        // Test state change of isSearchOpen
        // And if ShoppingItemForm is rendered.
        expect(toggleComponent.instance().state.isSearchOpen).toEqual(true);
        expect(SearchShoppingItem).toHaveLength(1);

    });
    it('It opens up LimitShoppingItems when filter button is clicked', () => {
        toggleComponent.setState({isLimitOpen: false});
        const addButton = toggleComponent.find('#filter');
        addButton.simulate('click');
        // Test state change of isLimitOpen
        // And if ShoppingItemForm is rendered.
        expect(toggleComponent.instance().state.isLimitOpen).toEqual(true);
        expect(LimitShoppingItems).toHaveLength(1)
    });
    it('Changes state of isOpen when handleFormClose is invoked',()=>{
        toggleComponent.setState({ isOpen: true });
        toggleComponent.instance().handleFormClose();
        expect(toggleComponent.instance().state.isOpen).toBe(false);
    });
    it('Changes state of isSearchOpen when handleSearchClose is invoked',()=>{
        toggleComponent.setState({ isSearchOpen: true });
        toggleComponent.instance().handleSearchClose();
        expect(toggleComponent.instance().state.isSearchOpen).toBe(false);
    });
    it('Changes state of isLimitOpen when handleLimitClose is invoked',()=>{
        toggleComponent.setState({ isLimitOpen: true });
        toggleComponent.instance().handleLimitClose();
        expect(toggleComponent.instance().state.isLimitOpen).toBe(false);
    });
});
describe('ToggleShoppingItem spy method test cases',()=>{
    it('formSubmit is invoked on calling handleCreateSubmit', () => {
        const formSubmitSpy = jest.fn();
        const toggleComponent = shallow(<ToggleShoppingItem formSubmit={formSubmitSpy} />);
        toggleComponent.setState({ isOpen: true });
        toggleComponent.instance().handleCreateSubmit();
        expect(toggleComponent.instance().state.isOpen).toBe(false);
        expect(formSubmitSpy).toHaveBeenCalled();
    });
    it('onSearchSubmit is invoked on calling handleSearch', () => {
        const onSearchSubmitSpy = jest.fn();
        const toggleComponent = shallow(<ToggleShoppingItem onSearchSubmit={onSearchSubmitSpy} />);
        toggleComponent.setState({ isSearchOpen: true });
        toggleComponent.instance().handleSearch();
        expect(toggleComponent.instance().state.isSearchOpen).toBe(false);
        expect(onSearchSubmitSpy).toHaveBeenCalled();
    });
    it('onLimitSubmit is invoked on calling handleLimit', () => {
        const onLimitSubmitSpy = jest.fn();
        const toggleComponent = shallow(<ToggleShoppingItem onLimitSubmit={onLimitSubmitSpy} />);
        toggleComponent.setState({ isLimitOpen: true });
        toggleComponent.instance().handleLimit();
        expect(toggleComponent.instance().state.isLimitOpen).toBe(false);
        expect(onLimitSubmitSpy).toHaveBeenCalled();
    });
});