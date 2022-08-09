import React from 'react';
import { mount } from 'enzyme';
import { tokenMap } from '@token/fungible/consts/tokens';
import mockBlockchainApplications from '@tests/fixtures/blockchainApplicationsManage';
import { mockAppTokens } from '@tests/fixtures/token';
import i18n from 'src/utils/i18n/i18n';
import wallets from '@tests/constants/wallets';
import Summary from './Summary';

describe('Summary', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      resetTransactionResult: jest.fn(),
      prevStep: jest.fn(),
      nextStep: jest.fn(),
      token: tokenMap.LSK.key,
      rawTx: {
        asset: {
          recipient: { address: wallets.genesis.summary.address },
          amount: 112300000,
          data: 'test',
        },
        moduleAssetId: '2:0',
      },
      t: i18n.t,
      selectedPriority: { title: 'Normal', value: 1 },
      fees: {
        Transaction: '1 LSK',
        CCM: '1 LSK',
        initiation: '1 LSK',
      },
      transactionData: {
        sendingChain: mockBlockchainApplications[0],
        recipientChain: mockBlockchainApplications[1],
        token: mockAppTokens[0],
        recipient: { value: 'lskyrwej7xuxeo39ptuyff5b524dsmnmuyvcaxkag' },
        amount: 10,
        data: 'test message',
      },
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

  it('should going to previous page', () => {
    wrapper.find('.cancel-button').at(0).simulate('click');
    wrapper.update();
    expect(props.prevStep).toBeCalled();
  });

  it('should going to previous page', () => {
    wrapper.find('.confirm-button').at(0).simulate('click');
    wrapper.update();
    expect(props.nextStep).toBeCalled();
  });

  it('should show props.fields.recipient.title if it is present', () => {
    const title = 'Custom title';
    wrapper = mount(<Summary {...{
      ...props,
      rawTx: {
        ...props.rawTx,
        asset: {
          ...props.rawTx.asset,
          recipient: {
            ...props.rawTx.asset.recipient,
            title,
          },
        },
      },
    }}
    />);
    expect(wrapper.find('.recipient-value')).toIncludeText(props.rawTx.asset.recipient.address);
    expect(wrapper.find('.recipient-value')).toIncludeText(title);
  });
});
