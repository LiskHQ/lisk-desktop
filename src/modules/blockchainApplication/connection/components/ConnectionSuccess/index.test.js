import React from 'react';
import { EVENTS } from '@libs/wcm/constants/lifeCycle';
import { mountWithRouter } from 'src/utils/testHelpers';
import * as params from 'src/utils/searchParams';
import ConnectionContext from '@libs/wcm/context/connectionContext';
import ConnectionSuccess from './index';

const proposal = {
  id: '1',
  params: {
    proposer: {
      metadata: {
        name: 'Proposer name',
      },
    },
  },
};

jest.mock('src/utils/searchParams', () => ({
  removeSearchParamsFromUrl: jest.fn(),
}));

jest.mock('@libs/wcm/utils/connectionCreator', () => ({
  createSignClient: jest.fn(() => Promise.resolve()),
  client: {
    pair: jest.fn(),
  },
}));

describe('ConnectionSuccess', () => {
  const props = {
    history: { push: jest.fn() },
  };

  it('Shows a message if events are not ready yet', () => {
    const wrapper = mountWithRouter(ConnectionSuccess, {}, {});
    expect(wrapper.find('div').text()).toEqual('Events are not ready yet.');
  });

  it('Should mount correctly', () => {
    const Component = () => (
      <ConnectionContext.Provider value={{
        events: [{ name: EVENTS.SESSION_PROPOSAL, meta: proposal }],
      }}
      >
        <ConnectionSuccess />
      </ConnectionContext.Provider>
    );
    const wrapper = mountWithRouter(Component, props, { search: '?status=SUCCESS' });

    expect(wrapper.find('h3').text()).toBe('Proposer name');
    expect(wrapper.find('h6').text()).toBe('Connection successful!');

    jest.runAllTimers();
    expect(params.removeSearchParamsFromUrl).toHaveBeenCalled();
  });
});
