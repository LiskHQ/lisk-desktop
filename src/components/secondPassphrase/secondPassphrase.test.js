import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';

import accounts from '../../../test/constants/accounts';
import i18n from '../../i18n';
import SecondPassphrase from './secondPassphrase';

describe.skip('SecondPassphrase', () => {
  let wrapper;
  const peers = { data: {} };
  const account = accounts.delegate;
  const secPassphrase = accounts['delegate candidate'].passphrase;
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
