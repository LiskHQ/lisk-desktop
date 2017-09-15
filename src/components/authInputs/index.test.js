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
  const account = {
    secondSignature: 1,
    passphrase,
  };

  it('should render AuthInputs with props.account equal to state.account ', () => {
    const store = configureMockStore([])({ account });
    wrapper = mount(<Provider store={store}>
      <AuthInputsHOC {...props}/>
    </Provider>);
    expect(wrapper.find('AuthInputs').props().account).to.deep.equal(account);
  });
});
