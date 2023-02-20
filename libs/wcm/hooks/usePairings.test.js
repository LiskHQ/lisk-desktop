import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { client } from '@libs/wcm/utils/connectionCreator';
import { usePairings } from './usePairings';

const setPairings = jest.fn();
const defaultPairings = [{ topic: '0x123' }, { topic: '0x456' }];
const loaded = { loaded: true };

jest.spyOn(React, 'useContext');

jest.mock('@walletconnect/utils', () => ({
  getSdkError: jest.fn(str => str),
}));

jest.mock('../utils/connectionCreator', () => ({
  client: {
    approve: jest.fn().mockImplementation(() => Promise.resolve({
      acknowledged: jest.fn(),
    })),
    pair: jest.fn(),
    disconnect: jest.fn(),
    pairing: {
      getAll: jest.fn().mockReturnValue(defaultPairings),
    },
  },
}));

describe('usePairings', () => {
  describe('On mount time', () => {
    it('Should get all active pairings once mounted', () => {
      React.useContext.mockImplementation(() => ({
        setPairings,
        pairings: [],
      }));
      renderHook(() => usePairings());
      expect(client.pairing.getAll).toHaveBeenCalledWith({ active: true });
    });
  });

  describe('During the lifetime', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    beforeEach(() => {
      React.useContext.mockImplementation(() => ({
        setPairings,
        pairings: [loaded, ...defaultPairings],
      }));
    });

    it('Should remove pairings if removePairing si called', () => {
      const { result } = renderHook(() => usePairings());
      const { removePairing } = result.current;
      removePairing(defaultPairings[0].topic);
      expect(setPairings).toHaveBeenCalledWith([loaded, defaultPairings[1]]);
    });

    it('Should call client.pair if a URI is provided with setUri method', () => {
      const { result } = renderHook(() => usePairings());
      const { setUri } = result.current;
      const uri = 'wc:0x123';
      setUri(uri);
      expect(client.pair).toHaveBeenCalledWith({ uri });
    });

    it('Should push new pairing if addPairing is called', () => {
      const { result } = renderHook(() => usePairings());
      const { addPairing } = result.current;
      const pairing = { topic: '0x123' };
      addPairing(pairing);
      expect(setPairings).toHaveBeenCalledWith([loaded, ...defaultPairings, pairing]);
    });

    it('Should call client.disconnect if disconnect is called', () => {
      const { result } = renderHook(() => usePairings());
      const { disconnect } = result.current;
      const topic = defaultPairings[0].topic;
      disconnect(topic);
      expect(setPairings).toHaveBeenCalledWith([loaded, defaultPairings[1]]);
      expect(client.disconnect).toHaveBeenCalled();
    });

    it('Should fetch pairings if refreshPairings is called', () => {
      const { result } = renderHook(() => usePairings());
      const { refreshPairings } = result.current;
      refreshPairings();
      expect(client.pairing.getAll).toHaveBeenCalledWith({ active: true });
      expect(setPairings).toHaveBeenCalledWith([loaded, ...defaultPairings]);
    });
  });
});
