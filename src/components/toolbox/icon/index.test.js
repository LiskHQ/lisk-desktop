import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Icon from './index';

const fakeStore = configureStore();

describe('Icon', () => {
  it('should render an image with given name andcustom property', () => {
    const wrapper = mount(<Icon name="user" customprop="customValue" />);
    expect(wrapper.find('img').props().src).to.be.equal('test-file-stub');
    expect(wrapper.find('img').props().customprop).to.be.equal('customValue');
  });

  it('should render dark icons if available', () => {
    const store = fakeStore({
      settings: {
        darkMode: true,
      },
    });
    const wrapper = mount(<Provider store={store}><Icon name="fileOutline" /></Provider>);
    expect(wrapper.find('img').props().src).to.be.equal('test-file-stub');
  });
});
