import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import AuthInputsHOC from './index';

describe('AuthInputsHOC', () => {
  let wrapper;
  const passphrase = 'recipe bomb asset salon coil symbol tiger engine assist pact pumpkin visit';
  const props = {
    onChange: () => {},
    secondPassphrase: {},
  };

  it('should render AuthInputs with props.hasSecondPassphrase if store.account.secondSignature is truthy', () => {
    const store = configureMockStore([])({ account: { secondSignature: 1, passphrase } });
    wrapper = mount(<Provider store={store}>
      <AuthInputsHOC {...props} />
    </Provider>);
    expect(wrapper.find('AuthInputs')).to.have.lengthOf(1);
    expect(wrapper.find('AuthInputs').props().hasSecondPassphrase).to.equal(true);
  });

  it('should render AuthInputs with !props.hasSecondPassphrase if store.account.secondSignature is falsy', () => {
    const store = configureMockStore([])({ account: { secondSignature: 0, passphrase } });
    wrapper = mount(<Provider store={store}>
      <AuthInputsHOC {...props} />
    </Provider>);
    expect(wrapper.find('AuthInputs').props().hasSecondPassphrase).to.equal(false);
  });
});
