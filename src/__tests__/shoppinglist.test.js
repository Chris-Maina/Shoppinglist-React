import React from 'react';
import { shallow, mount, render } from 'enzyme';
import ReactDOM from 'react-dom';
import { ShoppinglistPage, ShoppinglistForm, Shoppinglist } from '../components/shoppinglist';
import sinon from 'sinon';
import moxios from 'moxios';
import axios from 'axios';

describe('<ShoppinglistPage/> components', () => {
    let onFulfilled
    let onRejected
    beforeEach(function () {
        moxios.install()
        // onFulfilled = sinon.spy()
        // onRejected = sinon.spy()
    })
    afterEach(function () {
        moxios.uninstall()
    })

    // it('Loads the shoppinglist page', () => {
    //     // Get page and token
    //     axios({
    //         method: "get",
    //         url: 'https://shoppinglist-restful-api.herokuapp.com/shoppinglists/',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': 'Bearer access_token'
    //         }
    //     }).then(onFulfilled)
    //     moxios.wait(function () {
    //         let request = moxios.request.mostRecent()
    //         request.respondWith({
    //             status: 200,
    //             respondText: "Success"
    //         }).then(function () {
    //             equal(onFulfilled.getCall(0).args(0).data, "Success")
    //             done()
    //         })
    //     })

    // })
    it('Posts a shoppinglist', () => {
       
        const shoppinglist_page = mount(<ShoppinglistPage/>)
        const form = shoppinglist_page.find('form')
        const inputName = shoppinglist_page.find("input[name='shoppinglistname']")
        const event = {
                    target: {
                        value : 'Back to school',
                    },
                    preventDefault: () => {
                        return true
                    }
                }
        inputName.simulate('change', event)
        form.simulate('submit', { preventDefault () { }})
        
        moxios.wait(function () {
            let request = moxios.request.mostRecent()
            request.respondWith({
                status: 200,
                respondText: {name: "Back to school", id: 1}
            }).then(function () {
                expect(shoppinglist_page.contains('Back to school')).to.equal(true)

            })
        })
    })
    // it('Renders Shoppinglist page by default', ()=>{
    //     const shoppinglistPage = shallow(<ShoppinglistPage />)
    //     expect(shoppinglistPage).toHaveLength(1);
    //     // Check that a containerdiv is the first div
    //     const containerdiv = shoppinglistPage.first('div');
    //     expect(containerdiv).toHaveLength(1);
    // })
    // it('Calls the componentDidMount', ()=>{
    //     sinon.spy(ShoppinglistPage.prototype, 'componentDidMount');
    //     const wrapper = mount(<ShoppinglistPage />);
    //     expect(ShoppinglistPage.prototype.componentDidMount.calledOnce).to.equal(true);
    // })
    // it('Changes state when on change event is called',()=>{
    //     const shoppinglist_form = mount(<ShoppinglistForm/>)
    //     const inputName = shoppinglist_form.find("input[name='shoppinglistname']")
    //     const event = {
    //         target: {
    //             name : 'Back to school'
    //         },
    //         preventDefault: () => {
    //             return true
    //         }
    //     }
    //     inputName.simulate('change', event)
    //     expect(shoppinglist_form.state().name).toBe(event.target.name)
    // })

})