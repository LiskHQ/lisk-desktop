import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useSession } from '../hooks/useSession';
import ConnectionProvider from './connectionProvider';

jest.mock('@walletconnect/utils', () => ({
  getSdkError: jest.fn(str => str),
}));

jest.mock('@walletconnect/sign-client', () => ({
  init: jest.fn().mockResolvedValue(Promise.resolve({ mock: true })),
}));

it('should use custom step when incrementing', () => {
  const wrapper = ({ children }) =>
    (<ConnectionProvider>{children}</ConnectionProvider>);
  const { result } = renderHook(() => useSession(), { wrapper });

  expect(result.current.session).toEqual({
    data: false,
    loaded: false,
    request: false,
  });

  act(() => {
    result.current.setSession({
      data: { id: '0x123' },
      loaded: true,
      request: false,
    });
  });

  expect(result.current.session).toEqual({
    data: { id: '0x123' },
    loaded: true,
    request: false,
  });
});
