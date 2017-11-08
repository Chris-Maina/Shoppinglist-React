import React from 'react';
import { shallow, mount, render } from 'enzyme';
import ReactDOM from 'react-dom';
import  {ShoppinglistPage, Shoppinglist } from '../components/shoppinglist';
import { Card } from 'react-materialize';
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
        expect(shoppinglist.instance().props.name).toEqual("Furniture");
    })
    it('calls componentDidMount', () => {
        sinon.spy(ShoppinglistPage.prototype, 'componentDidMount');
        const wrapper = mount(<ShoppinglistPage />);
        expect(ShoppinglistPage.prototype.componentDidMount.calledOnce).toEqual(true);
      });

})