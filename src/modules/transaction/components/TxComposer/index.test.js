import React from 'react';
import { mount } from 'enzyme';
import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import accounts from '@tests/constants/wallets';
import { mountWithProps } from 'src/utils/testHelpers';
import TxComposer from './index';

describe('TxComposer', () => {
  const transaction = {
    moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.transfer,
    asset: {
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
        moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.registerDelegate,
        asset: {
          username: 'test_username',
          generatorPublicKey: 'dcad7c69505d549803fb6a755e81cdcb0a33ea95b6476e2585149f8a42c9c882',
          blsPublicKey: '830ce8c4a0b4f40b9b2bd2f16e835676b003ae28ec367432af9bfaa4d5201051786643620eff288077c1e7a8415c0285',
          proofOfPossession: '722b19e4b302e3e13ef097b417b651feadc8e28754530119911561c27b9478cdcd6b7ada331037bbda778b0b325aab5a79f34b31ea780acd01bf67d38268c43ea0ea75a5e757a76165253e1e20680c4cfd884ed63f5663c7b940e67162d5f715',
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
