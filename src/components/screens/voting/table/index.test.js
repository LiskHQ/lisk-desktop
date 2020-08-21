import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import * as votingActions from '../../../../actions/voting';
import DelegatesTable from './index';
import delegates from '../../../../../test/constants/delegates';

const mockStore = {
  network: {
    networks: {
      LSK: { apiVersion: '2' }, // @todo Remove?
    },
  },
  voting: {
    votes: {
      genesis_1: {
        confirmed: true,
        unconfirmed: true,
        pending: false,
        publicKey: '3ff32442bb6da7d60c1b7752b24e6467813c9b698e0f278d48c43580da9721',
        address: '14018336151296112011L',
      },
    },
  },
};
const fakeStore = configureStore()(mockStore);

const topDelegates = delegates.filter((item, index) => index < 30);

votingActions.loadDelegates = jest.fn()
  .mockImplementation(() => new Promise(resolve => resolve({ data: topDelegates })));

const updateWrapperAsync = async wrapper => new Promise((resolve) => {
  setImmediate(() => {
    resolve();
    wrapper.update();
  });
});

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

  it('renders table with delegates', async () => {
    const wrapper = mountWithProps(defaultProps);
    await updateWrapperAsync(wrapper);
    expect(wrapper.find('.delegate-row')).toHaveLength(topDelegates.length);
  });

  it('allows to switch to "Voted" tab', async () => {
    const wrapper = mountWithProps(defaultProps);
    await updateWrapperAsync(wrapper);
    expect(wrapper.find('.tab.voted')).not.toHaveClassName('active');
    wrapper.find('.tab.voted').simulate('click');
    await updateWrapperAsync(wrapper);
    expect(wrapper.find('.tab.voted')).toHaveClassName('active');
    expect(wrapper.find('.delegate-row').hostNodes()).toHaveLength(1);
  });

  it('allows to switch to "Not voted" tab', async () => {
    const wrapper = mountWithProps(defaultProps);
    await updateWrapperAsync(wrapper);
    expect(wrapper.find('.tab.not-voted')).not.toHaveClassName('active');
    wrapper.find('.tab.not-voted').simulate('click');
    await updateWrapperAsync(wrapper);
    expect(wrapper.find('.tab.not-voted')).toHaveClassName('active');
    expect(wrapper.find('.delegate-row').hostNodes()).toHaveLength(topDelegates.length - 1);
  });

  it('allows to load more delegates', async () => {
    const wrapper = mountWithProps(defaultProps);
    await updateWrapperAsync(wrapper);
    wrapper.find('.load-more').at(0).simulate('click');
    await updateWrapperAsync(wrapper);
    expect(votingActions.loadDelegates).toHaveBeenCalledWith(
      expect.objectContaining({ offset: topDelegates.length }),
    );
  });

  it('dose not show load more for active delegates', () => {
    const wrapper = mountWithProps(defaultProps);
    expect(wrapper.find('.load-more')).toHaveLength(0);
  });

  it('allows to filter delegates by by name', async () => {
    const { username } = delegates[0];
    const wrapper = mountWithProps(defaultProps);
    await updateWrapperAsync(wrapper);
    wrapper.find('input.filter-by-name').simulate('change', { target: { value: username } });
    await updateWrapperAsync(wrapper);
    expect(votingActions.loadDelegates).toHaveBeenCalledWith(
      expect.objectContaining({ q: username }),
    );
  });

  it('doesn\'t show tabs if not logged in', () => {
    const wrapper = mountWithProps({ ...defaultProps, isSignedIn: false });
    expect(wrapper.find('.tab')).toHaveLength(0);
    expect(wrapper.find('header h2')).toHaveText('All delegates');
  });
});
