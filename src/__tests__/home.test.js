import React from 'react';
import { shallow, mount, render } from 'enzyme';
import ReactDOM from 'react-dom';
import Home from '../components/home';

describe('Home component test cases', ()=>{
    it('Renders Home component', ()=>{
        const homeComponent = shallow(<Home/>);
        expect(homeComponent).toHaveLength(1);
    });
})