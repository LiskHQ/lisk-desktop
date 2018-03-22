import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter as Router } from 'react-router-dom';
import i18n from '../../i18n';
import SecondPassphraseHOC from './index';


describe('SecondPassphraseHOC', () => {
  let wrapper;
  const account = { secondSignature: 1 };
  const store = configureMockStore([])({
    account,
  });

  beforeEach(() => {
    wrapper = mount(<Router>
      <Provider store={store}>
        <I18nextProvider i18n={ i18n }>
          <SecondPassphraseHOC />
        </I18nextProvider>
      </Provider>
    </Router>);
  });

  it('should render SecondPassphrase', () => {
    expect(wrapper.find('SecondPassphrase')).to.have.lengthOf(1);
  });

  it('should mount SecondPassphrase with appropriate properties', () => {
    const props = wrapper.find('SecondPassphrase').props();
    expect(props.account).to.be.equal(account);
    expect(typeof props.registerSecondPassphrase).to.be.equal('function');
  });
});
