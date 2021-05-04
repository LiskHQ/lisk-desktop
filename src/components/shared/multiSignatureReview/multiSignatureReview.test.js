import React from 'react';
import { mount } from 'enzyme';
import Review from './index';

describe('Multisignature Review component', () => {
  let wrapper;
  const props = {
    t: v => v,
    members: [
      {
        accountId: '8195226425328336181L', publicKey: '8155694652104526882', accountRole: 'mandatory',
      },
      { accountId: '6195226421328336181L', publicKey: '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a', accountRole: 'optional' },
      { accountId: '4827364921328336181L', publicKey: '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a', accountRole: 'optional' },
      { accountId: '5738363111328339181L', publicKey: '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a', accountRole: '' },
      { accountId: '9484364921328336181L', publicKey: '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a', accountRole: 'owner' },
    ],
    fee: 2000000,
    requiredSignatures: 2,
  };

  beforeEach(() => {
    wrapper = mount(<Review {...props} />);
  });

  it('Should render properly', () => {
    expect(wrapper).toContainMatchingElements(props.members.length, '.member-info');
    expect(wrapper.find('.infoColumn.info-requiredSignatures')).toHaveText('Required Signatures2');
    expect(wrapper.find('.infoColumn.info-fee')).toHaveText('Transaction fee0.02 LSK');
  });
});
