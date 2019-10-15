import React from 'react';
import { mount } from 'enzyme';
import { getTotalVotesCount } from '../../../../utils/voting';
import DelegatesTable from './delegatesTable';
import accounts from '../../../../../test/constants/accounts';
import delegates from '../../../../../test/constants/delegates';

describe('DelegatesTable page', () => {
  let props;

  beforeEach(() => {
    props = {
      t: key => key,
      delegates: [],
      loadDelegates: jest.fn(({ callback }) => callback()),
      votes: {
        [delegates[0].username]: {
          confirmed: true,
          unconfirmed: true,
          address: delegates[0].address,
        },
      },
      loadVotes: jest.fn(),
      voteToggled: jest.fn(),
      account: accounts.genesis,
    };
  });

  it('renders DelegatesTable with header tabs', () => {
    const wrapper = mount(<DelegatesTable {...props} />);
    expect(wrapper.find('header')).toIncludeText('All delegates');
    expect(wrapper.find('header')).toIncludeText('Voted');
    expect(wrapper.find('header')).toIncludeText('Not voted');
  });

  it('renders table with delegates', () => {
    const wrapper = mount(<DelegatesTable {...props} />);
    expect(wrapper.find('.delegate-row')).toHaveLength(0);
    wrapper.setProps({ delegates });
    expect(wrapper.find('.delegate-row').hostNodes()).toHaveLength(delegates.length);
  });

  it('allows to switch to "Voted" tab', () => {
    const wrapper = mount(<DelegatesTable {...{ ...props, delegates }} />);
    expect(wrapper.find('.tab.voted')).not.toHaveClassName('active');
    wrapper.find('.tab.voted').simulate('click');
    expect(wrapper.find('.tab.voted')).toHaveClassName('active');
    expect(wrapper.find('.delegate-row').hostNodes()).toHaveLength(getTotalVotesCount(props.votes));
  });

  it('allows to switch to "Not voted" tab', () => {
    const wrapper = mount(<DelegatesTable {...{ ...props, delegates }} />);
    expect(wrapper.find('.tab.not-voted')).not.toHaveClassName('active');
    wrapper.find('.tab.not-voted').simulate('click');
    expect(wrapper.find('.tab.not-voted')).toHaveClassName('active');
    expect(wrapper.find('.delegate-row').hostNodes()).toHaveLength(delegates.length - getTotalVotesCount(props.votes));
  });

  it('allows to load more delegates', () => {
    const wrapper = mount(<DelegatesTable {...{ ...props, delegates }} />);
    wrapper.find('button.loadMore').simulate('click');
    expect(props.loadDelegates).toHaveBeenCalledWith(
      expect.objectContaining({ offset: delegates.length }),
    );
  });

  it('allows to filter delegates by by name', () => {
    const { username } = delegates[0];
    const wrapper = mount(<DelegatesTable {...{ ...props, delegates }} />);
    wrapper.find('input.filter-by-name').simulate('change', { target: { value: username } });
    expect(props.loadDelegates).toHaveBeenCalledWith(
      expect.objectContaining({ q: username }),
    );
  });

  it('shows vote checkboxes if props.votingModeEnabled', () => {
    const wrapper = mount(<DelegatesTable {...{ ...props, delegates, votes: {} }} />);
    expect(wrapper.find('CheckBox')).toHaveLength(0);
    wrapper.setProps({ votingModeEnabled: true });
    expect(wrapper.find('CheckBox')).toHaveLength(delegates.length);
  });
});
