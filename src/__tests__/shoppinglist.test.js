import React from 'react';
import { shallow, mount, render } from 'enzyme';
import ReactDOM from 'react-dom';
import  {ShoppinglistPage, Shoppinglist,ShoppinglistForm, ToggleableShoppingForm, SearchShoppinglist, LimitShoppinglists } from '../components/shoppinglist';
import sinon from 'sinon';
import moxios from 'moxios';
import axios from 'axios';

describe('<ShoppinglistPage/> components', () => {
    beforeEach(function () {
        moxios.install()
    })
    afterEach(function () {
        moxios.uninstall()
    })
    it('Posts a shoppinglist', () => {
        const shoppinglist_page = shallow(<ShoppinglistForm/>)
        const form = shoppinglist_page.find('Form')
        const inputName = shoppinglist_page.find("Input[name='shoppinglistname']")
        const event = {
                    target: {
                        value : 'Back to school'
                    },
                    preventDefault: () => {
                        return true
                    }
                }
        inputName.simulate('change', event);
        form.simulate('submit', { preventDefault () { }});

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
    
    it('Renders Shoppinglist page by default', ()=>{
        const shoppinglistPage = shallow(<ShoppinglistPage />)
        expect(shoppinglistPage).toHaveLength(1);
    })
    it('Allows to set props', ()=>{
        const shoppinglist = shallow(<Shoppinglist name="Furniture" />)
        // console.log(shoppinglist)
        expect(shoppinglist.instance().props.name).toEqual("Furniture");
    })
    it('calls componentDidMount', () => {
        const testMountCall = sinon.spy(ShoppinglistPage.prototype, 'componentDidMount');
        const wrapper = shallow(<ShoppinglistPage />);
        expect(testMountCall.calledOnce).toEqual(true);
      });

})
describe('ToggleShoppingForm component icon click tests', () =>{
    it('It opens up ShoppingListForm when Add button is clicked', () =>{
        const toggleComponent = shallow(<ToggleableShoppingForm/>)
        const addButton = toggleComponent.find('#add')
        addButton.simulate('click')
        expect(ShoppinglistForm).toHaveLength(1)

    })
    it('It opens up SearchShoppinglist when search button is clicked', () =>{
        const toggleComponent = shallow(<ToggleableShoppingForm/>)
        const addButton = toggleComponent.find('#search')
        addButton.simulate('click')
        expect(SearchShoppinglist).toHaveLength(1)

    })
    it('It opens up LimitShoppinglist when search button is clicked', () =>{
        const toggleComponent = shallow(<ToggleableShoppingForm/>)
        const addButton = toggleComponent.find('#filter')
        addButton.simulate('click')
        expect(LimitShoppinglists).toHaveLength(1)

    })
})

