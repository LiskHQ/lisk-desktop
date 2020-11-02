import React from 'react';
import { mount } from 'enzyme';
import Review from './reviewSign';
import accounts from '../../../../../test/constants/accounts';

describe('Sign Multisignature Tx Review component', () => {
  let wrapper;
  const props = {
    t: v => v,
    prevStep: jest.fn(),
    nextStep: jest.fn(),
    transactionCreatedSuccess: jest.fn(),
    host: accounts.delegate,
    networkIdentifier: 'sample_identifier',
    transaction: {
      id: '12510531279763703865',
      type: 12,
      senderPublicKey: '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
      senderId: '5059876081639179984L',
      nonce: '158',
      fee: '10000000000',
      signatures: [
        'fd59169392ebf28d5a0382161faa8f767e0cf0dff1b805ed8a28556343e0fb988622e40ad529a7570d47013efc979afb2fe9538d67d0d877afdfadafd6c73c0f',
        'fd59169392ebf28d5a0382161faa8f767e0cf0dff1b805ed8a28556343e0fb988622e40ad529a7570d47013efc979afb2fe9538d67d0d877afdfadafd6c73c0f',
        'e20dc01f8afa54315ebc3a7e1bc2f366cc1c9291400f9eda51e9aaed5ab3eef0c666e28a628bcae1ea85d65fb2ee6ebbaa6aee0476844328dc1fed71fc25a907',
        '',
      ],
      asset: {
        mandatoryKeys: [
          '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
        ],
        optionalKeys: [
          '197cf311f678406bc72a8edfdc3dffe6f59f49c4550a860e4b68fb20382211d0',
          '86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19',
        ],
        numberOfSignatures: 2,
      },
    },
  };

  beforeEach(() => {
    wrapper = mount(<Review {...props} />);
  });

  it('Should call props.nextStep passing the signed transaction', () => {
    const signatures = props.transaction.signatures;
    signatures[3] = '3b6903ae67f43e21ba940a5244301b42592f24615dba79a62e10e90d40b4be0a079e77b606298462f7a8a953194bf5d5b489eb9f6885175e349ab5711d28e00a';
    wrapper.find('button.confirm').simulate('click');
    expect(props.nextStep).toHaveBeenCalled();
    expect(props.nextStep.mock.calls[0][0].transactionInfo.signatures).toEqual(signatures);
  });

  it('Should call props.prevStep', () => {
    wrapper.find('button.go-back').simulate('click');
    expect(props.prevStep).toBeCalled();
  });

  it('Should render properly', () => {
    const { asset } = props.transaction;
    const expectedLength = asset.mandatoryKeys.length + asset.optionalKeys.length;
    const html = wrapper.html();
    expect(wrapper).toContainMatchingElements(expectedLength, '.member-info');
    expect(html).toContain('100 LSK');
  });
});
