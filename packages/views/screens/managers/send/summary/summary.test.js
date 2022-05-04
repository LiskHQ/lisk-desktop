import React from 'react';
import { mount } from 'enzyme';
import { tokenMap } from '@token/fungible/consts/tokens';
import { toRawLsk } from '@token/fungible/utils/lsk';
import { formatAmountBasedOnLocale } from '@common/utilities/formattedNumber';
import i18n from 'src/utils/i18n/i18n';
import accounts from '@tests/constants/wallets';
import Summary from './summary';

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
    expect(wrapper).toContainMatchingElement('.summary');
    expect(wrapper).toContainMatchingElement('.summary-header');
    expect(wrapper).toContainMatchingElement('.summary-content');
    expect(wrapper).toContainMatchingElement('.summary-footer');
    expect(wrapper.find('button.confirm-button')).toHaveText('Send 1.123 LSK');
    expect(wrapper.find('.amount-summary')).toIncludeText('1.123 LSK');
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

  it('should show props.fields.fee.value and call props.nextStep with properties if props.token is not LSK', () => {
    const txFee = 0.00012451;
    const formattedTxFee = formatAmountBasedOnLocale({ value: txFee });
    const newProps = { ...props };
    newProps.token = 'BTC';
    newProps.fields = {
      ...props.fields,
      reference: undefined,
      fee: {
        value: txFee,
      },
    };
    newProps.transactions = {
      pending: [],
      failed: '',
      signedTransaction: { fee: txFee },
      txSignatureError: null,
      txBroadcastError: null,
    };
    newProps.account = accounts.genesis;
    wrapper = mount(<Summary {...newProps} />);
    expect(wrapper.find('.fee-value')).toIncludeText(formattedTxFee);
    wrapper.find('.confirm-button').at(0).simulate('click');
    expect(props.nextStep).toHaveBeenCalledWith({
      rawTransaction: {
        amount: `${toRawLsk(props.fields.amount.value)}`,
        recipientAddress: props.fields.recipient.address,
        data: '',
        fee: 12451,
      },
      actionFunction: props.transactionCreated,
    });
  });
});
