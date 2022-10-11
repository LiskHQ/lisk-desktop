import { screen, fireEvent } from '@testing-library/react';
import { renderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import { mockBlockchainApp } from 'src/modules/blockchainApplication/explore/__fixtures__';
import useApplicationsQuery from 'src/modules/blockchainApplication/explore/hooks/queries/useApplicationsQuery';
import AddApplicationList from './AddApplicationList';

const props = {
  applyFilters: jest.fn(),
  filters: { search: '' },
};

const mockFetchNextPage = jest.fn()

jest.mock('src/modules/blockchainApplication/explore/hooks/queries/useApplicationsQuery');

useApplicationsQuery.mockReturnValue({
  data: {
    data: mockBlockchainApp.data,
    meta: {
      count: 1,
      offset: 20,
      total: 100,
    },
  },
  fetchNextPage: mockFetchNextPage,
});

describe('AddApplicationList', () => {
  it('displays properly', () => {
    renderWithRouterAndQueryClient(AddApplicationList, props);

    expect(screen.getByText('Add Application')).toBeTruthy();
    expect(screen.getByPlaceholderText('Search by name or application URL')).toBeTruthy();
    expect(screen.getByText('Test app')).toBeTruthy();
  });

  it('can load more applications', () => {

    renderWithRouterAndQueryClient(AddApplicationList, props);
    fireEvent.click(screen.getByText('Load more'));
    expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
    expect(mockFetchNextPage).toHaveBeenCalled();
  });
});
