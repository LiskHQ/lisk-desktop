import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import store from '../../store';
import SignMessage from './signMessage';
import SignMessageComponent from './signMessageComponent';

describe.only('SignMessage', () => {
  it('should render the SignMessageComponent with props.successToast and props.copyToClipboard', () => {
    const wrapper = mount(<Provider store={store}><SignMessage /></Provider>);
    expect(wrapper.find(SignMessageComponent).exists()).to.equal(true);
    expect(typeof wrapper.find(SignMessageComponent).props().successToast).to.equal('function');
    expect(typeof wrapper.find(SignMessageComponent).props().copyToClipboard).to.equal('function');
  });
});
