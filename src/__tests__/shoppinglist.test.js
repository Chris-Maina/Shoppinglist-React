import React from 'react';
import { shallow, mount, render } from 'enzyme';
import ReactDOM from 'react-dom';
import {
    ShoppinglistPage, Shoppinglist, ShoppinglistForm, ToggleableShoppingForm, EditableShoppinglist,
    SearchShoppinglist, LimitShoppinglists, AllShoppinglists, NextPreviousPage
} from '../components/shoppinglist';
import sinon from 'sinon';
import moxios from 'moxios';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';

describe('<ShoppinglistPage/> components', () => {
    beforeEach(function () {
        moxios.install()
    })
    afterEach(function () {
        moxios.uninstall()
    })


    it('Renders Shoppinglist page by default', () => {
        const shoppinglistPage = shallow(<ShoppinglistPage />)
        expect(shoppinglistPage).toHaveLength(1);
    })
    it('Allows to set props', () => {
        const shoppinglist = shallow(<Shoppinglist name="Furniture" />)
        expect(shoppinglist.instance().props.name).toEqual("Furniture");
    })
    it('calls componentDidMount', () => {
        const testMountCall = sinon.spy(ShoppinglistPage.prototype, 'componentDidMount');
        const wrapper = shallow(<ShoppinglistPage />);
        expect(testMountCall.calledOnce).toEqual(true);
    });

    it('Posts a shoppinglist', () => {
        const shoppinglist_page = shallow(<ShoppinglistForm />)
        const form = shoppinglist_page.find('Form')
        const inputName = shoppinglist_page.find("Input[name='shoppinglistname']")
        const event = {
            target: {
                value: 'Back to school'
            },
            preventDefault: () => {
                return true
            }
        }
        inputName.simulate('change', event);
        form.simulate('submit', { preventDefault() { } });

        moxios.wait(function () {
            let request = moxios.request.mostRecent()
            request.respondWith({
                status: 200,
                respondText: { name: "Back to school", id: 1 }
            }).then(function () {
                expect(shoppinglist_page.contains('Back to school')).to.equal(true)

            })
        })

    })

    it('Edits a shoppinglist', () => {
        const baseProps = {
            onFormSubmit: jest.fn(),
        }
        const shoppingFormComponent = shallow(<ShoppinglistForm {...baseProps} />)
        axios.post('https://shoppinglist-restful-api.herokuapp.com/shoppinglists/', {
            name: 'market'
        })
        const editBtn = shoppingFormComponent.find("#update_create")

        shoppingFormComponent.setState({ name: 'Soko' })

        editBtn.simulate('click', { preventDefault() { } })
        moxios.wait(function () {
            let request = moxios.request.mostRecent()
            request.respondWith({
                status: 200,
                respondText: { name: "Soko", id: 1 }
            }).then(function () {
                expect(<Shoppinglist />).toHaveLength(1)
                expect(shoppingFormComponent.contains('Soko')).to.equal(true)

            })
        })
    })
    it('Toast has an error when you submit a list that exists when editing', () => {
        const baseProps = {
            onFormSubmit: jest.fn(),
        }
        const shoppingFormComponent = shallow(<ShoppinglistForm {...baseProps} />)
        const toastContainer = shallow(<ToastContainer />)
        axios.post('https://shoppinglist-restful-api.herokuapp.com/shoppinglists/', {
            name: 'market'
        })
        axios.post('https://shoppinglist-restful-api.herokuapp.com/shoppinglists/', {
            name: 'soko'
        })
        const editBtn = shoppingFormComponent.find("#update_create")

        shoppingFormComponent.setState({ name: 'soko' })

        editBtn.simulate('click', { preventDefault() { } })
        moxios.wait(function () {
            let request = moxios.request.mostRecent()
            request.respondWith({
                status: 200,
                respondText: { name: "Error" }
            }).then(function () {
                expect(<Shoppinglist />).toHaveLength(1)
                expect(toastContainer.contains('List name already exists. Please use different name')).to.equal(true)

            })
        })
    })
    it('Raises an error when search query contains an error message', (done) => {
        const shoppinglistPageComponent = mount(<ShoppinglistPage />);
        shoppinglistPageComponent.instance().handleSearchShoppinglist("Soko");
        moxios.stubRequest('https://shoppinglist-restful-api.herokuapp.com/shoppinglists/?q=Soko', {
            status: 400,
            responseText: { message: "The searched name does not exists" }
        })
        moxios.wait(function () {
            expect(shoppinglistPageComponent.find('ToastContainer').text()).toEqual("The searched name does not exists✖");
            done();
        })

    })
    it('Deletes a shoppinglist', () => {
        const shoppinglistPageComponent = mount(<ShoppinglistPage />);
        shoppinglistPageComponent.instance().deleteShoppinglist("Soko", 6);

        moxios.stubRequest('https://shoppinglist-restful-api.herokuapp.com/shoppinglists/6', {
            status: 200
        })

        moxios.wait(function () {
            expect(shoppinglistPageComponent.find('ToastContainer').text()).toEqual("Shoppinglist Soko deleted.");
            done();
        })
    })
    // it('toast has an information message when state previous_page = None ', (done) => {
    //     const shoppinglistPageComponent = mount(<ShoppinglistPage />);
    //     shoppinglistPageComponent.setState({ previous_page: "None"  });
    //     shoppinglistPageComponent.instance().getPreviousPage();
    //     expect(shoppinglistPageComponent.find('ToastContainer')).toContain('There are no shoppinglist in previous page');

    // })
    it('function getPreviousPage returns a response ', (done) => {
        const shoppinglistPageComponent = mount(<ShoppinglistPage />);
        shoppinglistPageComponent.setState({ previous_page: "/shoppinglists/?limit=2&page=2"  });
        shoppinglistPageComponent.instance().getPreviousPage();
        moxios.stubRequest('https://shoppinglist-restful-api.herokuapp.com/shoppinglists/?limit=2&page=2', {
            status: 200,
            responseText: {next_page: "/shoppinglists/?limit=2&page=3", previous_page: "/shoppinglists/?limit=2&page=1", shopping_lists: [{id: 24, name: "Supper"},{id: 26, name: "Lunch"}]}
        })
        moxios.wait(function () {
            expect(shoppinglistPageComponent.instance().state.shoppinglists).toEqual([ { id: 24, name: 'Supper' }, { id: 26, name: 'Lunch' } ])
            done();
        })

    })
    it('Calls getPreviousPage when handlePrevClick is called', () => {
        const getPreviousPageSpy = sinon.spy(ShoppinglistPage.prototype, 'getPreviousPage')
        const shoppinglistPageComponent = mount(<ShoppinglistPage />);
        shoppinglistPageComponent.instance().handlePrevClick();

        moxios.stubRequest('https://shoppinglist-restful-api.herokuapp.com/shoppinglists/?limit=2', {
            status: 200,
            responseText: { next_page: "/shoppinglists/?limit=2&page=2", previous_page: "None", shopping_lists: [{id: 4, name: "Soko"},{id: 10, name: "Shagz"}] }
        })
        expect(getPreviousPageSpy.calledOnce).toEqual(true);
    })
    it('Calls getNextPage when handleNextClick is called', () => {
        const getNextPageSpy = sinon.spy(ShoppinglistPage.prototype, 'getNextPage')
        const shoppinglistPageComponent = mount(<ShoppinglistPage />);
        shoppinglistPageComponent.instance().handleNextClick();

        moxios.stubRequest('https://shoppinglist-restful-api.herokuapp.com/shoppinglists/?limit=2', {
            status: 200,
            responseText: { next_page: "/shoppinglists/?limit=2&page=2", previous_page: "None", shopping_lists: [{id: 4, name: "Soko"},{id: 10, name: "Shagz"}] }
        })
        expect(getNextPageSpy.calledOnce).toEqual(true);
    })
    it('function getNext returns a response ', (done) => {
        const shoppinglistPageComponent = mount(<ShoppinglistPage />);
        shoppinglistPageComponent.setState({ next_page: "/shoppinglists/?limit=2&page=2"  });
        shoppinglistPageComponent.instance().getNextPage();
        moxios.stubRequest('https://shoppinglist-restful-api.herokuapp.com/shoppinglists/?limit=2&page=2', {
            status: 200,
            responseText: {next_page: "/shoppinglists/?limit=2&page=3", previous_page: "/shoppinglists/?limit=2&page=1", shopping_lists: [{id: 24, name: "Dinner"},{id: 26, name: "House party"}]}
        })
        moxios.wait(function () {
            expect(shoppinglistPageComponent.instance().state.shoppinglists).toEqual([ { id: 24, name: 'Dinner' }, { id: 26, name: 'House party' } ])
            done();
        })

    })
    it('Calls limitShoppinglists when handleLimitShoppinglists is called', () => {
        const limitShoppinglistsSpy = sinon.spy(ShoppinglistPage.prototype, 'limitShoppinglists')
        const shoppinglistPageComponent = mount(<ShoppinglistPage />);
        shoppinglistPageComponent.instance().handleLimitShoppinglists(2);

        moxios.stubRequest('https://shoppinglist-restful-api.herokuapp.com/shoppinglists/?limit=2', {
            status: 200,
            responseText: { next_page: "/shoppinglists/?limit=2&page=2", previous_page: "None", shopping_lists: [{id: 4, name: "Soko"},{id: 10, name: "Shagz"}] }
        })
        expect(limitShoppinglistsSpy.calledOnce).toEqual(true);
    })
    it('limits a shoppinglists', (done) => {
        const shoppinglistPageComponent = mount(<ShoppinglistPage />);
        shoppinglistPageComponent.instance().limitShoppinglists(2);

        moxios.stubRequest('https://shoppinglist-restful-api.herokuapp.com/shoppinglists/?limit=2', {
            status: 200,
            responseText: { next_page: "/shoppinglists/?limit=2&page=2", previous_page: "None", shopping_lists: [{id: 4, name: "Soko"},{id: 10, name: "Shagz"}] }
        })

        moxios.wait(function () {
            // console.log(shoppinglistPageComponent.instance().state);
            expect(shoppinglistPageComponent.instance().state.shoppinglists).toEqual([{id: 4, name: "Soko"},{id: 10, name: "Shagz"}]);
            done();
        })

    })
    
    it('Toast container has an error when calling limitShoppinglists', (done) => {
        const shoppinglistPageComponent = mount(<ShoppinglistPage />);
        shoppinglistPageComponent.instance().limitShoppinglists(-1);

        moxios.stubRequest('https://shoppinglist-restful-api.herokuapp.com/shoppinglists/?limit=-1', {
            status: 400,
            responseText: { message: "Limit value must be positive integer" }
        })

        moxios.wait(function () {
            // console.log(shoppinglistPageComponent.find('ToastContainer').text());
            expect(shoppinglistPageComponent.find('ToastContainer').text()).toContain('Limit value must be positive integer');
            done();
        })

    })


})
describe('NextPreviousPage component test cases', () => {
    it('Calls onPrevClick prop when Next page button is clicked', () => {
        // Spy on onPrevClick prop function
        const onPrevClickSpy = jest.fn();
        const nextPrevComponent = shallow(<NextPreviousPage onPrevClick={onPrevClickSpy} />)
        nextPrevComponent.find('#prevBtn').simulate('click', { preventDefault() { } });
        expect(onPrevClickSpy).toHaveBeenCalled();

    })
    it('Calls onNextClick prop when Next page button is clicked', () => {
        // Spy on onNextClick prop function
        const onNextClickSpy = jest.fn();
        const nextPrevComponent = shallow(<NextPreviousPage onNextClick={onNextClickSpy} />)
        nextPrevComponent.find('#nextBtn').simulate('click', { preventDefault() { } });
        expect(onNextClickSpy).toHaveBeenCalled();

    })
})
describe('ToggleShoppingForm component icon click tests', () => {
    it('It opens up ShoppingListForm when Add button is clicked', () => {
        const toggleComponent = shallow(<ToggleableShoppingForm />)
        const addButton = toggleComponent.find('#add')
        addButton.simulate('click')
        expect(ShoppinglistForm).toHaveLength(1)

    })
    it('It opens up SearchShoppinglist when search button is clicked', () => {
        const toggleComponent = shallow(<ToggleableShoppingForm />)
        const addButton = toggleComponent.find('#search')
        addButton.simulate('click')
        expect(SearchShoppinglist).toHaveLength(1)

    })
    it('It opens up LimitShoppinglist when filter button is clicked', () => {
        const toggleComponent = shallow(<ToggleableShoppingForm />)
        const addButton = toggleComponent.find('#filter')
        addButton.simulate('click')
        expect(LimitShoppinglists).toHaveLength(1)

    })
    it('Changes state of isLimitOpen on calling handleLimit', () => {
        // Spy onLimitSubmit prop function
        const onLimitSubmitSpy = jest.fn();
        const toggleComponent = shallow(<ToggleableShoppingForm onLimitSubmit={onLimitSubmitSpy} />);
        toggleComponent.setState({ isLimitOpen: true });
        toggleComponent.instance().handleLimit(4);
        expect(toggleComponent.instance().state.isLimitOpen).toBe(false);
    })
    it('Changes state of isLimitOpen on calling handleLimitClose', () => {
        const toggleComponent = shallow(<ToggleableShoppingForm />);
        toggleComponent.setState({ isLimitOpen: true });
        toggleComponent.instance().handleLimitClose();
        expect(toggleComponent.instance().state.isLimitOpen).toBe(false);
    })
    it('Changes state of isSearchOpen on calling handleSearch', () => {
        // Spy onSearchSubmit prop function
        const onSearchSubmitSpy = jest.fn();
        const toggleComponent = shallow(<ToggleableShoppingForm onSearchSubmit={onSearchSubmitSpy} />);
        toggleComponent.setState({ isSearchOpen: true });
        toggleComponent.instance().handleSearch('Furniture');
        expect(toggleComponent.instance().state.isSearchOpen).toBe(false);
    })
    it('Changes state of isSearchOpen on calling handleSearchClose', () => {
        const toggleComponent = shallow(<ToggleableShoppingForm />);
        toggleComponent.setState({ isSearchOpen: true });
        toggleComponent.instance().handleSearchClose();
        expect(toggleComponent.instance().state.isSearchOpen).toBe(false);
    })
    it('Changes state of isOpen on calling handleFormClose', () => {
        const toggleComponent = shallow(<ToggleableShoppingForm />);
        toggleComponent.setState({ isOpen: true });
        toggleComponent.instance().handleFormClose();
        expect(toggleComponent.instance().state.isOpen).toBe(false);
    })
    it('Changes state of isOpen on calling handleFormSubmit', () => {
        const formSubmitSpy = jest.fn();
        const toggleComponent = shallow(<ToggleableShoppingForm formSubmit={formSubmitSpy} />);
        toggleComponent.setState({ isOpen: true });
        toggleComponent.instance().handleFormSubmit();
        expect(toggleComponent.instance().state.isOpen).toBe(false);
    })
})
describe('AllShoppinglists component test cases', () => {
    it('Returns 3 EditableShoppinglist containing shoppinglists on receivng the props shopping_list', () => {
        const shoppinglists = [{ id: 2, name: 'Graduation' }, { id: 6, name: 'Soko' }, { id: 7, name: 'Furniture' }]
        const allShoppinglistComponent = shallow(<AllShoppinglists shopping_lists={shoppinglists} />)
        expect(allShoppinglistComponent.find('EditableShoppinglist')).toHaveLength(3);
    })
    it('Returns a div containing string on receivng the props shopping_list', () => {
        const shoppinglists = "You have no shoppinglist"
        const allShoppinglistComponent = shallow(<AllShoppinglists shopping_lists={shoppinglists} />)
        expect(allShoppinglistComponent.dive().text()).toEqual("<Row />");
    })
})
describe('EditableShoppinglist component test cases', () => {
    it('Renders EditableShoppinglist component with', () => {
        const message = "You have no shoppinglist";
        const editableShoppinglistComponent = shallow(<EditableShoppinglist shoppinglist={message} />)
        expect(editableShoppinglistComponent.find('Card')).toBeDefined();
    })
    it('Shows the ShoppinglistForm when editForm state is true', () => {
        const editableShoppinglistComponent = shallow(<EditableShoppinglist />)
        editableShoppinglistComponent.setState({ editForm: true })
        expect(editableShoppinglistComponent.find('ShoppinglistForm')).toHaveLength(1);
    })
    it('Changes state of editForm on calling handleFormSubmit', () => {
        // Create a spy method for editFormSubmit 
        const editFormSubmit = jest.fn();
        // Pass the prop on the parent
        const editableShoppinglistComponent = shallow(<EditableShoppinglist editFormSubmit={editFormSubmit} />);
        // Set the state of editForm to true
        editableShoppinglistComponent.setState({ editForm: true });
        // Call the method handleFormSubmit with arguments
        editableShoppinglistComponent.instance().handleFormSubmit('Furniture', 2);
        expect(editableShoppinglistComponent.instance().state.editForm).toEqual(false);
    })
    it('Calls the props function', () => {
        // Create a spy for props function,deleteSubmit
        const deleteSubmitSpy = jest.fn();
        // Pass the prop on the parent
        const editableShoppinglistComponent = shallow(<EditableShoppinglist deleteSubmit={deleteSubmitSpy} />);
        // Call the wrapper method
        editableShoppinglistComponent.instance().handleDeleteBtnClick();
        expect(deleteSubmitSpy).toHaveBeenCalled();

    })
    it('Changes state of editForm when handleEditBtnClick method is called', () => {
        const editableShoppinglistComponent = shallow(<EditableShoppinglist />);
        editableShoppinglistComponent.instance().handelEditBtnClick();
        expect(editableShoppinglistComponent.instance().state.editForm).toEqual(true);
    })
    it('Changes state of editForm when handleFormClose method is called', () => {
        const editableShoppinglistComponent = shallow(<EditableShoppinglist />);
        // Set the state of editForm to true
        editableShoppinglistComponent.setState({ editForm: true });
        editableShoppinglistComponent.instance().handleFormClose();
        expect(editableShoppinglistComponent.instance().state.editForm).toEqual(false);
    })
})
describe('ShoppingListForm component test cases', () => {
    it('Closes the component on cancel button click ', () => {
        const onFormCloseSpy = jest.fn();
        const shoppingFormComponent = shallow(<ShoppinglistForm onFormClose={onFormCloseSpy} />)
        const cancelButton = shoppingFormComponent.find('#cancel')
        cancelButton.simulate('click', { preventDefault() { } })
        expect(onFormCloseSpy).toHaveBeenCalled();
    })
    it('Changes name state when on change event is called', () => {
        const shoppingFormComponent = shallow(<ShoppinglistForm />)
        const inputName = shoppingFormComponent.find("Input[name='shoppinglistname']")
        const event = {
            target: {
                value: 'Furniture'
            },
            preventDefault: () => { }
        }
        inputName.simulate('change', event);
        expect(shoppingFormComponent.instance().state.name).toBe('Furniture')
    })
    it('Show ShoppinglistForm component on edit button click', () => {
        const shoppinglistComponent = shallow(<Shoppinglist />);
        const editBtn = shoppinglistComponent.find('#edit');
        editBtn.simulate('click');
        expect(ShoppinglistForm).toHaveLength(1);
    })

})
describe('LimitShoppinglist Component', () => {
    it('Changes state when change event is called', () => {
        const limitShoppinglistComponent = shallow(<LimitShoppinglists />)
        const inputLimit = limitShoppinglistComponent.find("Input[name='limit']")
        const event = {
            target: {
                value: 1
            },
            preventDefault: () => { }
        }
        inputLimit.simulate('change', event);
        expect(limitShoppinglistComponent.instance().state.limit).toBe(1);
    })
    it('Calls the onCancelClick prop function on cancel click', () => {
        const onCancelClickSpy = jest.fn();
        const limitShoppinglistComponent = shallow(<LimitShoppinglists onCancelClick={onCancelClickSpy} />);
        const cancelButton = limitShoppinglistComponent.find('#limitCancel');
        cancelButton.simulate('click', { preventDefault() { } });
        expect(onCancelClickSpy).toHaveBeenCalled();
    })
    it('Calls the onLimitSubmit prop function on limit click', () => {
        const onLimitSubmitSpy = jest.fn();
        const limitShoppinglistComponent = shallow(<LimitShoppinglists onLimitSubmit={onLimitSubmitSpy} />);
        const cancelButton = limitShoppinglistComponent.find('#limit');
        cancelButton.simulate('click', { preventDefault() { } });
        expect(onLimitSubmitSpy).toHaveBeenCalled();
    })
})
describe('SearchShoppinglist component', () => {
    it('Renders the SearchShoppinglist component', () => {
        const searchShoppinglistComponent = shallow(<SearchShoppinglist />);
        expect(searchShoppinglistComponent).toHaveLength(1);
    })
    it('Calls onCancelClick prop function ', () => {
        const onCancelClickSpy = jest.fn();
        const searchShoppinglistComponent = shallow(<SearchShoppinglist onCancelClick={onCancelClickSpy} />);
        const cancelButton = searchShoppinglistComponent.find('#searchCancelBtn')
        cancelButton.simulate('click', { preventDefault() { } })
        expect(onCancelClickSpy).toHaveBeenCalled();

    })
    it('Changes state of searchtext when user types', () => {
        const searchShoppinglistComponent = shallow(<SearchShoppinglist />);
        const event = {
            target: {
                value: 'Soko'
            },
            preventDefault: () => { }
        };
        const inputSearchText = searchShoppinglistComponent.find("Input[name='searchtext']");
        inputSearchText.simulate('change', event);
        expect(searchShoppinglistComponent.instance().state.searchText).toBe('Soko');
    })
    it('Calls the onSearchSubmit prop function', () => {
        const onSearchSubmitSpy = jest.fn();
        const searchShoppinglistComponent = shallow(<SearchShoppinglist onSearchSubmit={onSearchSubmitSpy} />);
        const searchForm = searchShoppinglistComponent.find('Form');
        searchForm.simulate('submit', { preventDefault() { } });
        expect(onSearchSubmitSpy).toHaveBeenCalled();

    })

})
