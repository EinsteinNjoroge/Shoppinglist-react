import expect from 'expect';
import React from 'react';
import {shallow} from 'enzyme';
import TextInput from './TextInput';


describe('Test input text box helper', () => {

    function setup(localProps = null) {
        const props = {
            onChange: () => {},
            onBlur: () => {}
        };

        return shallow(<TextInput {...props} {...localProps} />);
    }

    it('renders a div of class form-group', () => {
        const wrapper = setup();
        expect(wrapper.find('div').props().className).toBe('form-group');
    });

    it('renders an input text field', () => {
        const wrapper = setup();
        expect(wrapper.find('input').props().type).toBe('text');
    });

    it('can render an input password field', () => {
        const localProps = {type: 'password'};
        const wrapper = setup(localProps);
        expect(wrapper.find('input').props().type).toBe('password');
    });

    it('render an input field with a name', () => {
        const localProps = {name: 'password'};
        const wrapper = setup(localProps);
        expect(wrapper.find('input').props().name).toBe('password');
    });

    it('render an input field with a placeholder', () => {
        const localProps = {placeholder: 'placeholder'};
        const wrapper = setup(localProps);
        expect(wrapper.find('input').props().placeholder).toBe('placeholder');
    });

    it('render an input field with an onchange handler', () => {
        const wrapper = setup();
        expect(typeof wrapper.find('input').props().onChange).toBe('function');
    });

    it('render an input field with an onblur handler', () => {
        const wrapper = setup();
        expect(typeof wrapper.find('input').props().onBlur).toBe('function');
    });

});