import React from 'react';
import { mount, shallow } from 'enzyme';
import peers from '@tests/constants/peers';
import Peers from '.';

describe('Network Monitor: Peers', () => {
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
    const wrapper = mount(<Peers {...{ t, peers: emptyPeers }} />);
    expect(wrapper.find('.empty-state')).toHaveLength(1);
  });

  it('shows loading overlay while the API call is being processed', () => {
    const wrapper = shallow(<Peers {...lodingProps} />);
    expect(wrapper.html().match(/loadingOverlay/)).toHaveLength(1);
  });

  it('renders 20 peers', () => {
    const wrapper = shallow(<Peers {...{ t, peers: fullPeers }} />);
    expect(wrapper.html().match(/peer-row/gm)).toHaveLength(20);
  });
});
