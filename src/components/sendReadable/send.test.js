import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import PropTypes from 'prop-types';

import accounts from '../../../test/constants/accounts';
import i18n from '../../i18n';
import SendReadable from './send';

const fakeStore = configureStore();

describe('Send Readable Component', () => {
  let wrapper;
  const account = accounts.delegate;
  const props = {
    account,
    pendingTransactions: [],
    passphrase: { value: account.passphrase },
    secondPassphrase: { value: null },
    closeDialog: () => {},
    sent: sinon.spy(),
    t: key => key,
    nextStep: () => {},
  };

  describe('Without account init', () => {
    beforeEach(() => {
      account.serverPublicKey = 'public_key';
      const store = fakeStore({ account });

      wrapper = mount(<SendReadable {...props} />, {
        context: { store, i18n },
        childContextTypes: {
          store: PropTypes.object.isRequired,
          i18n: PropTypes.object.isRequired,
        },
      });
    });

    it('renders two Input components', () => {
      expect(wrapper.find('Input')).to.have.length(2);
    });

    it('renders two Button component', () => {
      expect(wrapper.find('Button')).to.have.length(2);
    });

    it('allows to send a transaction', () => {
      wrapper.find('.amount input').simulate('change', { target: { value: '120.25' } });
      wrapper.find('.recipient input').simulate('change', { target: { value: '11004588490103196952L' } });
      wrapper.find('.send-button button').simulate('click');
      expect(props.sent).to.have.been.calledWith({
        account: props.account,
        amount: '120.25',
        data: undefined,
        passphrase: props.account.passphrase,
        recipientId: '11004588490103196952L',
        secondPassphrase: null,
      });
    });
  });

  describe('With account init', () => {
    beforeEach(() => {
      props.address = '123L';
      props.amount = 1;
      props.accountInit = true;
      const store = fakeStore({ account });

      wrapper = mount(<SendReadable {...props} />, {
        context: { store, i18n },
        childContextTypes: {
          store: PropTypes.object.isRequired,
          i18n: PropTypes.object.isRequired,
        },
      });
    });

    it('account initialisation option should not conflict with launch protocol', () => {
      expect(wrapper.state('recipient').value).to.equal(account.address);
      expect(wrapper.state('amount').value).to.equal(0.1);
    });
  });
});
