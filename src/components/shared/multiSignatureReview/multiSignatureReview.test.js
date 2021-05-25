import React from 'react';
import { mount } from 'enzyme';
import Review from './index';

describe('Multisignature Review component', () => {
  let wrapper;
  const props = {
    t: v => v,
    members: [
      {
        address: '8195226425328336181L', isMandatory: true,
      },
      { address: '6195226421328336181L', isMandatory: false },
      { address: '4827364921328336181L', isMandatory: false },
      { address: '5738363111328339181L', isMandatory: false },
      { address: '9484364921328336181L', isMandatory: false },
    ],
    fee: 0.02,
    numberOfSignatures: 2,
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
