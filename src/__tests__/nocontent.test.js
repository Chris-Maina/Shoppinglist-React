import React from 'react';
import { shallow, mount, render } from 'enzyme';
import ReactDOM from 'react-dom';
import NoContent from '../components/nocontent';

describe('NoContent component test cases', ()=>{
    it('Renders NoContent component', ()=>{
        const noContentComponent = shallow(<NoContent/>);
        expect(noContentComponent).toHaveLength(1);
    });
})