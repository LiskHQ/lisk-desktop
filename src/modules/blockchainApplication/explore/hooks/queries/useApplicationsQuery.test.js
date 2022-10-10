import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import configureMockStore from 'redux-mock-store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';

import { mockBlockchainApp } from '../../__fixtures__';
import useApplicationsQuery from './useApplicationsQuery';

const mockState = {
  blockchainApplications: {
    current: mockBlockchainApp[0],
    pins: [],
  },
};

const queryClient = new QueryClient();
const mockStore = configureMockStore();

const ReduxProvider = ({ children, reduxStore }) => (
  <Provider store={reduxStore}>{children}</Provider>
);

describe('useApplicationsQuery hook', () => {
  it('should fetch data correctly', async () => {
    const store = mockStore(mockState);
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <ReduxProvider reduxStore={store}>{children}</ReduxProvider>
      </QueryClientProvider>
    );
    const { result, waitFor } = renderHook(() => useApplicationsQuery(), { wrapper });

    await waitFor(() => result.current.isFetched);

    expect(result.current.isSuccess).toBeTruthy();

    const expectedResponse = {
      data: mockBlockchainApp,
      meta: {
        count: 20,
        offset: 0,
      },
    };

    expect(result.current.data).toEqual(expectedResponse);
  });
});
