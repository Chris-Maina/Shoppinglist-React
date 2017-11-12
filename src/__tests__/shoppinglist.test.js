import React from 'react';
import { shallow, mount, render } from 'enzyme';
import ReactDOM from 'react-dom';
import { ShoppinglistPage, Shoppinglist, ShoppinglistForm, ToggleableShoppingForm, SearchShoppinglist, LimitShoppinglists } from '../components/shoppinglist';
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
        const shoppingFormComponent = shallow(<ShoppinglistForm {...baseProps}/>)
        axios.post('https://shoppinglist-restful-api.herokuapp.com/shoppinglists/', {
            name: 'market'
        })
        const editBtn = shoppingFormComponent.find("#update_create")

        shoppingFormComponent.setState({ name: 'Soko'})

        editBtn.simulate('click', { preventDefault () {} })
        moxios.wait(function () {
            let request = moxios.request.mostRecent()
            request.respondWith({
                status: 200,
                respondText: { name: "Soko", id: 1 }
            }).then(function () {
                expect(<Shoppinglist/>).toHaveLength(1)
                expect(shoppingFormComponent.contains('Soko')).to.equal(true)

            })
        })
    })
    it('Toast has an error when you submit a list that exists when editing', () => {
        const baseProps = {
            onFormSubmit: jest.fn(),
        }
        const shoppingFormComponent = shallow(<ShoppinglistForm {...baseProps}/>)
        const toastContainer = shallow(<ToastContainer/>)
        axios.post('https://shoppinglist-restful-api.herokuapp.com/shoppinglists/', {
            name: 'market'
        })
        axios.post('https://shoppinglist-restful-api.herokuapp.com/shoppinglists/', {
            name: 'soko'
        })
        const editBtn = shoppingFormComponent.find("#update_create")

        shoppingFormComponent.setState({ name: 'soko'})

        editBtn.simulate('click', { preventDefault () {} })
        moxios.wait(function () {
            let request = moxios.request.mostRecent()
            request.respondWith({
                status: 200,
                respondText: { name:"Error"}
            }).then(function () {
                expect(<Shoppinglist/>).toHaveLength(1)
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
        const limitComponent = shallow(<LimitShoppinglists {...baseProps}/>)
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
describe('ShoppingListForm component test cases', () => {
    // it('Closes the component on cancel button click ', () => {
    //     // sinon.spy(ToggleableShoppingForm.prototype, 'handleFormClose')
    //     const baseProps = {
    //         onFormClose: jest.fn(),
    //       };
    //     const shoppingFormComponent = shallow(<ShoppinglistForm {...baseProps}/>)
    //     const toggleComponent = shallow(<ToggleableShoppingForm/>)
    //     toggleComponent.setState({ isOpen: true})
    //     const cancelButton = shoppingFormComponent.find('#cancel')
    //     const event = {
    //         onFormClose: baseProps,
    //         preventDefault: () => {
    //             return true
    //         }
    //     }
    //     cancelButton.simulate('click', event)
    //     expect(toggleComponent.instance().state.isOpen).toBe(false)
    // })
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
