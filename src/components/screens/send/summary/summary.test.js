import React from 'react';
import { mount } from 'enzyme';
import { tokenMap } from '@constants';
import { formatAmountBasedOnLocale } from '@utils/formattedNumber';
import Summary from './summary';
import accounts from '../../../../../test/constants/accounts';
import i18n from '../../../../i18n';

describe('Summary', () => {
  const props = {
    t: i18n.t,
    account: {
      ...accounts.genesis,
      hwInfo: {
        deviceModel: 'Ledger Nano S',
      },
    },
    fields: {
      recipient: {
        address: '123123L',
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
    prevState: {
      fields: {},
    },
    prevStep: jest.fn(),
    nextStep: jest.fn(),
    transactionCreated: jest.fn(),
    resetTransactionResult: jest.fn(),
    isLoading: false,
    isHardwareWalletConnected: false,
    transactions: {
      pending: [],
      failed: '',
      transactionsCreated: [],
      transactionsCreatedFailed: [],
      broadcastedTransactionsError: [],
    },
    token: tokenMap.LSK.key,
  };
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render properly', () => {
    const wrapper = mount(<Summary {...props} />);
    expect(wrapper).toContainMatchingElement('.summary');
    expect(wrapper).toContainMatchingElement('.summary-header');
    expect(wrapper).toContainMatchingElement('.summary-content');
    expect(wrapper).toContainMatchingElement('.summary-footer');
    expect(wrapper.find('button.confirm-button')).toHaveText('Send 1.123 LSK');
    expect(wrapper.find('.amount-summary')).toIncludeText('1.123 LSK');
  });

  it.skip('should render German decimal point  properly', () => {
    const newProps = {
      ...props,
      fields: {
        ...props.fields,
        amount: {
          value: '1,123',
        },
      },
    };
    const wrapper = mount(<Summary {...newProps} />);
    expect(wrapper.find('button.confirm-button')).toHaveText('Send 1,123 LSK');
    expect(wrapper.find('.amount-summary')).toIncludeText('1,123 LSK');
  });

  it('should goind to previous page', () => {
    const wrapper = mount(<Summary {...props} />);
    wrapper.find('.cancel-button').at(0).simulate('click');
    wrapper.update();
    expect(props.prevStep).toBeCalled();
  });

  it('should show props.fields.recipient.title if it is present', () => {
    const title = 'Custom title';
    const wrapper = mount(<Summary {...{
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

  it('should show props.fields.fee.value and use it in transactionCreated if props.token is not LSK', () => {
    const txFee = 0.00012451;
    const formattedTxFee = formatAmountBasedOnLocale({ value: txFee });
    const newProps = {
      ...props,
      token: 'BTC',
      fields: {
        ...props.fields,
        selectedPriority: {
          value: txFee,
        },
        fee: {
          value: txFee,
        },
        reference: undefined,
      },
      account: accounts.genesis,
    };
    const wrapper = mount(<Summary {...newProps} />);
    expect(wrapper.find('.fee-value')).toIncludeText(formattedTxFee);
    wrapper.find('.confirm-button').at(0).simulate('click');
    expect(props.transactionCreated).toBeCalledWith(expect.objectContaining({
      fee: 12451,
    }));
  });

  it('should call transactionCreated as soon the component load if using HW', () => {
    const newProps = { ...props };
    newProps.account = {
      ...props.account,
      hwInfo: {
        deviceId: '123123sdf',
      },
    };
    const wrapper = mount(<Summary {...newProps} />);
    wrapper.update();
    expect(props.transactionCreated).toBeCalled();
  });
});
