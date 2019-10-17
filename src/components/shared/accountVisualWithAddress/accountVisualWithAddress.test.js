import React from 'react';
import { mount } from 'enzyme';
import AcountVisualWithAddress from '.';

describe('AccountVisualWithAddress component', () => {
  const props = {
    showBookmarkedAddress: true,
    transactionSubject: 'senderId',
    address: '283470127032187L',
    bookmarks: {
      LSK: [{
        title: 'BM',
        address: '283470127032187L',
      }],
    },
  };

  it('should show bookmarked name if address is bookmarked', () => {
    const wrapper = mount(<AcountVisualWithAddress {...props} />);
    expect(wrapper.find('.addressValue').at(0)).toHaveText('BM');
  });
});
