import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import store from '../../store';
import SignMessage from './signMessage';
import SignMessageComponent from './signMessageComponent';

describe('SignMessage', () => {
  it('should render the SignMessageComponent', () => {
    const wrapper = mount(<Provider store={store}><SignMessage /></Provider>);
    expect(wrapper.find(SignMessageComponent).exists()).to.equal(true);
  });
});
