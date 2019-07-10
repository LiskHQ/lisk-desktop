import React from 'react';
import { mount } from 'enzyme';
import accounts from '../../../../test/constants/accounts';
import VoteUrlProcessor from './voteUrlProcessor';
import routes from '../../../constants/routes';

describe.skip('VoteUrlProcessor', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    const account = accounts.delegate;
    const location = {
      search: '?votes=delegate_name',
      pathname: routes.voting.path,
    };

    props = {
      account,
      voteLookupStatusCleared: jest.fn(),
      urlVotesFound: jest.fn(),
      voteLookupStatus: {
        notVotedYet: [],
        pending: [],
        notFound: [],
        alreadyVoted: [],
      },
      history: {
        location,
        listen: callback => callback(location),
        push: () => {},
      },
      urlVoteCount: 0,
      t: key => key,
    };
  });

  it('calls props.urlVotesFound with upvotes if URL contains ?votes=delegate_name', () => {
    wrapper = mount(<VoteUrlProcessor {...{
      ...props,
      history: {
        ...props.history,
        location: {
          search: '?votes=delegate_name',
        },
      },
    }}
    />);
    expect(props.urlVotesFound).toHaveBeenCalledWith({
      upvotes: ['delegate_name'],
      unvotes: [],
      address: props.account.address,
    });
  });

  it('calls props.urlVotesFound with unvotes if URL contains ?unvotes=delegate_name', () => {
    wrapper = mount(<VoteUrlProcessor {...{
      ...props,
      history: {
        ...props.history,
        location: {
          search: '?unvotes=delegate_name',
        },
      },
    }}
    />);
    expect(props.urlVotesFound).toHaveBeenCalledWith({
      upvotes: [],
      unvotes: ['delegate_name'],
      address: props.account.address,
    });
  });

  it('displays the selected votes', () => {
    props.voteLookupStatus.alreadyVoted = ['delegate_1', 'delegate_3'];
    props.voteLookupStatus.notFound = ['delegate_2'];

    wrapper = mount(<VoteUrlProcessor {...props} />);

    expect(wrapper.find('.alreadyVoted-message .votesContainer').text()).toEqual('delegate_1delegate_3');
    expect(wrapper.find('.notFound-message .votesContainer').text()).toEqual('delegate_2');
  });
});
