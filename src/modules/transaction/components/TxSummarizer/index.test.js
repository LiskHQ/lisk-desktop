import React from 'react';
import { cryptography } from '@liskhq/lisk-client';
import { mount } from 'enzyme';
import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import mockBlockchainApplications from '@tests/fixtures/blockchainApplicationsManage';
import { mockAppTokens } from '@tests/fixtures/token';
import wallets from '@tests/constants/wallets';
import TxSummarizer from '.';

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
      t: key => key,
      rawTx: {
        moduleCommand: MODULE_COMMANDS_NAME_MAP.transfer,
        sender: { publicKey: wallets.genesis.summary.publicKey },
        fee: 2000000,
        nonce: 0,
        signatures: [],
        params: {
          recipient: { address: wallets.genesis.summary.address },
          amount: 100000000,
          data: 'test',
        },
      },
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
  });

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
      </TxSummarizer>,
    );
    expect(wrapper.find('.child-span')).toExist();
  });

  it('should display tx fee for regular account', () => {
    // Regular account
    const wrapper = mount(<TxSummarizer {...props} />);
    expect(wrapper.find('.fee-value-Transaction')).toExist();
    expect(wrapper.find('.fee-value-Transaction').text()).toContain('1 LSK');

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
          members: [],
        },
      },
    };
    wrapper.setProps(newProps);
    expect(wrapper.find('.fee-value')).not.toExist();
  });

  it('should display details of the transaction', () => {
    const multisigProps = {
      ...props,
      rawTx: {
        ...props.rawTx,
        moduleCommand: MODULE_COMMANDS_NAME_MAP.registerMultisignature,
        params: {
          mandatoryKeys: [wallets.genesis.summary.publicKey],
          optionalKeys: [wallets.delegate.summary.publicKey, wallets.multiSig.summary.publicKey],
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
