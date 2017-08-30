import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import SecondPassphraseHOC from './index';


describe('SecondPassphraseHOC', () => {
  let wrapper;
  const peers = {};
  const account = { secondSignature: 1 };
  const store = configureMockStore([])({
    peers,
    account,
  });

  beforeEach(() => {
    wrapper = mount(<Provider store={store}><SecondPassphraseHOC /></Provider>);
  });

  it('should render SecondPassphrase', () => {
    expect(wrapper.find('SecondPassphrase')).to.have.lengthOf(1);
  });

  it('should mount SecondPassphrase with appropriate properties', () => {
    const props = wrapper.find('SecondPassphrase').props();
    expect(props.peers).to.be.equal(peers);
    expect(props.account).to.be.equal(account);
    expect(typeof props.setActiveDialog).to.be.equal('function');
    expect(typeof props.registerSecondPassphrase).to.be.equal('function');
  });
});
