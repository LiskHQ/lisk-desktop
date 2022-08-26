import React from 'react';
import { mount } from 'enzyme';
import { MODULE_COMMANDS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import accounts from '@tests/constants/wallets';
import { mountWithProps } from 'src/utils/testHelpers';
import { genKey, blsKey, pop } from '@tests/constants/keys';
import TxComposer from './index';

describe('TxComposer', () => {
  const transaction = {
    moduleCommandID: MODULE_COMMANDS_NAME_ID_MAP.transfer,
    params: {
      recipient: { address: accounts.genesis.summary.address },
      amount: 100000,
      data: 'test-data',
    },
    isValid: true,
    feedback: [],
  };
  const props = {
    children: null,
    transaction,
    onComposed: jest.fn(),
    onConfirm: jest.fn(),
    className: 'test-class-name',
    buttonTitle: 'test-button-title',
  };

  it('should render TxComposer correctly for a valid tx', () => {
    const wrapper = mount(<TxComposer {...props} />);
    expect(wrapper.find('TransactionPriority')).toExist();
    expect(wrapper.find('Feedback').html()).toEqual(null);
    expect(wrapper.find('.confirm-btn')).toExist();
    expect(wrapper.find('.confirm-btn').at(0).props().disabled).toEqual(false);
  });

  it('should render TxComposer correctly for an invalid tx', () => {
    const newProps = {
      ...props,
      transaction: {
        ...props.transaction,
        isValid: false,
        feedback: ['Test error feedback'],
      },
    };
    const wrapper = mount(<TxComposer {...newProps} />);
    expect(wrapper.find('TransactionPriority')).toExist();
    expect(wrapper.find('Feedback').text()).toEqual('Test error feedback');
    expect(wrapper.find('.confirm-btn').at(0).props().disabled).toEqual(true);
  });

  it('should render TxComposer correctly if the balance is not sufficient', () => {
    const newProps = {
      ...props,
      transaction: {
        isValid: true,
        feedback: [],
        moduleCommandID: MODULE_COMMANDS_NAME_ID_MAP.registerDelegate,
        params: {
          username: 'test_username',
          generatorPublicKey: genKey,
          blsPublicKey: blsKey,
          proofOfPossession: pop,
        },
      },
    };
    const state = {
      wallet: { info: { LSK: accounts.empty_wallet } },
    };
    const wrapper = mountWithProps(TxComposer, newProps, state);
    expect(wrapper.find('TransactionPriority')).toExist();
    expect(wrapper.find('Feedback').text()).toEqual('The minimum required balance for this action is {{minRequiredBalance}} {{token}}');
    expect(wrapper.find('.confirm-btn').at(0).props().disabled).toEqual(true);
  });
});
