import React from 'react';
import { shallow } from 'enzyme';
import Network from './index';
import { mockPeers, mockNetworkStatistics } from '../../__fixtures__';
import { usePeers, useNetworkStatistics } from '../../hooks/queries';

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: jest.fn().mockReturnValue({ t: jest.fn().mockImplementation((key) => key) }),
}));

jest.mock('../../hooks/queries');

describe('Network view', () => {
  it('Renders to component correctly', () => {
    usePeers.mockReturnValue({
      data: mockPeers,
      isLoading: false,
      isFetching: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
    });
    useNetworkStatistics.mockReturnValue({
      data: mockNetworkStatistics,
    });

    const wrapper = shallow(<Network />);

    const html = wrapper.html();
    expect(html).toContain('Network statistics');
    expect(html).toContain('Connected peers');
    expect(html).toContain('map-box');
    expect(html).toContain('peers-box');
  });
});
