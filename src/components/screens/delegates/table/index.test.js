import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { getTotalVotesCount } from '../../../../utils/voting';
import * as votingActions from '../../../../actions/voting';
import DelegatesTable from './index';
import delegates from '../../../../../test/constants/delegates';

const mockStore = {
  network: {
    networks: {
      LSK: { apiVersion: '2' },
    },
  },
  voting: { votes: {} },
};
const fakeStore = configureStore()(mockStore);

votingActions.loadDelegates = jest.fn()
  .mockImplementation(() => new Promise(resolve => resolve({ data: delegates })));

describe('DelegatesTable page', () => {
  const mountWithProps = props =>
    mount(<Provider store={fakeStore}><DelegatesTable {...props} /></Provider>);

  const defaultProps = {
    t: key => key,
    votingModeEnabled: false,
    isSignedIn: true,
  };

  it('renders DelegatesTable with header tabs', () => {
    const wrapper = mountWithProps(defaultProps);
    expect(wrapper.find('header')).toIncludeText('All delegates');
    expect(wrapper.find('header')).toIncludeText('Voted');
    expect(wrapper.find('header')).toIncludeText('Not voted');
  });

  it.only('renders table with delegates', (done) => {
    const wrapper = mountWithProps(defaultProps);
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find('.delegate-row')).toHaveLength(delegates.length);
      done();
    });
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
