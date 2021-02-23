import React from 'react';
import { mount } from 'enzyme';
import VoteItem from '.';
import { truncateAddress } from '../../../utils/account';

jest.mock('../../../utils/account');

describe('VoteItem', () => {
  it('should render correctly', () => {
    const props = {
      vote: {
        confirmed: '10',
      },
      address: '1L',
      truncate: true,
    };
    const wrapper = mount(<VoteItem {...props} />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toContainMatchingElement('.vote-item-address');
    expect(wrapper).toContainMatchingElement('LiskAmount');
    expect(truncateAddress).toHaveBeenCalled();
  });
});
