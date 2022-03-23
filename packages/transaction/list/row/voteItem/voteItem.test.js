import React from 'react';
import { mount } from 'enzyme';
import { truncateAddress } from '@wallet/utilities/account';
import VoteItem from '.';

jest.mock('@wallet/utilities/account');

describe('VoteItem', () => {
  it('should render correctly', () => {
    const props = {
      vote: {
        confirmed: '10',
      },
      address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11',
      truncate: true,
    };
    const wrapper = mount(<VoteItem {...props} />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toContainMatchingElement('.vote-item-address');
    expect(wrapper).toContainMatchingElement('LiskAmount');
    expect(truncateAddress).toHaveBeenCalled();
  });
});
