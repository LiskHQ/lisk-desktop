import React from 'react';
import { shallow } from 'enzyme';
import SignMessage from './signMessage';
import accounts from '../../../../test/constants/accounts';

describe('Sign Message Component', () => {
  const props = {
    account: accounts.genesis,
    history: {
      path: '/wallet',
      location: { search: '?modal=signMessage' },
      goBack: jest.fn(),
    },
    t: v => v,
  };

  it('Should render properly', () => {
    const wrapper = shallow(<SignMessage {...props} />);
    expect(wrapper).toContainExactlyOneMatchingElement('MultiStep');
    expect(wrapper).toContainExactlyOneMatchingElement('Form');
    expect(wrapper).toContainExactlyOneMatchingElement('BoxHeader');
  });
});
