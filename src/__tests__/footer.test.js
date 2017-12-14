import React from 'react';
import { shallow, mount, render } from 'enzyme';
import ReactDOM from 'react-dom';
import Footer from '../components/footer';

describe('Footer test cases', ()=>{
    it('Renders Footer component', ()=>{
        const footerComponent = shallow(<Footer/>);
        expect(footerComponent).toHaveLength(1);
    });
})