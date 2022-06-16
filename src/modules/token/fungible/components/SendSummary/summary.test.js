import React from 'react';
import { mount } from 'enzyme';
import { tokenMap } from '@token/fungible/consts/tokens';
import i18n from 'src/utils/i18n/i18n';
import accounts from '@tests/constants/wallets';
import Summary from './Summary';

describe('Summary', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      transactionCreated: jest.fn(),
      resetTransactionResult: jest.fn(),
      prevStep: jest.fn(),
      nextStep: jest.fn(),
      account: accounts.genesis,
      fields: {
        recipient: {
          address: '1lskehj8am9afxdz8arztqajy52acnoubkzvmo9cjy',
        },
        amount: {
          value: '1.123',
        },
        reference: {
          value: 1,
        },
        fee: {
          value: 0.1e8,
        },
        isLoading: false,
        isHardwareWalletConnected: false,
      },
      token: tokenMap.LSK.key,
      t: i18n.t,
    };
    wrapper = mount(<Summary {...props} />);
  });

  it('should render properly', () => {
    expect(wrapper).toContainMatchingElement('.Summary');
    expect(wrapper).toContainMatchingElement('.Summary-header');
    expect(wrapper).toContainMatchingElement('.Summary-content');
    expect(wrapper).toContainMatchingElement('.Summary-footer');
    expect(wrapper.find('button.confirm-button')).toHaveText('Send 1.123 LSK');
    expect(wrapper.find('.amount-Summary')).toIncludeText('1.123 LSK');
  });

  it('should goind to previous page', () => {
    wrapper.find('.cancel-button').at(0).simulate('click');
    wrapper.update();
    expect(props.prevStep).toBeCalled();
  });

  it('should show props.fields.recipient.title if it is present', () => {
    const title = 'Custom title';
    wrapper = mount(<Summary {...{
      ...props,
      fields: {
        ...props.fields,
        recipient: {
          ...props.fields.recipient,
          title,
        },
      },
    }}
    />);
    expect(wrapper.find('.recipient-value')).toIncludeText(props.fields.recipient.address);
    expect(wrapper.find('.recipient-value')).toIncludeText(title);
  });
});
