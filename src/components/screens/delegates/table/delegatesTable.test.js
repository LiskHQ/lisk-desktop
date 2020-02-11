import React from 'react';
import { mount } from 'enzyme';
import * as reactRedux from 'react-redux';
import { getTotalVotesCount } from '../../../../utils/voting';
import DelegatesTable from './delegatesTable';
import accounts from '../../../../../test/constants/accounts';
import delegates from '../../../../../test/constants/delegates';
import store from '../../../../store';

const network = {
  network: {
    networks: {
      LSK: { apiVersion: '2' },
    },
  },
};

store.getState = jest.fn().mockImplementation(() => network);
reactRedux.useSelector = jest.fn().mockImplementation(() => network);

describe('DelegatesTable page', () => {
  const mountWithProps = props =>
    mount(<DelegatesTable {...props} />);

  const defaultProps = {
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
    account: accounts.genesis,
    votingModeEnabled: false,
  };

  it('renders DelegatesTable with header tabs', () => {
    const wrapper = mountWithProps(defaultProps);
    expect(wrapper.find('header')).toIncludeText('All delegates');
    expect(wrapper.find('header')).toIncludeText('Voted');
    expect(wrapper.find('header')).toIncludeText('Not voted');
  });

  it('renders table with delegates', () => {
    const wrapper = mountWithProps(defaultProps);
    expect(wrapper.find('.delegate-row')).toHaveLength(0);
    wrapper.setProps({ delegates });
    expect(wrapper.find('.delegate-row').hostNodes()).toHaveLength(delegates.length);
  });

  it('allows to switch to "Voted" tab', () => {
    const wrapper = mountWithProps({ ...defaultProps, delegates });
    expect(wrapper.find('.tab.voted')).not.toHaveClassName('active');
    wrapper.find('.tab.voted').simulate('click');
    expect(wrapper.find('.tab.voted')).toHaveClassName('active');
    expect(wrapper.find('.delegate-row').hostNodes()).toHaveLength(getTotalVotesCount(defaultProps.votes));
  });

  it('allows to switch to "Not voted" tab', () => {
    const wrapper = mountWithProps({ ...defaultProps, delegates });
    expect(wrapper.find('.tab.not-voted')).not.toHaveClassName('active');
    wrapper.find('.tab.not-voted').simulate('click');
    expect(wrapper.find('.tab.not-voted')).toHaveClassName('active');
    expect(wrapper.find('.delegate-row').hostNodes()).toHaveLength(delegates.length - getTotalVotesCount(defaultProps.votes));
  });

  it('allows to load more delegates', () => {
    const standByDelegates = delegates.filter((item, index) => index < 30);
    const wrapper = mountWithProps({ ...defaultProps, delegates: standByDelegates });
    wrapper.find('button.load-more').simulate('click');
    expect(defaultProps.loadDelegates).toHaveBeenCalledWith(
      expect.objectContaining({ offset: standByDelegates.length }),
    );
  });

  it('dose not show load more for active delegates', () => {
    const wrapper = mountWithProps(defaultProps);
    expect(wrapper.find('button.load-more')).toHaveLength(0);
  });

  it('allows to filter delegates by by name', () => {
    const { username } = delegates[0];
    const wrapper = mountWithProps({ ...defaultProps, delegates });
    wrapper.find('input.filter-by-name').simulate('change', { target: { value: username } });
    expect(defaultProps.loadDelegates).toHaveBeenCalledWith(
      expect.objectContaining({ q: username }),
    );
  });

  it('shows vote checkboxes if props.votingModeEnabled', () => {
    const wrapper = mountWithProps({ ...defaultProps, delegates, votes: {} });
    expect(wrapper.find('CheckBox')).toHaveLength(0);
    wrapper.setProps({ votingModeEnabled: true });
    expect(wrapper.find('CheckBox')).toHaveLength(delegates.length);
  });

  it('doesn\'t show tabs if not logged in', () => {
    const wrapper = mountWithProps({ ...defaultProps, account: {} });
    expect(wrapper.find('.tab')).toHaveLength(0);
    expect(wrapper.find('header h2')).toHaveText('All delegates');
  });
});
