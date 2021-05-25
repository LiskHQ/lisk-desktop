import React from 'react';
import { mount } from 'enzyme';
import Summary from './summary';
import accounts from '../../../../../test/constants/accounts';
import flushPromises from '../../../../../test/unit-test-utils/flushPromises';

const mockTransaction = { id: 1 };
jest.mock('@api/transaction/lsk', () => ({
  createMultiSignatureTransaction: jest.fn(() => Promise.resolve(mockTransaction)),
}));

describe('Multisignature summary component', () => {
  let wrapper;
  const props = {
    t: v => v,
    prevStep: jest.fn(),
    nextStep: jest.fn(),
    fee: 0.02,
    account: accounts.genesis,
    members: [
      { address: '8195226425328336181L', isMandatory: true },
      { address: '6195226421328336181L', isMandatory: false },
      { address: '4827364921328336181L', isMandatory: false },
      { address: '5738363111328339181L', isMandatory: false },
      { address: '9484364921328336181L', isMandatory: false },
    ],
  };

  beforeEach(() => {
    wrapper = mount(<Summary {...props} />);
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
