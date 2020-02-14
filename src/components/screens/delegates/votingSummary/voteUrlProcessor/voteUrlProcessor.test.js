import React from 'react';
import { mount } from 'enzyme';
import VoteUrlProcessor from './voteUrlProcessor';
import accounts from '../../../../../../test/constants/accounts';
import * as delegateApi from '../../../../../utils/api/delegates';
import routes from '../../../../../constants/routes';
import votes from '../../../../../../test/constants/votes';

jest.mock('../../../../../utils/api/delegates');

describe('VoteUrlProcessor', () => {
  let wrapper;
  let props;
  let unlistenSpy;

  beforeEach(() => {
    const account = accounts.delegate;
    const location = {
      search: '',
      pathname: routes.votingSummary.path,
    };

    unlistenSpy = jest.fn();

    props = {
      account,
      delegates: [],
      loadVotes: jest.fn(({ callback }) => callback(votes.slice(0, 3))),
      delegatesLoaded: jest.fn(({ callback }) => callback()),
      voteToggled: jest.fn(),
      history: {
        location,
        listen: (callback) => {
          callback(location);
          return unlistenSpy;
        },
        push: () => {},
      },
      t: key => key,
    };
  });

  afterEach(() => {
    delegateApi.getDelegateByName.mockReset();
  });

  it('removes history listener on unmount', () => {
    wrapper = mount(<VoteUrlProcessor {...props} />);
    expect(unlistenSpy).not.toHaveBeenCalled();
    wrapper.unmount();
    expect(unlistenSpy).toHaveBeenCalled();
  });

  it('calls props.loadVotes with account.address if URL contains ?votes=delegate_name', () => {
    wrapper = mount(<VoteUrlProcessor {...{
      ...props,
      history: {
        ...props.history,
        location: {
          search: `?votes=${votes[0].username}`,
        },
      },
    }}
    />);
    expect(props.loadVotes).toHaveBeenCalledWith(expect.objectContaining({
      address: props.account.address,
    }));
  });

  it('calls props.voteToggled if URL contains ?unvotes=delegate_name which was voted before', () => {
    wrapper = mount(<VoteUrlProcessor {...{
      ...props,
      history: {
        ...props.history,
        location: {
          search: `?unvotes=${votes[0].username}`,
        },
      },
    }}
    />);
    delegateApi.getDelegateByName.mockResolvedValue(votes[0]);
    expect(props.voteToggled).toHaveBeenCalledWith(expect.objectContaining({
      username: votes[0].username,
    }));
  });
});
