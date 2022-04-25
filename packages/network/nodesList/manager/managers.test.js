import React from 'react';
import { mount, shallow } from 'enzyme';
import peers from '@tests/constants/peers';
import NodeList from './manager';

describe('Network Monitor Page', () => {
  const loadData = jest.fn();
  const clearData = jest.fn();
  const urlSearchParams = {};
  const emptyPeers = {
    isLoading: false,
    data: [],
    loadData,
    clearData,
    urlSearchParams,
  };
  const fullPeers = {
    isLoading: false,
    data: peers,
    meta: { total: peers.length },
    loadData,
    clearData,
    urlSearchParams,
  };
  const t = key => key;
  const lodingProps = {
    t,
    peers: {
      isLoading: true,
      data: [],
      meta: {},
      loadData,
      clearData,
      urlSearchParams,
    },
  };
  it('renders the empty state if no peers passed', () => {
    const wrapper = mount(<NodeList {...{ t, peers: emptyPeers }} />);
    expect(wrapper.find('.empty-state')).toHaveLength(1);
  });

  it('shows loading overlay while the API call is being processed', () => {
    const wrapper = shallow(<NodeList {...lodingProps} />);
    expect(wrapper.html().match(/loadingOverlay/)).toHaveLength(1);
  });

  it('renders 20 peers', () => {
    const wrapper = shallow(<NodeList {...{ t, peers: fullPeers }} />);
    expect(wrapper.html().match(/peer-row/gm)).toHaveLength(20);
  });
});
