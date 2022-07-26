import React from 'react';
import { mount } from 'enzyme';
import { MODULE_COMMANDS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import wallets from '@tests/constants/wallets';
import TxSummarizer from '.';

describe('TxSummarizer', () => {
  let props;

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
        moduleCommandID: MODULE_COMMANDS_NAME_ID_MAP.transfer,
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
    expect(wrapper.find('.regular-tx-fee')).toExist();
    expect(wrapper.find('.regular-tx-fee').text()).toContain('0.02 LSK');

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
    expect(wrapper.find('.regular-tx-fee')).not.toExist();
  });

  it('should display details of the transaction', () => {
    const multisigProps = {
      ...props,
      rawTx: {
        ...props.rawTx,
        moduleCommandID: MODULE_COMMANDS_NAME_ID_MAP.registerMultisignatureGroup,
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
