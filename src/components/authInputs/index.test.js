import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import configureMockStore from 'redux-mock-store';

import accounts from '../../../test/constants/accounts';
import i18n from '../../i18n';
import AuthInputsHOC from './index';

describe('AuthInputsHOC', () => {
  let wrapper;
  const props = {
    onChange: () => {},
    secondPassphrase: { value: '' },
    passphrase: { value: '' },
  };
  const account = {
    secondSignature: 1,
    passphrase: accounts.delegate.passphrase,
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
