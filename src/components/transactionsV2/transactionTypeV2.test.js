import React from 'react';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import TransactionTypeV2 from './transactionTypeV2';
import accounts from '../../../test/constants/accounts';
import i18n from '../../i18n';

const options = {
  context: { i18n },
  childContextTypes: {
    i18n: PropTypes.object.isRequired,
  },
};

const createTest = (type) => {
  let expectedValue;
  switch (type) {
    case 0:
      expectedValue = 'Transaction';
      break;
    case 1:
      expectedValue = 'Second passphrase registration';
      break;
    case 2:
      expectedValue = 'Delegate registration';
      break;
    case 3:
      expectedValue = 'Delegate vote';
      break;
    case 4:
      expectedValue = 'Multisignature Creation';
      break;
    case 5:
      expectedValue = 'Blockchain Application Registration';
      break;
    case 6:
      expectedValue = 'Send Lisk to Blockchain Application';
      break;
    case 7:
      expectedValue = 'Send Lisk from Blockchain Application';
      break;
    default:
      expectedValue = 'Transaction';
      break;
  }

  it(`show TransactionType equal to "${expectedValue}" for transaction type ${type}`, () => {
    const props = {
      type,
      senderId: accounts.delegate.address,
      showTransaction: true,
      followedAccounts: {
        LSK: [],
      },
    };
    const wrapper = mount(<TransactionTypeV2 {...props} />, options);
    expect(wrapper.find('.title')).toIncludeText(expectedValue);
  });
};

describe('TransactionType V2', () => {
  for (let i = 1; i < 9; i++) {
    createTest(i);
  }

  it('sets TransactionType equal the values of "props.senderId"', () => {
    const props = {
      type: 0,
      senderId: accounts.delegate.address,
      followedAccounts: {
        LSK: [],
      },
    };
    const wrapper = mount(<TransactionTypeV2 {...props} />, options);
    expect(wrapper).toIncludeText(props.senderId);
  });

  it('Should render followed account name if account is followed', () => {
    const title = 'Followed test';
    const props = {
      type: 0,
      senderId: accounts.delegate.address,
      followedAccounts: {
        LSK: [{
          address: accounts.delegate.address,
          title,
        }],
      },
    };
    const wrapper = mount(<TransactionTypeV2 {...props} />, options);
    expect(wrapper).toIncludeText(title);
  });
});
