import React from 'react';
import { mount } from 'enzyme';
import { tokenMap } from '@token/fungible/consts/tokens';
import mockBlockchainApplications from '@tests/fixtures/blockchainApplicationsManage';
import { mockAppTokens } from '@tests/fixtures/token';
import i18n from 'src/utils/i18n/i18n';
import { mockAuth } from '@auth/__fixtures__';
import { useAuth } from '@auth/hooks/queries';
import wallets from '@tests/constants/wallets';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { MODULE_COMMANDS_NAME_MAP } from '@transaction/configuration/moduleCommand';
import blockchainApplicationsExplore from '@tests/fixtures/blockchainApplicationsExplore';
import Summary from './Summary';
import { mockTokensBalance } from '../../__fixtures__';

const mockedCurrentAccount = mockSavedAccounts[0];
jest.mock('@auth/hooks/queries');
jest.mock('@account/hooks', () => ({
  useCurrentAccount: jest.fn(() => [mockedCurrentAccount, jest.fn()]),
}));

describe('Summary', () => {
  let wrapper;
  let props;
  const title = 'recipient';

  beforeEach(() => {
    props = {
      resetTransactionResult: jest.fn(),
      prevStep: jest.fn(),
      nextStep: jest.fn(),
      token: tokenMap.LSK.key,
      transactionJSON: {
        params: {
          recipientAddress: wallets.genesis.summary.address,
          amount: 112300000,
          data: 'message',
          token: mockAppTokens[0],
        },
        moduleCommand: 'token:transfer',
        sendingChain: mockBlockchainApplications[0],
        recipientChain: mockBlockchainApplications[1],
      },
      rawTx: {
        params: {
          recipient: { address: wallets.genesis.summary.address },
          amount: 112300000,
          data: 'message',
          token: mockAppTokens[0],
        },
        moduleCommand: 'token:transfer',
        sendingChain: mockBlockchainApplications[0],
        recipientChain: mockBlockchainApplications[1],
      },
      t: i18n.t,
      selectedPriority: { title: 'Normal', value: 1 },
      fees: {
        Transaction: '1 LSK',
        CCM: '1 LSK',
        Initialisation: '1 LSK',
      },
      transactionData: {
        recipient: { value: 'lskyrwej7xuxeo39ptuyff5b524dsmnmuyvcaxkag' },
        amount: 10,
        data: 'message',
      },
      formProps: {
        moduleCommand: MODULE_COMMANDS_NAME_MAP.transfer,
        isValid: true,
        params: {
          amount: 112300000,
          data: 'transfer message',
          token: { tokenID: '00000000' },
        },
        fields: {
          sendingChain: mockBlockchainApplications[0],
          recipientChain: blockchainApplicationsExplore[0],
          token: mockTokensBalance.data[0],
          recipient: {
            address: wallets.genesis.summary.address,
            title,
          },
        },
      },
    };
    wrapper = mount(<Summary {...props} />);
  });
  useAuth.mockReturnValue({ data: mockAuth });

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
    wrapper = mount(
      <Summary
        {...{
          ...props,
          rawTx: {
            ...props.rawTx,
            params: {
              ...props.rawTx.params,
              recipient: {
                ...props.rawTx.params.recipient,
                title,
              },
            },
          },
        }}
      />
    );
    expect(wrapper.find('.recipient-address')).toIncludeText(
      props.transactionJSON.params.recipientAddress
    );
    expect(wrapper.find('.recipient-confirm')).toIncludeText(title);
  });
});
