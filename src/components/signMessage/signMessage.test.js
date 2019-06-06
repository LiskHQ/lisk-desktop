import React from 'react';
import { mount } from 'enzyme';
import SignMessage from './signMessage';
import accounts from '../../../test/constants/accounts';

describe('Sign Message Component', () => {
  const props = {
    account: accounts.genesis,
    history: {
      location: { search: '' },
      goBack: jest.fn(),
    },
    t: v => v,
  };
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<SignMessage {...props} />);
  });

  it('Should render properly', () => {
    expect(wrapper).toContainExactlyOneMatchingElement('MultiStep');
    expect(wrapper).toContainExactlyOneMatchingElement('SignMessageInput');
    expect(wrapper).not.toContainExactlyOneMatchingElement('ConfirmMessage');
  });
});
