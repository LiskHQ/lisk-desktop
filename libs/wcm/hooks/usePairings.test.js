import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { usePairings } from './usePairings';

const setPairings = jest.fn();
const defaultPairings = [{ topic: '0x123' }, { topic: '0x124' }];

jest.mock('@walletconnect/utils', () => ({
  getSdkError: jest.fn((str) => str),
}));

jest.spyOn(React, 'useContext');

describe('usePairings', () => {
  const signClient = {
    approve: jest.fn().mockImplementation(() =>
      Promise.resolve({
        acknowledged: jest.fn(),
      })
    ),
    core: {
      pairing: {
        pair: jest.fn(),
      },
    },
    pairing: {
      getAll: jest.fn().mockReturnValue(defaultPairings),
    },
  };

  describe('On mount time', () => {
    React.useContext.mockReturnValue({
      pairings: [],
      setPairings: (...rest) => setPairings(...rest),
      signClient,
    });

    it('Should get all active pairings once mounted', () => {
      renderHook(() => usePairings());
      expect(signClient.pairing.getAll).toHaveBeenCalledWith({ active: true });
    });
  });

  describe('During the lifetime', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      React.useContext.mockReturnValue({
        pairings: defaultPairings,
        setPairings: (...rest) => setPairings(...rest),
        signClient,
      });
    });

    it('Should remove pairings if removePairing is called', () => {
      const { result } = renderHook(() => usePairings());
      const { removePairing } = result.current;

      act(() => {
        removePairing(defaultPairings[0].topic);
      });
      expect(setPairings).toHaveBeenCalled();
    });

    it('Should call signClient.pair if a URI is provided with setUri method', () => {
      const { result } = renderHook(() => usePairings());
      const { setUri } = result.current;
      const uri = 'wc:0x123';
      setUri(uri);
      expect(signClient.core.pairing.pair).toHaveBeenCalledWith({ uri });
    });

    it('Should push new pairing if addPairing is called', () => {
      const { result } = renderHook(() => usePairings());
      const pairing = { topic: '0x125' };
      act(() => {
        result.current.addPairing(pairing);
      });
      expect(setPairings).toHaveBeenCalled();
    });

    it('Should fetch pairings if refreshPairings is called', () => {
      const { result } = renderHook(() => usePairings());
      const { refreshPairings } = result.current;
      act(() => {
        refreshPairings();
      });
      expect(signClient.pairing.getAll).toHaveBeenCalledWith({ active: true });
      expect(result.current.pairings).toEqual(defaultPairings);
    });
  });
});
