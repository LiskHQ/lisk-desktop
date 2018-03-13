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
  let props;

  beforeEach(() => {
    const account = accounts.delegate;
    account.serverPublicKey = 'public_key';

    const store = fakeStore({
      account,
    });

    props = {
      activePeer: {},
      account,
      pendingTransactions: [],
      passphrase: { value: account.passphrase },
      secondPassphrase: { value: null },
      closeDialog: () => {},
      sent: sinon.spy(),
      t: key => key,
      nextStep: () => {},
    };
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
      activePeer: {},
      amount: '120.25',
      passphrase: props.account.passphrase,
      recipientId: '11004588490103196952L',
      secondPassphrase: null,
    });
  });
});
