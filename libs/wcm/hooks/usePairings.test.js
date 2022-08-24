import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { client } from '@libs/wcm/utils/connectionCreator';
import usePairings from './usePairings';

const setPairings = jest.fn();
const pairings = [{ topic: '0x123' }, { topic: '0x456' }];

jest.spyOn(React, 'useContext').mockImplementation(() => ({
  setPairings,
  pairings: [],
}));

jest.mock('@walletconnect/utils', () => ({
  getSdkError: jest.fn(str => str),
}));

jest.mock('@libs/wcm/utils/connectionCreator', () => ({
  client: {
    approve: jest.fn().mockImplementation(() => Promise.resolve({
      acknowledged: jest.fn(),
    })),
    pair: jest.fn(),
    disconnect: jest.fn(),
    pairings: {
      getAll: jest.fn().mockReturnValue(pairings),
    },
  },
}));

describe('usePairings', () => {
  it('Should get all active pairings once mounted', () => {
    renderHook(() => usePairings());
    expect(client.pairings.getAll).toHaveBeenCalledWith({ active: true });
  });

  it('Should remove pairings if removePairing si called', () => {
    const { result } = renderHook(() => usePairings());
    const { removePairing } = result.current;
    removePairing(pairings[0].topic);
    expect(setPairings).toHaveBeenCalledWith([pairings[1]]);
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
    expect(setPairings).toHaveBeenCalledWith([...pairings, pairing]);
  });

  it('Should call client.disconnect if disconnect is called', () => {
    const { result } = renderHook(() => usePairings());
    const { disconnect, removePairing } = result.current;
    const topic = '0x123';
    disconnect(topic);
    expect(removePairing).toHaveBeenCalled(topic);
    expect(client.disconnect).toHaveBeenCalled();
  });

  it('Should fetch pairings if refreshPairings is called', () => {
    const { result } = renderHook(() => usePairings());
    const { refreshPairings } = result.current;
    refreshPairings();
    expect(client.pairing.getAll).toHaveBeenCalledWith({ active: true });
    expect(setPairings).toHaveBeenCalledWith(pairings);
  });
});
