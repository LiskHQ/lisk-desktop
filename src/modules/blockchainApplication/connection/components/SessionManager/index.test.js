import React from 'react';
import { mountWithRouter } from 'src/utils/testHelpers';
import { usePairings } from '@libs/wcm/hooks/usePairings';
import { useSession } from '@libs/wcm/hooks/useSession';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import { EVENTS } from '@libs/wcm/constants/lifeCycle';
import ConnectionContext from '@libs/wcm/context/connectionContext';
import SessionManager from './index';

const proposal = {
  params: {
    proposer: {
      metadata: {
        name: 'Proposer name',
        url: 'http://example.com',
        icons: ['http://example.com/icon.png'],
      },
    },
    requiredNamespaces: {
      lisk: {
        chains: ['lsk:1'],
        events: ['sign_transaction'],
        methods: ['receive_token'],
      },
    },
    pairingTopic: '0x123',
  },
};
const defaultContext = {
  events: [{ name: EVENTS.SESSION_PROPOSAL, meta: proposal }],
  pairings: [
    { loaded: true },
    {
      topic: '0x123',
      expiry: 1598424880,
      peerMetadata: {
        name: 'Proposer name',
      },
    },
  ],
};

jest.mock('src/utils/searchParams', () => ({
  addSearchParamsToUrl: jest.fn(),
}));
jest.mock('@libs/wcm/hooks/usePairings');
jest.mock('@libs/wcm/hooks/useSession');
jest.mock('@account/hooks', () => ({
  useAccounts: jest.fn().mockImplementation(() => ({
    accounts: [{ metadata: { address: 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt' } }],
  })),
}));

jest.mock('@walletconnect/utils', () => ({
  getSdkError: jest.fn((str) => str),
}));

jest.spyOn(React, 'useContext').mockImplementation(() => ({
  events: [{ name: EVENTS.SESSION_PROPOSAL, meta: { id: '1' } }],
}));

jest.mock('@libs/wcm/utils/connectionCreator', () => ({
  createSignClient: jest.fn(() => Promise.resolve()),
  client: {
    pair: jest.fn(),
  },
}));

const setup = (context) => {
  const Component = () => (
    <ConnectionContext.Provider value={context}>
      <SessionManager />
    </ConnectionContext.Provider>
  );
  return mountWithRouter(Component, {}, {});
};

describe('SessionManager', () => {
  const approve = jest.fn();
  const reject = jest.fn();
  const disconnect = jest.fn();
  const setUri = jest.fn();
  usePairings.mockReturnValue({
    setUri,
    disconnect,
    pairings: defaultContext.pairings,
  });
  useSession.mockReturnValue({ approve, reject });

  it('Displays a button to add a new connection', () => {
    const wrapper = setup(defaultContext);
    expect(wrapper.find('.add-button')).toExist();
    wrapper.find('.add-button button').simulate('click');
    expect(addSearchParamsToUrl).toHaveBeenCalled();
  });

  it('Displays a list of connections', () => {
    const wrapper = setup(defaultContext);
    expect(wrapper.find('.connection')).toHaveLength(defaultContext.pairings.length - 1);
  });

  it('Enables users to disconnect', () => {
    const wrapper = setup(defaultContext);
    wrapper.find('.connection').at(0).find('button').simulate('click');
    expect(disconnect).toHaveBeenCalled();
  });
});
