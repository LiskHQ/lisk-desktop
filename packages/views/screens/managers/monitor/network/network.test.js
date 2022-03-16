import React from 'react';
import { mount, shallow } from 'enzyme';
import { NetworkPure } from './index';
import peers from '../../../../../test/constants/peers';

describe('Network Monitor Page', () => {
  const networkStatistics = {
    isLoading: false,
    data: {},
    loadData: jest.fn(),
    clearData: jest.fn(),
    urlSearchParams: {},
  };
  const setup = properties => mount(<NetworkPure {...properties} />);
  const emptyPeers = {
    isLoading: false,
    data: [],
    loadData: jest.fn(),
    clearData: jest.fn(),
    urlSearchParams: {},
  };
  const fullPeers = {
    isLoading: false,
    data: peers,
    meta: { total: peers.length },
    loadData: jest.fn(),
    clearData: jest.fn(),
    urlSearchParams: {},
  };
  const t = key => key;

  it('renders a page with header', () => {
    const wrapper = setup({ t, peers: emptyPeers, networkStatistics });
    expect(wrapper.find('.contentHeader')).toIncludeText('Connected peers');
  });

  it('renders the empty state if no peers passed', () => {
    const wrapper = shallow(<NetworkPure {...{ t, peers: emptyPeers, networkStatistics }} />);
    expect(wrapper.html().match(/empty-state/gm)).toHaveLength(4);
  });

  it('shows loading overlay while the API call is being processed', () => {
    const wrapper = shallow(
      <NetworkPure
        t={t}
        networkStatistics={networkStatistics}
        peers={{
          isLoading: true,
          data: peers,
          meta: {
            total: peers.length * 2,
          },
          loadData: jest.fn(),
          clearData: jest.fn(),
          urlSearchParams: {},
        }}
      />,
    );
    expect(wrapper.html().match(/loadingOverlay/gm)).toHaveLength(1);
  });

  it('renders 20 peers', () => {
    const wrapper = shallow(<NetworkPure {...{ t, peers: fullPeers, networkStatistics }} />);
    expect(wrapper.html().match(/peer-row/gm)).toHaveLength(20);
  });
});
