import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useSession } from '../hooks/useSession';
import ConnectionProvider from './connectionProvider';

jest.mock('@walletconnect/utils', () => ({
  getSdkError: jest.fn((str) => str),
}));

jest.mock('@walletconnect/sign-client', () => ({
  init: jest.fn().mockResolvedValue(Promise.resolve({ mock: true })),
}));

it('should use custom step when incrementing', () => {
  const wrapper = ({ children }) => <ConnectionProvider>{children}</ConnectionProvider>;
  const { result } = renderHook(() => useSession(), { wrapper });

  expect(result.current.sessions).toEqual([]);

  act(() => {
    result.current.setSessions([{ id: '0x123' }]);
  });

  expect(result.current.sessions).toEqual([{ id: '0x123' }]);
});
