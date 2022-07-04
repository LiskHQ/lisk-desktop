import React from 'react';
import { shallow } from 'enzyme';
import peers from '@tests/constants/peers';
import Network from './index';

describe('Network view', () => {
  const t = jest.fn().mockImplementation(str => str);

  it('Renders to component correctly', () => {
    const wrapper = shallow(
      <Network
        t={t}
        peers={{
          isLoading: true,
          data: peers,
          meta: {
            total: 2,
          },
          loadData: jest.fn(),
          clearData: jest.fn(),
          urlSearchParams: {},
        }}
      />,
    );

    const html = wrapper.html();
    expect(html).toContain('Network statistics');
    expect(html).toContain('Connected peers');
    expect(html).toContain('map-box');
    expect(html).toContain('peers-box');
  });
});
