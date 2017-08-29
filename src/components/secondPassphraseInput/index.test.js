import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import SecondPassphraseInputHOC from './index';

describe('SecondPassphraseInputHOC', () => {
  let wrapper;

  it('should render SecondPassphraseInput with props.hasSecondPassphrase if store.account.secondSignature is truthy', () => {
    const store = configureMockStore([])({ account: { secondSignature: 1 } });
    wrapper = mount(<Provider store={store}>
      <SecondPassphraseInputHOC onChange={ () => {} } />
    </Provider>);
    expect(wrapper.find('SecondPassphraseInput')).to.have.lengthOf(1);
    expect(wrapper.find('SecondPassphraseInput').props().hasSecondPassphrase).to.equal(true);
  });

  it('should render SecondPassphraseInput with !props.hasSecondPassphrase if store.account.secondSignature is falsy', () => {
    const store = configureMockStore([])({ account: { secondSignature: 0 } });
    wrapper = mount(<Provider store={store}>
      <SecondPassphraseInputHOC onChange={ () => {} } />
    </Provider>);
    expect(wrapper.find('SecondPassphraseInput').props().hasSecondPassphrase).to.equal(false);
  });
});
