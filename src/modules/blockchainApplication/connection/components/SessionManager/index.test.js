import React from 'react';
import { mountWithRouter } from 'src/utils/testHelpers';
import { useSession } from '@libs/wcm/hooks/useSession';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import ConnectionContext from '@libs/wcm/context/connectionContext';
import SessionManager from './index';

jest.mock('src/utils/searchParams', () => ({
  addSearchParamsToUrl: jest.fn(),
}));
jest.mock('@libs/wcm/hooks/useSession');
jest.mock('@account/hooks', () => ({
  useAccounts: jest.fn().mockImplementation(() => ({
    accounts: [{ metadata: { address: 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt' } }],
  })),
}));

jest.mock('@walletconnect/utils', () => ({
  getSdkError: jest.fn((str) => str),
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
  useSession.mockReturnValue({
    approve,
    reject,
    disconnect,
    hasLoaded: true,
    sessions: [
      {
        topic: '0x123',
        expiry: 1598424880,
        peer: {
          metadata: {
            name: 'Proposer name',
          },
        },
      },
    ],
  });

  it('Displays a button to add a new connection', () => {
    const wrapper = setup();
    expect(wrapper.find('.add-button')).toExist();
    wrapper.find('.add-button button').simulate('click');
    expect(addSearchParamsToUrl).toHaveBeenCalled();
  });

  it('Displays a list of connections', () => {
    const wrapper = setup();
    expect(wrapper.find('.connection')).toHaveLength(1);
  });

  it('Enables users to disconnect', () => {
    const wrapper = setup();
    wrapper.find('.connection').at(0).find('button').simulate('click');
    expect(disconnect).toHaveBeenCalled();
  });
});
