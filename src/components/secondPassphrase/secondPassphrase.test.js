import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';

import accounts from '../../../test/constants/accounts';
import i18n from '../../i18n';
import SecondPassphrase from './secondPassphrase';

describe('SecondPassphrase', () => {
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

    it('unmount remove contentFocused', () => {
      expect(document.getElementsByClassName('contentFocused')).to.have.length(1);
      wrapper.unmount();
      expect(document.getElementsByClassName('contentFocused')).to.have.length(0);
    });

    it('should call activePeerSet with network and passphrase', () => {
      wrapper.find('MultiStep').props().finalCallback(secPassphrase, account.passphrase);
      expect(props.registerSecondPassphrase).to.have.been.calledWith({
        activePeer: peers.data,
        secondPassphrase: secPassphrase,
        account,
        passphrase: account.passphrase,
      });
    });
  });
});
