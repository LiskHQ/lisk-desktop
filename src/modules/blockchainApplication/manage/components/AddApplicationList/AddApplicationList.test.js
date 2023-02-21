import { screen, fireEvent } from '@testing-library/react';
import { renderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import mockApplications from '@tests/fixtures/blockchainApplicationsExplore';
import { useBlockchainApplicationExplore } from '@blockchainApplication/explore/hooks/queries/useBlockchainApplicationExplore';
import AddApplicationList from './AddApplicationList';

const props = {
  liskApplications: {
    data: mockApplications,
    loadData: jest.fn(),
  },
  externalApplications: { data: [] },
  applyFilters: jest.fn(),
  filters: { search: '' },
};
const mockFetchNextPage = jest.fn();

const mockExternalApplication = {
  chainName: 'External test app',
  chainID: 'ij239sksf5u4jdq8szo3nfmt',
  state: 'active',
  address: 'lsk24cd35u4jdq8ssd03nfmte5dsxwrnazyqqqg5eu',
  lastCertificateHeight: 400,
  lastUpdated: 123456789,
  depositedLsk: 820000000,
};

jest.mock('@blockchainApplication/explore/hooks/queries/useBlockchainApplicationExplore');
const [app1, app2] = mockApplications;
useBlockchainApplicationExplore.mockReturnValue({
  data: {
    data: [
      { ...app1, name: 'Test app 1' },
      { ...app2, name: 'Test app 2' },
    ],
  },
  isLoading: false,
  isFetching: false,
  hasNextPage: false,
  fetchNextPage: mockFetchNextPage,
});

describe('AddApplicationList', () => {
  it('displays properly', () => {
    renderWithRouterAndQueryClient(AddApplicationList);

    expect(screen.getByText('Add Application')).toBeTruthy();
    expect(screen.getByPlaceholderText('Search by name or application URL')).toBeTruthy();
    
    expect(screen.getByText('Test app 2')).toBeTruthy();
    expect(screen.getByText('5 LSK')).toBeTruthy();

    expect(screen.getByText('Test app 2')).toBeTruthy();
    expect(screen.getByText('0.5 LSK')).toBeTruthy();
  });

  // skipping this test for now because it hasn't be implemented
  it.skip('displays external applications if search by application node is used', () => {
    const newProps = {
      ...props,
      externalApplications: {
        data: [mockExternalApplication],
      },
    };
    renderWithRouterAndQueryClient(AddApplicationList, newProps);

    expect(screen.getByText('External test app')).toBeTruthy();
    expect(screen.getByText('8.2 LSK')).toBeTruthy();
  });
});
