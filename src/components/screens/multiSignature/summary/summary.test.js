import React from 'react';
import { mount } from 'enzyme';
import * as hwManagerAPI from '@utils/hwManager';
import Summary from './summary';
import accounts from '../../../../../test/constants/accounts';

const mockTransaction = {
  fee: 0.02,
  mandatoryKeys: [
    '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
    '86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19',
  ],
  numberOfSignatures: 2,
  optionalKeys: [],
};

jest.mock('@api/transaction/lsk', () => ({
  create: jest.fn(() => Promise.resolve(mockTransaction)),
  computeTransactionId: jest.fn(() => mockTransaction.id),
}));
jest.mock('@utils/hwManager');

describe('Multisignature summary component', () => {
  const members = [accounts.genesis, accounts.delegate].map(item => ({
    address: item.summary.address,
    isMandatory: true,
  }));
  const mandatoryKeys = [accounts.genesis, accounts.delegate].map(item => item.summary.publicKey);

  let wrapper;
  const props = {
    t: v => v,
    prevStep: jest.fn(),
    nextStep: jest.fn(),
    fee: 0.02,
    account: accounts.genesis,
    members,
    numberOfSignatures: 2,
    mandatoryKeys,
    optionalKeys: [],
    network: {
      networks: {
        LSK: { networkIdentifier: '01e47ba4e3e57981642150f4b45f64c2160c10bac9434339888210a4fa5df097' },
        BTC: { networkIdentifier: '01e47ba4e3e57981642150f4b45f64c2160c10bac9434339888210a4fa5df097' },
      },
      name: 'customNode',
    },
    multisigGroupRegistered: jest.fn(),
  };

  beforeEach(() => {
    wrapper = mount(<Summary {...props} />);
    hwManagerAPI.signTransactionByHW.mockResolvedValue({});
  });

  it('Should call props.nextStep', async () => {
    wrapper.find('button.confirm').simulate('click');
    expect(props.nextStep).toHaveBeenCalledWith({
      rawTransaction: {
        fee: String(props.fee),
        mandatoryKeys: props.mandatoryKeys,
        optionalKeys: props.optionalKeys,
        numberOfSignatures: props.numberOfSignatures,
      },
      actionFunction: props.multisigGroupRegistered,
      statusInfo: {
        mandatoryKeys: props.mandatoryKeys,
        optionalKeys: props.optionalKeys,
        numberOfSignatures: props.numberOfSignatures,
      },
    });
  });

  it('Should call props.prevStep', () => {
    wrapper.find('button.go-back').simulate('click');
    expect(props.prevStep).toBeCalled();
  });

  it('Should render properly', () => {
    const html = wrapper.html();
    expect(wrapper.find('.member-info').length).toEqual(props.members.length);
    expect(html).toContain('0.02 LSK');
  });
});
