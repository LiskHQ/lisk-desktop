import React from 'react';
import { mountWithRouter } from 'src/utils/testHelpers';
import usePairings from '@libs/wcm/hooks/usePairings';
import useSession from '@libs/wcm/hooks/useSession';
import { EVENTS } from '@libs/wcm/constants/lifeCycle';
import ConnectionContext from '@libs/wcm/context/connectionContext';
import RequestView from './index';

jest.mock('@libs/wcm/hooks/usePairings');
jest.mock('@libs/wcm/hooks/useSession');
jest.mock('@account/hooks', () => ({
  useAccounts: jest.fn().mockImplementation(() => ({
    accounts: [{ metadata: { address: 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt' } }],
  })),
}));

jest.mock('@walletconnect/utils', () => ({
  getSdkError: jest.fn(str => str),
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

jest.mock('@transaction/api');
const setup = (context) => {
  const Component = () => (
    <ConnectionContext.Provider value={context}>
      <RequestView />
    </ConnectionContext.Provider>
  );

  return mountWithRouter(Component, {}, {});
};

const context = {
  events: [{
    name: EVENTS.SESSION_REQUEST,
    meta: {
      params: {
        chainId: 'lisk:2',
        request: {
          params: {
            rawTx: {},
          },
        },
      },
    },
  }],
  session: {
    request: {
      peer: {
        metadata: {
          icons: ['http://example.com/icon.png'],
          name: 'test app',
          url: 'http://example.com',
        },
      },
    },
  },
};

describe('RequestView', () => {
  const reject = jest.fn();
  usePairings.mockReturnValue({ setUri: jest.fn() });
  useSession.mockReturnValue({ reject, session: context.session });

  it('should render properly getting data from URL', () => {
    const wrapper = setup(context);
    expect(wrapper).toContainMatchingElement('Dialog');
    expect(wrapper).toContainMatchingElement('MultiStep');
    expect(wrapper).toContainMatchingElement('RequestSummary');
    expect(wrapper).not.toContainMatchingElement('SendSummary');
    expect(wrapper).not.toContainMatchingElement('SendStatus');
  });
});
