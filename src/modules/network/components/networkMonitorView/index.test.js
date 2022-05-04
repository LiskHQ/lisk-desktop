import React from 'react';
import { mount } from 'enzyme';
import peers from '@tests/constants/peers';
import Network from './index';

describe('Network view', () => {
  const t = jest.fn().mockImplementation(str => str);

  it('Renders to component correctly', () => {
    const wrapper = mount(
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
    expect(wrapper.find('h1').at(0)).toHaveText('Network statistics');
    expect(wrapper.find('h1').at(1)).toHaveText('Connected peers');
    expect(wrapper.find('Statistics')).toHaveLength(1);
    expect(wrapper.find('NodeList')).toHaveLength(1);
  });
});
