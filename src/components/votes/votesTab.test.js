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
    t: v => v,
  };

  const options = {
    context: { i18n },
    childContextTypes: { i18n: PropTypes.object.isRequired },
  };

  const setup = data => mount(<VotesTab {...data} />, options);

  it('Should render with empty state', () => {
    wrapper = setup(props);
    expect(wrapper).toIncludeText('This wallet doesn’t have any votes');
  });

  it('Should show loading state', () => {
    wrapper = setup({ ...props, loading: ['loading'] });
    expect(wrapper).toContainMatchingElement('.loadingSpinner');
  });

  it('Should render only 30 visible and clicking show more shows 30 more', () => {
    const votes = [...Array(101)].map((_, i) => ({ username: `user_${i}`, address: `${i}L` }));
    wrapper = setup({ ...props, votes });
    expect(wrapper).toContainMatchingElements(31, 'TableRow');
    wrapper.find('.show-more-button').simulate('click');
    expect(wrapper).toContainMatchingElements(61, 'TableRow');
  });

  it('Should Filter votes per username and show error message if no results found', () => {
    const votes = [...Array(101)].map((_, i) => ({ username: `user_${i}`, address: `${i}L` }));
    wrapper = setup({ ...props, votes });
    wrapper.find('.filterHolder input').simulate('change', { target: { value: 'user_100' } });
    expect(wrapper).toContainMatchingElements(2, 'TableRow');
    wrapper.find('.filterHolder input').simulate('change', { target: { value: 'not user name' } });
    expect(wrapper).toIncludeText('There are no results matching this filter');
  });
});
