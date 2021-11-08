import React from 'react';
import { mount } from 'enzyme';
import * as hwManagerAPI from '@utils/hwManager';
import Summary from './summary';
import accounts from '../../../../../test/constants/accounts';
import flushPromises from '../../../../../test/unit-test-utils/flushPromises';

const mockTransaction = { id: 1 };
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
  };

  beforeEach(() => {
    wrapper = mount(<Summary {...props} />);
    hwManagerAPI.signTransactionByHW.mockResolvedValue({});
  });

  it('Should call props.nextStep', async () => {
    wrapper.find('button.confirm').simulate('click');
    await flushPromises();
    expect(props.nextStep).toHaveBeenCalledWith({ transaction: mockTransaction });
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
