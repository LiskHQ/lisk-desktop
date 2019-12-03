import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { expect } from 'chai';
import Illustration from './index';

const fakeStore = configureStore();

describe('Illustration', () => {
  it('should render an image with given name', () => {
    const wrapper = mount(<Illustration name="helpCenter" />);
    expect(wrapper.find('img').props().src).to.be.equal('test-file-stub');
  });

  it('should render dark illustration if available', () => {
    const store = fakeStore({
      settings: {
        darkMode: true,
      },
    });
    const wrapper = mount(<Provider store={store}><Illustration name="emptyBookmarksList" /></Provider>);
    expect(wrapper.find('img').props().src).to.be.equal('test-file-stub');
  });
});
