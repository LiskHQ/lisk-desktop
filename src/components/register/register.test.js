import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import i18n from '../../i18n';
import Register from './register';


describe('Register', () => {
  let wrapper;
  const peers = { data: {} };
  const account = {
    passphrase: 'recipe bomb asset salon coil symbol tiger engine assist pact pumpkin visit',
  };
  const store = configureMockStore([])({
    peers,
    account,
    activePeerSet: () => {},
  });
  const options = {
    context: { store, i18n },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
    },
  };
  const prop = {
    account,
    peers,
    activePeerSet: spy(),
    t: key => key,
  };

  beforeEach(() => {
    wrapper = mount(<Register {...prop} />, options);
  });

  it('renders MultiStep component', () => {
    expect(wrapper.find('MultiStep')).to.have.length(1);
  });

  it('initially renders PassphraseInfo', () => {
    expect(wrapper.find('PassphraseInfo')).to.have.length(1);
  });

  it('should call activePeerSet with network and passphrase', () => {
    wrapper.find('MultiStep').props().finalCallback(account.passphrase);
    expect(prop.activePeerSet).to.have.been.calledWith({
      network: { code: 0, name: 'Mainnet', port: 443, ssl: true },
      passphrase: account.passphrase,
    });
  });
});
