import React from 'react';
import { shallow, mount, render } from 'enzyme';
import ReactDOM from 'react-dom';
import { ShoppinglistPage, Shoppinglist, ShoppinglistForm, ToggleableShoppingForm, EditableShoppinglist, SearchShoppinglist, LimitShoppinglists } from '../components/shoppinglist';
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
    it('Deletes a shoppinglist', () => {
        const shoppingComponent = shallow(<Shoppinglist />)
        axios.post('https://shoppinglist-restful-api.herokuapp.com/shoppinglists/', {
            name: 'market'
        })
        const deleteBtn = shoppingComponent.find("#delete")
        expect(shoppingComponent).toHaveLength(1)
        deleteBtn.simulate('click', { preventDefault() { } })
        moxios.wait(function () {
            let request = moxios.request.mostRecent()
            request.respondWith({
                status: 200,
                respondText: "Successfully deleted"
            }).then(function () {
                expect(<Shoppinglist />).toHaveLength(0)
            })
        })
    })
    it('Limits shoppinglist', () => {
        const baseProps = {
            onLimitSubmit: jest.fn(),
        };
        const limitComponent = shallow(<LimitShoppinglists {...baseProps} />)
        axios.post('https://shoppinglist-restful-api.herokuapp.com/shoppinglists/', {
            name: 'market'
        })
        axios.post('https://shoppinglist-restful-api.herokuapp.com/shoppinglists/', {
            name: 'soko'
        })
        limitComponent.setState({ limit: 1 })
        const limitBtn = limitComponent.find('#limit')

        limitBtn.simulate('click', { preventDefault() { } })

        moxios.wait(function () {
            let request = moxios.request.mostRecent()
            request.respondWith({
                status: 200,
                respondText: { name: "market", id: 1 }
            }).then(function () {
                expect(<Shoppinglist />).toHaveLength(1)
            })
        })
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
})
// describe('AllShoppinglists component test cases', () => {
//     it('', ()=> {})
// })
describe('EditableShoppinglist component test cases', () => {
    it('Shows the ShoppinglistForm when editForm state is true', () => {
        const editableShoppinglistComponent = shallow(<EditableShoppinglist />)
        editableShoppinglistComponent.setState({ editForm: true })
        expect(editableShoppinglistComponent.find('ShoppinglistForm')).toHaveLength(1);
    })
    it('Changes state of editForm on calling handleFormSubmit', () => {
        // Create a spy method for editFormSubmit 
        const editFormSubmit = jest.fn();
        // Pass the prop on the parent
        const editableShoppinglistComponent = shallow(<EditableShoppinglist editFormSubmit={editFormSubmit}/>);
        // Set the state of editForm to true
        editableShoppinglistComponent.setState({editForm: true});
        // Call the method handleFormSubmit with arguments
        editableShoppinglistComponent.instance().handleFormSubmit('Furniture',2);
        expect(editableShoppinglistComponent.instance().state.editForm).toEqual(false);
    })
    it('Calls the props function', () => {
        // Create a spy for props function,deleteSubmit
        const deleteSubmitSpy = jest.fn();
        // Pass the prop on the parent
        const editableShoppinglistComponent = shallow(<EditableShoppinglist deleteSubmit={deleteSubmitSpy}/>);
        // Call the wrapper method
        editableShoppinglistComponent.instance().handleDeleteBtnClick();
        expect(deleteSubmitSpy).toHaveBeenCalled();

    })
    it('Changes state of editForm when handleEditBtnClick method is called',() => {
        const editableShoppinglistComponent = shallow(<EditableShoppinglist/>);
        editableShoppinglistComponent.instance().handelEditBtnClick();
        expect(editableShoppinglistComponent.instance().state.editForm).toEqual(true);
    })
    it('Changes state of editForm when handleFormClose method is called',() => {
        const editableShoppinglistComponent = shallow(<EditableShoppinglist/>);
        // Set the state of editForm to true
        editableShoppinglistComponent.setState({editForm: true});
        editableShoppinglistComponent.instance().handleFormClose();
        expect(editableShoppinglistComponent.instance().state.editForm).toEqual(false);
    })
})
describe('ShoppingListForm component test cases', () => {
    it('Closes the component on cancel button click ', () => {
        const onFormCloseSpy = jest.fn();
        const shoppingFormComponent = shallow(<ShoppinglistForm onFormClose={onFormCloseSpy}/>)
        const cancelButton = shoppingFormComponent.find('#cancel')
        cancelButton.simulate('click', { preventDefault() {} })
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
        const limitShoppinglistComponent = shallow(<LimitShoppinglists onCancelClick={onCancelClickSpy}/>);
        const cancelButton = limitShoppinglistComponent.find('#limitCancel');
        cancelButton.simulate('click', { preventDefault () {} });
        expect(onCancelClickSpy).toHaveBeenCalled();
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
