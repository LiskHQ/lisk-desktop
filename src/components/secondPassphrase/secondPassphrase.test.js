import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import i18n from '../../i18n';
import SecondPassphrase from './secondPassphrase';

describe('SecondPassphrase', () => {
  let wrapper;
  const peers = { data: {} };
  const account = {
    passphrase: 'recipe bomb asset salon coil symbol tiger engine assist pact pumpkin visit',
  };
  const secPassphrase = 'bottom believe surround fury install scorpion destroy below dwarf inquiry foot cricket';
  const store = configureMockStore([])({
    peers,
    account,
  });
  const options = {
    context: { store, i18n },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
    },
  };
  const props = {
    account,
    peers,
    closeDialog: () => {},
    passphrase: account.passphrase,
    registerSecondPassphrase: spy(),
    t: key => key,
  };

  describe('Authenticated', () => {
    beforeEach(() => {
      wrapper = mount(<SecondPassphrase {...props} />, options);
    });

    it('renders MultiStep component', () => {
      expect(wrapper.find('MultiStep')).to.have.length(1);
    });

    it('initially renders PassphraseInfo', () => {
      expect(wrapper.find('Info')).to.have.length(1);
    });

    it('should call activePeerSet with network and passphrase', () => {
      wrapper.find('MultiStep').props().finalCallback(secPassphrase);
      expect(props.registerSecondPassphrase).to.have.been.calledWith({
        activePeer: peers.data,
        secondPassphrase: secPassphrase,
        account,
      });
    });
  });

  describe('Not authenticated', () => {
    const unAuthenticatedProps = Object.assign({}, props);
    delete unAuthenticatedProps.passphrase;

    beforeEach(() => {
      wrapper = mount(<SecondPassphrase {...unAuthenticatedProps} />, options);
    });

    it('renders Authenticate component if the user is not authenticated yet', () => {
      expect(wrapper.find('Authenticate')).to.have.length(1);
    });
  });
});
