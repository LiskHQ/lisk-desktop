import React from 'react';
import { mount } from 'enzyme';
import Review from './reviewSign';

describe('Sign Multisignature Tx Review component', () => {
  let wrapper;
  const props = {
    t: v => v,
    prevStep: jest.fn(),
    nextStep: jest.fn(),
    transactionCreatedSuccess: jest.fn(),
    fee: 2000000,
    members: [
      {
        name: 'Test User', address: '8195226425328336181L', publicKey: '8155694652104526882', mandatory: true,
      },
      { address: '6195226421328336181L', publicKey: '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a', mandatory: false },
      { address: '4827364921328336181L', publicKey: '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a', mandatory: false },
      { address: '5738363111328339181L', publicKey: '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a', mandatory: false },
      { address: '9484364921328336181L', publicKey: '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a', mandatory: false },
    ],
  };

  beforeEach(() => {
    wrapper = mount(<Review {...props} />);
  });

  it('Should call props.nextStep and props.transactionCreatedSuccess', () => {
    const tx = { id: 1 };
    wrapper.find('button.confirm').simulate('click');
    expect(props.nextStep).toBeCalledWith({ transactionInfo: tx });
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
