import React from 'react';
import { mount } from 'enzyme';
import { MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import { removeSearchParamsFromUrl } from '@utils/searchParams';
import { signTransaction } from '@utils/transaction';
import Review from './reviewSign';
import accounts from '../../../../../test/constants/accounts';

jest.mock('@utils/searchParams', () => ({
  removeSearchParamsFromUrl: jest.fn(),
}));

jest.mock('@utils/transaction', () => ({
  signTransaction: jest.fn().mockImplementation(() => [{}, undefined]),
  getTxAmount: () => '1000000000',
}));

describe('Sign Multisignature Tx Review component', () => {
  let wrapper;
  const props = {
    t: v => v,
    transaction: {
      id: '12510531279763703865',
      moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.transfer,
      nonce: '158',
      sender: {
        address: accounts.multiSig.summary.address,
      },
      fee: '1000000',
      signatures: [
        accounts.multiSig.summary.publicKey,
        '',
        '',
      ],
      asset: {
        mandatoryKeys: accounts.multiSig.keys.mandatoryKeys,
        optionalKeys: accounts.multiSig.keys.optionalKeys,
        numberOfSignatures: accounts.multiSig.keys.numberOfSignatures,
        recipient: {
          address: accounts.genesis.summary.address,
        },
      },
    },
    account: accounts.genesis,
    networkIdentifier: 'sample_identifier',
    nextStep: jest.fn(),
    history: {},
    error: undefined,
    senderAccount: { data: accounts.multiSig },
  };

  beforeEach(() => {
    wrapper = mount(<Review {...props} />);
  });

  it('Should call props.nextStep passing the signed transaction', () => {
    wrapper = mount(<Review {...props} />);
    const signatures = props.transaction.signatures;
    signatures[1] = accounts.genesis.summary.publicKey;
    wrapper.find('button.sign').simulate('click');
    expect(props.nextStep).toHaveBeenCalled();
    expect(signTransaction).toHaveBeenCalled();
    expect(props.nextStep.mock.calls[0][0]).toHaveProperty('transaction');
  });

  it('Should call props.prevStep', () => {
    wrapper = mount(<Review {...props} />);
    wrapper.find('button.reject').simulate('click');
    expect(removeSearchParamsFromUrl).toHaveBeenCalledWith(props.history, ['modal']);
  });

  it('Should render properly', () => {
    wrapper = mount(<Review {...props} />);
    const { asset } = props.transaction;
    const expectedLength = asset.mandatoryKeys.length + asset.optionalKeys.length;
    const html = wrapper.html();
    expect(wrapper).toContainMatchingElements(expectedLength, '.member-info');
    expect(html).toContain('0.01 LSK');
  });
});
