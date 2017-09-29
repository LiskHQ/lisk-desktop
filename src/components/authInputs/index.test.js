import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import configureMockStore from 'redux-mock-store';
import i18n from '../../i18n';
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
      <I18nextProvider i18n={ i18n }>
        <AuthInputsHOC {...props}/>
      </I18nextProvider>
    </Provider>);
    expect(wrapper.find('AuthInputs').props().account).to.deep.equal(account);
  });
});
