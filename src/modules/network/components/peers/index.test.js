import React from 'react';
import { mount, shallow } from 'enzyme';
import Peers from '.';
import { mockPeers } from '../../__fixtures__';
import { usePeers } from '../../hooks/queries';

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: jest.fn().mockReturnValue({ t: jest.fn().mockImplementation(key => key) }),
}));

jest.mock('../../hooks/queries');

describe('Network Monitor: Peers', () => {
  const mockFetchNextPage = jest.fn();

  const emptyPeers = {
    data: [],
    isLoading: false,
    isFetching: false,
    hasNextPage: false,
    fetchNextPage: mockFetchNextPage,
  };

  const fullPeers = {
    ...emptyPeers,
    data: mockPeers,
  };

  const lodingProps = {
    ...emptyPeers,
    isLoading: true,
    isFetching: true,
  };

  it('renders the empty state if no peers passed', async () => {
    usePeers.mockReturnValue(emptyPeers);

    const wrapper = mount(<Peers />);
    expect(wrapper.find('.empty-state')).toHaveLength(1);
  });

  it('shows loading overlay while the API call is being processed', () => {
    usePeers.mockReturnValue(lodingProps);

    const wrapper = shallow(<Peers />);
    expect(wrapper.html().match(/loadingOverlay/)).toHaveLength(1);
  });

  it('renders 20 peers', () => {
    usePeers.mockReturnValue(fullPeers);

    const wrapper = shallow(<Peers />);
    expect(wrapper.html().match(/peer-row/gm)).toHaveLength(20);
  });
});
