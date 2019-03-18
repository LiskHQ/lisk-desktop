import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import i18n from '../../i18n';
import VotesTab from './votesTab';

describe('Votes Tab Component', () => {
  let wrapper;
  const props = {
    loading: [],
    votes: [],
    fetchVotedDelegateInfo: jest.fn(),
  };

  const options = {
    context: { i18n },
    childContextTypes: { i18n: PropTypes.object.isRequired },
  };

  const setup = data => mount(<VotesTab {...data} />, options);

  it('Should render with empty state', () => {
    wrapper = setup(props);
    expect(wrapper.find('.empty-message')).toIncludeText('This wallet doesn’t have any votes');
  });

  it('Should show loading state', () => {
    wrapper = setup({ ...props, loading: ['loading'] });
    expect(wrapper).toContainMatchingElement('.loadingSpinner');
  });

  it('Should render only 30 visible and clicking show more shows 30 more', () => {
    const votes = [...Array(101)].map((_, i) => ({
      username: `user_${i}`,
      address: `${i}L`,
      rank: i + 1,
      rewards: '40500000000',
      productivity: Math.random() * 100,
      vote: '9999988456732672',
    }));
    wrapper = setup({ ...props, votes });
    expect(wrapper).toContainMatchingElements(31, 'TableRow');
    wrapper.find('.show-more-button').simulate('click');
    expect(props.fetchVotedDelegateInfo).toHaveBeenCalled();
    expect(wrapper).toContainMatchingElements(61, 'TableRow');
  });

  it('Should Filter votes per username and show error message if no results found', () => {
    const votes = [...Array(101)].map((_, i) => ({
      username: `user_${i}`,
      address: `${i}L`,
      rank: i + 1,
      rewards: '40500000000',
      productivity: Math.random() * 100,
      vote: '9999988456732672',
    }));
    wrapper = setup({ ...props, votes });
    wrapper.find('.filterHolder input').simulate('change', { target: { value: 'user_100' } });
    jest.advanceTimersByTime(300);
    expect(props.fetchVotedDelegateInfo).toHaveBeenCalled();
    expect(wrapper).toContainMatchingElements(2, 'TableRow');
    wrapper.find('.filterHolder input').simulate('change', { target: { value: 'not user name' } });
    expect(wrapper.find('.empty-message')).toIncludeText('There are no results matching this filter');
  });
});
