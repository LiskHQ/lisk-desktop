import React from 'react';
import { Router } from 'react-router';
import { fireEvent, screen } from '@testing-library/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { usePinBlockchainApplication } from '@blockchainApplication/manage/hooks/usePinBlockchainApplication';
import { renderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import { useBlockchainApplicationExplore } from '../../hooks/queries/useBlockchainApplicationExplore';
import { mockBlockchainApp } from '../../__fixtures__';
import BlockchainApplicationList from './BlockchainApplicationList';

const mockTogglePin = jest.fn();
const mockedPins = [mockBlockchainApp.data[0].chainID];
const mockApplyFilters = jest.fn();

jest.useFakeTimers();
jest.mock('@blockchainApplication/manage/hooks/usePinBlockchainApplication');
jest.mock('../../hooks/queries/useBlockchainApplicationExplore');
jest.mock('@common/hooks', () => ({
  ...jest.requireActual('@common/hooks'),
  useFilter: jest.fn(() => ({
    // filters: {},
    applyFilters: mockApplyFilters,
  })),
}));

usePinBlockchainApplication.mockReturnValue({
  togglePin: mockTogglePin,
  pins: mockedPins,
  checkPinByChainId: jest.fn().mockReturnValue(true),
});

useBlockchainApplicationExplore.mockReturnValue({
  data: mockBlockchainApp,
  error: undefined,
  isLoading: false,
  isFetching: false,
});

describe('BlockchainApplicationList', () => {
  let wrapper;
  const props = {
    history: {
      listen: () => {},
      location: { pathname: '' },
    },
  };

  beforeEach(() => {
    wrapper = renderWithRouterAndQueryClient(BlockchainApplicationList, props);
  });

  it('should display properly', () => {
    expect(screen.getByText('Name')).toBeTruthy();
    expect(screen.getByText('Chain ID')).toBeTruthy();
    expect(screen.getByText('Status')).toBeTruthy();
    expect(screen.getByText('LSK deposited')).toBeTruthy();
    expect(screen.getByText('Applications')).toBeTruthy();
  });

  it('should display the right number of applications', () => {
    const blockchainAppRow = screen.getAllByTestId('applications-row');
    expect(blockchainAppRow).toHaveLength(mockBlockchainApp.length);
  });

  it('should apply search filter', () => {
    const searchField = screen.getByTestId('application-filter');
    fireEvent.change(searchField, { target: { value: 'test' } });
    jest.runAllTimers();

    expect(mockApplyFilters).toHaveBeenCalledWith(
      expect.objectContaining({
        search: 'test',
        offset: 0,
      })
    );
  });

  it('should call the toggle function for the particular blockchain application been toggled', () => {
    const { chainID } = mockBlockchainApp.data[0];

    fireEvent.click(screen.getAllByTestId('pin-button')[0]);
    expect(mockTogglePin).toHaveBeenCalledWith(chainID);
  });

  it('should invoke the load more action', () => {
    props.applications.isLoading = false;
    props.applications.meta = {
      total: mockBlockchainApp.length + 1,
      count: mockBlockchainApp.length,
      offset: 0,
    };

    wrapper = renderWithRouterAndQueryClient(BlockchainApplicationList, props);
    fireEvent.click(screen.getByText('Load more'));
    expect(props.applications.loadData).toHaveBeenCalledWith(
      expect.objectContaining({
        offset: props.applications.meta.count + props.applications.meta.offset,
      })
    );
  });

  it('should not have any pinned application', () => {
    usePinBlockchainApplication.mockReturnValue({
      togglePin: mockTogglePin,
      pins: [],
      checkPinByChainId: jest.fn().mockReturnValue(false),
    });

    const queryClient = new QueryClient();
    wrapper.rerender(
      <QueryClientProvider client={queryClient}>
        <Router history={props.history}>
          <BlockchainApplicationList {...props} />
        </Router>
      </QueryClientProvider>
    );

    expect(screen.getAllByAltText('unpinnedIcon')).toHaveLength(mockBlockchainApp.length);
  });
});
