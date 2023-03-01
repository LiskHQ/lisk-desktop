import React from 'react';
import { cryptography } from '@liskhq/lisk-client';
import { mount } from 'enzyme';
import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import mockBlockchainApplications from '@tests/fixtures/blockchainApplicationsManage';
import wallets from '@tests/constants/wallets';
import { getAddressFromBase32Address } from '@wallet/utils/account';
import { mockTokensBalance } from '@token/fungible/__fixtures__';
import blockchainApplicationsExplore from '@tests/fixtures/blockchainApplicationsExplore';
import { mockAuth } from 'src/modules/auth/__fixtures__';
import { useAuth } from 'src/modules/auth/hooks/queries';
import mockSavedAccounts from '@tests/fixtures/accounts';
import TxSummarizer from '.';
import { convertStringToBinary } from '../../utils';

const mockedCurrentAccount = mockSavedAccounts[0];
jest.mock('@auth/hooks/queries');
jest.mock('@account/hooks', () => ({
  useCurrentAccount: jest.fn(() => [mockedCurrentAccount, jest.fn()]),
}));

describe('TxSummarizer', () => {
  let props;
  const address = 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt';
  jest.spyOn(cryptography.address, 'getLisk32AddressFromPublicKey').mockReturnValue(address);

  beforeEach(() => {
    props = {
      title: 'mock title',
      wallet: wallets.genesis,
      token: 'LSK',
      confirmButton: {
        label: 'Confirm',
        onClick: jest.fn(),
      },
      cancelButton: {
        label: 'Cancel',
        onClick: jest.fn(),
      },
      t: (key) => key,
      selectedPriority: { title: 'Normal', value: 1 },
      transactionData: {
        recipient: { value: 'lskyrwej7xuxeo39ptuyff5b524dsmnmuyvcaxkag' },
        amount: 10,
        data: 'test message',
      },
      formProps: {
        isValid: true,
        moduleCommand: MODULE_COMMANDS_NAME_MAP.transfer,
        composedFees: [{ isHidden: false, title: 'test', value: '1 LSK' }],
        fields: {
          sendingChain: mockBlockchainApplications[0],
          recipientChain: { ...blockchainApplicationsExplore[0], logo: { png: '', svg: '' } },
          token: mockTokensBalance.data[0],
          recipient: {
            address: wallets.genesis.summary.address,
            title: 'test title',
          },
        },
      },
      transactionJSON: {
        signatures: expect.any(Array),
        id: expect.any(Object),
        fee: BigInt(141000),
        module: 'token',
        command: 'transfer',
        senderPublicKey: convertStringToBinary(wallets.genesis.summary.publicKey),
        nonce: BigInt(2),
        params: {
          recipientAddress: getAddressFromBase32Address(wallets.genesis.summary.address),
          amount: BigInt(112300000),
          data: 'test',
        },
      },
    };
  });
  useAuth.mockReturnValue({ data: mockAuth });

  it('should render title', () => {
    const wrapper = mount(<TxSummarizer {...props} />);
    expect(wrapper.find('h2').text()).toEqual(props.title);
  });

  it('should call action functions of each button', () => {
    const wrapper = mount(<TxSummarizer {...props} />);
    wrapper.find('.confirm-button').at(0).simulate('click');
    expect(props.confirmButton.onClick).toHaveBeenCalled();
    wrapper.find('.cancel-button').at(0).simulate('click');
    expect(props.cancelButton.onClick).toHaveBeenCalled();
  });

  it('should display HW illustration', () => {
    const wrapper = mount(<TxSummarizer {...props} />);
    const newProps = {
      ...props,
      wallet: {
        ...props.wallet,
        loginType: 1,
      },
    };
    expect(wrapper.find('.illustration')).not.toExist();
    wrapper.setProps(newProps);
    expect(wrapper.find('.illustration')).toExist();
  });

  it('should mount its children', () => {
    const wrapper = mount(
      <TxSummarizer {...props}>
        <span className="child-span" />
      </TxSummarizer>
    );
    expect(wrapper.find('.child-span')).toExist();
  });

  it('should display tx fee for regular account', () => {
    // Regular account
    const wrapper = mount(<TxSummarizer {...props} />);
    expect(wrapper.find('.fee-value-test')).toExist();
    expect(wrapper.find('.fee-value-test').text()).toContain('1 LSK');

    // multisig account
    const newProps = {
      ...props,
      wallet: {
        ...props.wallet,
        summary: {
          ...props.wallet.summary,
          isMultisignature: true,
        },
        keys: {
          mandatoryKeys: [],
          optionalKeys: [],
        },
      },
    };
    wrapper.setProps(newProps);
    expect(wrapper.find('.fee-value')).not.toExist();
  });

  it('should display details of the transaction', () => {
    const multisigProps = {
      ...props,
      formProps: {
        isValid: true,
        moduleCommand: MODULE_COMMANDS_NAME_MAP.registerMultisignature,
        composedFees: { 'Initialization Fee': '1 LSK', Transaction: '1 LSK' },
        fields: {
          token: mockTokensBalance.data[0],
        },
      },
      transactionJSON: {
        ...props.transactionJSON,
        moduleCommand: MODULE_COMMANDS_NAME_MAP.registerMultisignature,
        params: {
          mandatoryKeys: [wallets.genesis.summary.publicKey],
          optionalKeys: [wallets.validator.summary.publicKey, wallets.multiSig.summary.publicKey],
          numberOfSignatures: 2,
        },
      },
    };

    const wrapper = mount(<TxSummarizer {...multisigProps} />);
    expect(wrapper.find('.info-numberOfSignatures').at(0).text()).toEqual('Required signatures2');
    expect(wrapper.find('.member-info').at(0).find('p span').text()).toEqual('(Mandatory)');
    expect(wrapper.find('.member-info').at(1).find('p span').text()).toEqual('(Optional)');
    expect(wrapper.find('.member-info').at(2).find('p span').text()).toEqual('(Optional)');
  });
});
