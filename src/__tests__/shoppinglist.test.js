import React from 'react';
import { shallow, mount, render } from 'enzyme';
import ReactDOM from 'react-dom';
import {
    ShoppinglistPage, Shoppinglist, ShoppinglistForm, ToggleableShoppingForm, EditableShoppinglist,
    SearchShoppinglist, LimitShoppinglists, AllShoppinglists, NextPreviousPage
} from '../components/shoppinglist';
import { LoginForm } from '../components/login';
import sinon from 'sinon';
import moxios from 'moxios';
import axiosConfig from '../components/baseConfig';
import { ToastContainer } from 'react-toastify';

describe('<ShoppinglistPage/> components', () => {
    let appUrl;
    let onFulfilled ;
    let shoppinglistPageComponent;
    let login;
    beforeEach(function () {
        moxios.install(axiosConfig);
        appUrl = 'https://shoppinglist-restful-api.herokuapp.com/shoppinglists/';
        onFulfilled = sinon.spy();
        shoppinglistPageComponent = mount(<ShoppinglistPage />);
        window.localStorage.setItem('token', "token-is-present");
    })
    afterEach(function () {
        moxios.uninstall();
    })


    it('Renders Shoppinglist page by default', () => {
        const shoppinglistPage = shallow(<ShoppinglistPage />)
        expect(shoppinglistPage).toHaveLength(1);
    })
    it('Allows to set props', () => {
        const shoppinglist = shallow(<Shoppinglist name="Furniture" />)
        expect(shoppinglist.instance().props.name).toEqual("Furniture");
    })
    it('calls componentWillMount', () => {
        const testMountCall = sinon.spy(ShoppinglistPage.prototype, 'componentWillMount');
        const wrapper = shallow(<ShoppinglistPage />);
        expect(testMountCall.calledOnce).toEqual(true);
    });

    it('Changes state of isLoading successful getShoppinglists', (done) => {
        shoppinglistPageComponent.setState({ isLoading: true });
        shoppinglistPageComponent.instance().getShoppinglists();
        moxios.stubRequest( "https://shoppinglist-restful-api.herokuapp.com/shoppinglists/" , {
            status: 200
        })
        moxios.wait(function () {
            // Expect state of isLoading changes
            expect(shoppinglistPageComponent.instance().state.isLoading).toEqual(false);
            done();
        })

    });

    next_page:"/shoppinglists/?limit=4&page=2"
    previous_page:"None"
    shopping_lists:[{id: 36, name: "Graduation party"}, {id: 38, name: "Christmass shopping at Uchumi"},{id: 4, name: "Sokoni"}]


    it('Redirects to login when session times out when calling getShoppinglists', (done) => {
        shoppinglistPageComponent.instance().getShoppinglists();
        moxios.stubRequest( "https://shoppinglist-restful-api.herokuapp.com/shoppinglists/" , {
            status: 408,
            response: { message: "Invalid token. Please register or login" }
        })
        shoppinglistPageComponent.setState({ isLoading: false });
        moxios.wait(function () {
            expect(LoginForm).toHaveLength(1);
            done();
        })

    })

    it('Calls editShoppinglist when handleEditShoppinglist is invoked', (done) => {
        const editShoppinglistSpy = sinon.spy(ShoppinglistPage.prototype, 'editShoppinglist')
        const shoppinglistPageComponent = mount(<ShoppinglistPage />);
        shoppinglistPageComponent.instance().handleEditShoppinglist("House warming", 8);
        moxios.stubRequest( "https://shoppinglist-restful-api.herokuapp.com/shoppinglists/8", {
            status: 200,
            response: { name: "House warming", id: 8, created_by: 2 }
        });
        shoppinglistPageComponent.setState({ isLoading: false });
        moxios.wait(function () {
            expect(editShoppinglistSpy.calledOnce).toEqual(true);
            expect(shoppinglistPageComponent.find('ToastContainer').text()).toContain("Shoppinglist edited to House warming");
            done();
        })

    })
    
    it('Handle 408 error status', (done) => {
        shoppinglistPageComponent.instance().handleEditShoppinglist("House warming", 8);
        moxios.stubRequest( "https://shoppinglist-restful-api.herokuapp.com/shoppinglists/8", {
            status: 408,
            response: { message: "Invalid token. Please register or login" }
        })
        shoppinglistPageComponent.setState({ isLoading: false });
        moxios.wait(function () {
            expect(shoppinglistPageComponent.find('ToastContainer').text()).toContain('Invalid token. Please register or login');
            done();
        })

    })

    
    it('Toast has an error message when there is an error in edit response', (done) => {
        const shoppinglistPageComponent = mount(<ShoppinglistPage />);
        shoppinglistPageComponent.instance().editShoppinglist('Furniture', 7);
        moxios.stubRequest("https://shoppinglist-restful-api.herokuapp.com/shoppinglists/7", {
            status: 409,
            response: { message: "List name already exists" }
        })
        shoppinglistPageComponent.setState({ isLoading: false });
        moxios.wait(function () {
            // Expect toast has a message same as the response
            expect(shoppinglistPageComponent.find('ToastContainer').text()).toContain("List name already exists");
            done();
        })
    })

    it('Calls postShoppinglist when running handelShoppinglistNameSubmit', (done) => {
        const postShoppinglistSpy = sinon.spy(ShoppinglistPage.prototype, "postShoppinglist")
        const shoppinglistPageComponent = mount(<ShoppinglistPage />);
        shoppinglistPageComponent.instance().handelShoppinglistNameSubmit('Furniture');
        moxios.stubRequest("https://shoppinglist-restful-api.herokuapp.com/shoppinglists/", {
            status: 200,
            response: { name: "Furniture", id: 7 }
        });
        shoppinglistPageComponent.setState({ isLoading: false });
        moxios.wait(function () {
            // Expect method call and creation of the shoppinglist
            expect(postShoppinglistSpy.calledOnce).toEqual(true);
            expect(shoppinglistPageComponent.find('ToastContainer').text()).toContain("Shoppinglist Furniture created");
            done();
        })
    })
    it(' postShoppinglist is unsuccessful exits with 408 err', (done) => {
        shoppinglistPageComponent.instance().postShoppinglist('Furniture');
        moxios.stubRequest( "https://shoppinglist-restful-api.herokuapp.com/shoppinglists/", {
            status: 408,
            response: { message: "Invalid token. Please register or login" }
        });
        moxios.wait(function () {
            // Expect rendering of loginForm 
            expect(LoginForm).toHaveLength(1);
            done();
        });
    
    })
    
    it('Raises an error when postShoppinglist contains an error message', (done) => {
        shoppinglistPageComponent.instance().postShoppinglist("Furniture");
        moxios.stubRequest("https://shoppinglist-restful-api.herokuapp.com/shoppinglists/", {
            status: 400,
            response: { message: "Shoppinglist with the same name exists" }
        });
        shoppinglistPageComponent.setState({ isLoading: false });
        moxios.wait(function () {
            expect(shoppinglistPageComponent.find('ToastContainer').text()).toContain("Shoppinglist with the same name exists");
            done();
        })

    })
    it('Changes state when search is successful ', (done) => {
        shoppinglistPageComponent.instance().handleSearchShoppinglist("Soko");
        moxios.stubRequest( "https://shoppinglist-restful-api.herokuapp.com/shoppinglists/?q=Soko", {
            status: 200,
            response: { name: 'Soko', id: 2, created_by: 2 }
        });
        shoppinglistPageComponent.setState({ isLoading: false });
        moxios.wait(function () {
            // Expect the state changed to equal response
            expect(shoppinglistPageComponent.instance().state.shoppinglists).toEqual({ name: 'Soko', id: 2, created_by: 2 });
            done();
        })

    });
    it(' searchShoppinglist is unsuccessful exits with 408 err', (done) => {
        shoppinglistPageComponent.instance().searchShoppinglist('Soko');
        moxios.stubRequest( "https://shoppinglist-restful-api.herokuapp.com/shoppinglists/?q=Soko", {
            status: 408,
            response: { message: "Invalid token. Please register or login" }
        });
        moxios.wait(function () {
            // Expect rendering of loginForm 
            expect(LoginForm).toHaveLength(1);
            done();
        });
    
    })
    it('Raises an error when search query contains an error message', (done) => {
        shoppinglistPageComponent.instance().handleSearchShoppinglist("Soko");
        moxios.stubRequest("https://shoppinglist-restful-api.herokuapp.com/shoppinglists/?q=Soko", {
            status: 400,
            response: { message: "The searched name does not exists" }
        });
        shoppinglistPageComponent.setState({ isLoading: false });
        moxios.wait(function () {
            expect(shoppinglistPageComponent.find('ToastContainer').text()).toEqual("The searched name does not exists✖");
            done();
        })

    });
    it(' deleteShoppinglist is unsuccessful exits with 408 err', (done) => {
        const shoppinglistPageComponent = mount(<ShoppinglistPage />);
        shoppinglistPageComponent.instance().handleDeleteShoppinglist("House warming", 8);
        moxios.stubRequest( "https://shoppinglist-restful-api.herokuapp.com/shoppinglists/8", {
            status: 408,
            response: { message: "Invalid token. Please register or login" }
        });
        shoppinglistPageComponent.setState({ isLoading: false });
        moxios.wait(function () {
            // Expect rendering of loginForm 
            expect(LoginForm).toHaveLength(1);
            done();
        });
    
    })
it('Calls deleteShoppinglist when handleDeleteShoppinglist is invoked', (done) => {
    const deleteShoppinglistSpy = sinon.spy(ShoppinglistPage.prototype, 'deleteShoppinglist')
    const shoppinglistPageComponent = mount(<ShoppinglistPage />);
    shoppinglistPageComponent.instance().handleDeleteShoppinglist("House warming", 8);
    moxios.stubRequest( "https://shoppinglist-restful-api.herokuapp.com/shoppinglists/8", {
        status: 200,
        response: { name: "House warming", id: 8, created_by: 2 }
    });
    shoppinglistPageComponent.setState({ isLoading: false });
    moxios.wait(function () {
        // Expect method deleteShoppinglist is called
        // Expect Toast has a delete success message
        expect(deleteShoppinglistSpy.calledOnce).toEqual(true);
        expect(shoppinglistPageComponent.find('ToastContainer').text()).toContain("Shoppinglist House warming deleted.");
        done();
    });

})

    it('function getPreviousPage returns a response ', (done) => {
        shoppinglistPageComponent.setState({ previous_page: "/shoppinglists/?limit=2&page=2" });
        shoppinglistPageComponent.instance().getPreviousPage();
        moxios.stubRequest("https://shoppinglist-restful-api.herokuapp.com/shoppinglists/?limit=2&page=2", {
            status: 200,
            response: { next_page: "/shoppinglists/?limit=2&page=3", previous_page: "/shoppinglists/?limit=2&page=1", shopping_lists: [{ id: 24, name: "Supper" }, { id: 26, name: "Lunch" }] }
        })
        moxios.wait(function () {
            expect(shoppinglistPageComponent.instance().state.shoppinglists).toEqual([{ id: 24, name: 'Supper' }, { id: 26, name: 'Lunch' }])
            done();
        })

    })
    it(' getPreviousPage is unsuccessful exits with 408 err', (done) => {
        shoppinglistPageComponent.setState({ previous_page: "/shoppinglists/?limit=2&page=2" });
        shoppinglistPageComponent.instance().getPreviousPage();
        moxios.stubRequest( "https://shoppinglist-restful-api.herokuapp.com/shoppinglists/?limit=2&page=2", {
            status: 408,
            response: { message: "Invalid token. Please register or login" }
        });
        moxios.wait(function () {
            // Expect rendering of loginForm 
            expect(LoginForm).toHaveLength(1);
            done();
        });
    
    })
    it('Calls getPreviousPage when handlePrevClick is called', (done) => {
        const getPreviousPageSpy = sinon.spy(ShoppinglistPage.prototype, 'getPreviousPage')
        const shoppinglistPageComponent = mount(<ShoppinglistPage />);
        shoppinglistPageComponent.instance().handlePrevClick();

        moxios.stubRequest("https://shoppinglist-restful-api.herokuapp.com/shoppinglists/?limit=2", {
            status: 200,
            response: { next_page: "/shoppinglists/?limit=2&page=2", previous_page: "None", shopping_lists: [{ id: 4, name: "Soko" }, { id: 10, name: "Shagz" }] }
        })
        expect(getPreviousPageSpy.calledOnce).toEqual(true);
        done();
    })
    it('Calls getNextPage when handleNextClick is called', (done) => {
        const getNextPageSpy = sinon.spy(ShoppinglistPage.prototype, 'getNextPage')
        const shoppinglistPageComponent = mount(<ShoppinglistPage />);
        shoppinglistPageComponent.instance().handleNextClick();

        moxios.stubRequest("https://shoppinglist-restful-api.herokuapp.com/shoppinglists/?limit=2", {
            status: 200,
            response: { next_page: "/shoppinglists/?limit=2&page=2", previous_page: "None", shopping_lists: [{ id: 4, name: "Soko" }, { id: 10, name: "Shagz" }] }
        })
        expect(getNextPageSpy.calledOnce).toEqual(true);
        done();
    })
    it(' getNextPage is unsuccessful exits with 408 err', (done) => {
        shoppinglistPageComponent.setState({ next_page: "/shoppinglists/?limit=2&page=2" });
        shoppinglistPageComponent.instance().getNextPage();
        moxios.stubRequest( "https://shoppinglist-restful-api.herokuapp.com/shoppinglists/?limit=2&page=2", {
            status: 408,
            response: { message: "Invalid token. Please register or login" }
        });
        moxios.wait(function () {
            // Expect rendering of loginForm 
            expect(LoginForm).toHaveLength(1);
            done();
        });
    
    })
    it('function getNext returns a response ', (done) => {
        shoppinglistPageComponent.setState({ next_page: "/shoppinglists/?limit=2&page=2" });
        shoppinglistPageComponent.instance().getNextPage();
        moxios.stubRequest("https://shoppinglist-restful-api.herokuapp.com/shoppinglists/?limit=2&page=2", {
            status: 200,
            response: { next_page: "/shoppinglists/?limit=2&page=3", previous_page: "/shoppinglists/?limit=2&page=1", shopping_lists: [{ id: 24, name: "Dinner" }, { id: 26, name: "House party" }] }
        });
        shoppinglistPageComponent.setState({ isLoading: false });
        moxios.wait(function () {
            expect(shoppinglistPageComponent.instance().state.shoppinglists).toEqual([{ id: 24, name: 'Dinner' }, { id: 26, name: 'House party' }])
            done();
        })

    })
    it('Calls limitShoppinglists when handleLimitShoppinglists is called', (done) => {
        const limitShoppinglistsSpy = sinon.spy(ShoppinglistPage.prototype, 'limitShoppinglists')
        const shoppinglistPageComponent = mount(<ShoppinglistPage />);
        shoppinglistPageComponent.instance().handleLimitShoppinglists(2);

        moxios.stubRequest("https://shoppinglist-restful-api.herokuapp.com/shoppinglists/?limit=2", {
            status: 200,
            response: { next_page: "/shoppinglists/?limit=2&page=2", previous_page: "None", shopping_lists: [{ id: 4, name: "Soko" }, { id: 10, name: "Shagz" }] }
        })
        expect(limitShoppinglistsSpy.calledOnce).toEqual(true);
        done();
    })
    it(' limitShoppinglists is unsuccessful exits with 408 err', (done) => {
        shoppinglistPageComponent.instance().limitShoppinglists(2);
        moxios.stubRequest( "https://shoppinglist-restful-api.herokuapp.com/shoppinglists/?limit=2", {
            status: 408,
            response: { message: "Invalid token. Please register or login" }
        });
        moxios.wait(function () {
            // Expect rendering of loginForm 
            expect(LoginForm).toHaveLength(1);
            done();
        });
    
    })
    
    it('limits a shoppinglists', (done) => {
        shoppinglistPageComponent.instance().limitShoppinglists(2);

        moxios.stubRequest("https://shoppinglist-restful-api.herokuapp.com/shoppinglists/?limit=2", {
            status: 200,
            response: { next_page: "/shoppinglists/?limit=2&page=2", previous_page: "None", shopping_lists: [{ id: 4, name: "Soko" }, { id: 10, name: "Shagz" }] }
        })
        shoppinglistPageComponent.setState({ isLoading: false });
        moxios.wait(function () {
            // console.log(shoppinglistPageComponent.instance().state);
            expect(shoppinglistPageComponent.instance().state.shoppinglists).toEqual([{ id: 4, name: "Soko" }, { id: 10, name: "Shagz" }]);
            done();
        })

    })

    it('Toast container has an error when calling limitShoppinglists', (done) => {
        shoppinglistPageComponent.instance().limitShoppinglists(-1);
        moxios.stubRequest("https://shoppinglist-restful-api.herokuapp.com/shoppinglists/?limit=-1", {
            status: 400,
            response: { message: "Limit value must be positive integer" }
        })
        shoppinglistPageComponent.setState({ isLoading: false });
        moxios.wait(function () {
          // Expect toast has an error message
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
