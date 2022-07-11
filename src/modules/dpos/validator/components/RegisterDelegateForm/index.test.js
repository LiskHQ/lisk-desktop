import React from 'react';
import { mount } from 'enzyme';
import wallets from '@tests/constants/wallets';
import useDelegateName from '../../hooks/useDelegateName';
import useDelegateKey from '../../hooks/useDelegateKey';
import RegisterDelegateForm from '.';

jest.mock('../../hooks/useDelegateName', () => jest.fn());
jest.mock('../../hooks/useDelegateKey', () => jest.fn());

const genKey = {
  value: 'dcad7c69505d549803fb6a755e81cdcb0a33ea95b6476e2585149f8a42c9c882',
  error: false,
  message: '',
};
const blsKey = {
  value: '830ce8c4a0b4f40b9b2bd2f16e835676b003ae28ec367432af9bfaa4d5201051786643620eff288077c1e7a8415c0285',
  error: false,
  message: '',
};
const pop = {
  value: '722b19e4b302e3e13ef097b417b651feadc8e28754530119911561c27b9478cdcd6b7ada331037bbda778b0b325aab5a79f34b31ea780acd01bf67d38268c43ea0ea75a5e757a76165253e1e20680c4cfd884ed63f5663c7b940e67162d5f715',
  error: false,
  message: '',
};
const empty = {
  value: '',
  error: true,
  message: 'Can not be empty',
};

describe('RegisterDelegateForm', () => {
  const props = {
    prevState: {},
    nextStep: jest.fn(),
  };

  const setName = jest.fn();
  const setKey = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Renders correctly', () => {
    it('renders properly RegisterDelegateForm component', () => {
      useDelegateName.mockReturnValue([empty, setName]);
      useDelegateKey.mockReturnValue([empty, empty, empty, setKey]);
      const wrapper = mount(<RegisterDelegateForm {...props} />);
      expect(wrapper).toContainMatchingElement('.select-name-container');
      expect(wrapper).toContainMatchingElement('.select-name-input');
      expect(wrapper).toContainMatchingElement('.feedback');
      expect(wrapper).toContainMatchingElement('.confirm-btn');
      expect(wrapper.find('button.confirm-btn')).toBeDisabled();
    });

    it('type a valid and unused username', async () => {
      useDelegateName.mockReturnValue([empty, setName]);
      useDelegateKey.mockReturnValue([empty, empty, empty, setKey]);
      const wrapper = mount(<RegisterDelegateForm {...props} />);

      wrapper.find('input.select-name-input')
        .simulate('change', { target: { value: 'mydelegate' } });
      wrapper.find('input.generator-publicKey-input')
        .simulate('change', { target: { value: genKey.value, name: 'generatorPublicKey' } });
      wrapper.find('input.bls-key-input')
        .simulate('change', { target: { value: blsKey.value, name: 'blsPublicKey' } });
      wrapper.find('input.pop-input')
        .simulate('change', { target: { value: pop.value, name: 'proofOfPossession' } });
      expect(setName).toHaveBeenCalledTimes(1);
      expect(setKey).toHaveBeenCalledWith('generatorPublicKey', genKey.value);
      expect(setKey).toHaveBeenCalledWith('blsPublicKey', blsKey.value);
      expect(setKey).toHaveBeenCalledWith('proofOfPossession', pop.value);
    });
  });

  describe('Handles errors', () => {
    const wrongName = {
      value: 's',
      error: true,
      message: 'Too short',
    };
    const validName = {
      value: 'some_name',
      error: false,
      message: '',
    };
    const wrongKey = {
      value: 'SSSSSSS',
      error: true,
      message: 'Invalid hex value',
    };

    it('Display delegate name input errors', () => {
      useDelegateKey.mockReturnValue([genKey, blsKey, pop, setKey]); // valid
      useDelegateName.mockReturnValue([wrongName, setName]); // invalid
      const wrapper = mount(<RegisterDelegateForm {...props} />);
      expect(wrapper.find('button.confirm-btn')).toBeDisabled();
      expect(wrapper.find('.feedback').at(0)).toHaveText('Too short');
    });

    it('Display generator key input error', () => {
      useDelegateKey.mockReturnValue([wrongKey, blsKey, pop, setKey]); // invalid
      useDelegateName.mockReturnValue([validName, setName]); // valid
      const wrapper = mount(<RegisterDelegateForm {...props} />);
      expect(wrapper.find('button.confirm-btn')).toBeDisabled();
      expect(wrapper.find('.feedback').at(1)).toHaveText('Invalid hex value');
    });

    it('Display bls key input error', () => {
      useDelegateKey.mockReturnValue([genKey, wrongKey, pop, setKey]); // invalid
      useDelegateName.mockReturnValue([validName, setName]); // valid
      const wrapper = mount(<RegisterDelegateForm {...props} />);
      expect(wrapper.find('button.confirm-btn')).toBeDisabled();
      expect(wrapper.find('.feedback').at(2)).toHaveText('Invalid hex value');
    });

    it('Display pop key input error', () => {
      useDelegateKey.mockReturnValue([genKey, blsKey, wrongKey, setKey]); // invalid
      useDelegateName.mockReturnValue([validName, setName]); // valid
      const wrapper = mount(<RegisterDelegateForm {...props} />);
      expect(wrapper.find('button.confirm-btn')).toBeDisabled();
      expect(wrapper.find('.feedback').at(3)).toHaveText('Invalid hex value');
    });
  });

  describe('Pass valid tx', () => {
    const validName = {
      value: 'some_name',
      error: false,
      message: '',
    };
    const rawTx = {
      asset: {
        blsPublicKey: blsKey.value,
        generatorPublicKey: genKey.value,
        proofOfPossession: pop.value,
        username: validName.value,
      },
      fee: 0,
      moduleAssetId: '5:0',
      nonce: '1',
      sender: {
        publicKey: wallets.genesis.summary.publicKey,
      },
    };
    useDelegateKey.mockReturnValue([genKey, blsKey, pop, setKey]); // valid
    useDelegateName.mockReturnValue([validName, setName]); // valid
    const wrapper = mount(<RegisterDelegateForm {...props} />);
    wrapper.find('button.confirm-btn').simulate('click');
    expect(props.nextStep).toHaveBeenCalledWith({
      rawTx,
    });
  });
});
