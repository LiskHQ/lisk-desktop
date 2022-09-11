import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import wallets from '@tests/constants/wallets';
import { client } from '@libs/wcm/utils/connectionCreator';
import { EVENTS } from '../constants/lifeCycle';
import * as sessionHandlers from '../utils/sessionHandlers';
import useSession from './useSession';

const setSession = jest.fn();
const setPairings = jest.fn();
const session = { id: '0x123' };
const pairings = [];
const selectedAccounts = [wallets.genesis.summary.address, wallets.delegate.summary.address];

jest.spyOn(React, 'useContext').mockImplementation(() => ({
  events: [{ name: EVENTS.SESSION_PROPOSAL, meta: { id: '0x123' } }],
  session: { data: false, request: false, loaded: false },
  setSession,
  setPairings,
  pairings: [],
}));

jest.mock('@walletconnect/utils', () => ({
  getSdkError: jest.fn(str => str),
}));

jest.mock('@libs/wcm/utils/connectionCreator', () => ({
  client: {
    session: {
      keys: [session.id],
      get: jest.fn().mockReturnValue(session),
    },
    pairing: {
      getAll: jest.fn().mockReturnValue(pairings),
    },
  },
}));

jest.mock('../utils/sessionHandlers', () => ({
  onApprove: jest.fn().mockReturnValue({ status: 'success' }),
  onReject: jest.fn(),
}));

describe('useSession', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should get the latest session when mounted', () => {
    renderHook(() => useSession());
    expect(client.session.get).toHaveBeenCalledWith(session.id);
  });

  it('Should call sessionHandlers.onApprove with correct params if approve is called', () => {
    const { result } = renderHook(() => useSession());
    const { approve } = result.current;
    approve(selectedAccounts);

    expect(sessionHandlers.onApprove).toHaveBeenCalledWith(session, selectedAccounts);
  });

  it('Should call onReject with correct params', () => {
    const { result } = renderHook(() => useSession());
    const { reject } = result.current;
    reject();

    expect(sessionHandlers.onReject).toHaveBeenCalledWith(session);
  });
});
