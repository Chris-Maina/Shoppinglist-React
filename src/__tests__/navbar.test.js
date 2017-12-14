import React from 'react';
import { shallow, mount, render } from 'enzyme';
import ReactDOM from 'react-dom';
import {Navigation} from '../components/navbar';

describe('Navigation component test cases', ()=>{
    it('Renders Navigation component', ()=>{
        const navComponent = shallow(<Navigation/>);
        expect(navComponent).toHaveLength(1);
    });
    it('Changes state when handleLogout is invoked',()=>{
        const navComponent = shallow(<Navigation/>);
        navComponent.setState({redirect: false })
        navComponent.instance().handleLogoutClick();
        expect(navComponent.state().redirect).toBe(true);
    })
})