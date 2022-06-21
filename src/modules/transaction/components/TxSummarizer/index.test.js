import React from 'react';
import { mount } from 'enzyme';
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
        moduleAssetId: '2:0',
        sender: { publicKey: wallets.genesis.summary.publicKey },
        fee: 2000000,
        nonce: 0,
        signatures: [],
        asset: {
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
});
