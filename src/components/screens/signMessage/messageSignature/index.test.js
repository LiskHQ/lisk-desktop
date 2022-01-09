import React from 'react';
import { shallow } from 'enzyme';
import MessageSignature from './index';
import accounts from '../../../../../test/constants/accounts';

describe('Sign Message: MessageSignature', () => {
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
    const wrapper = shallow(<MessageSignature {...props} />);
  });
});
