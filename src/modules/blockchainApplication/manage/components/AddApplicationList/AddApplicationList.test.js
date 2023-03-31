import { screen } from '@testing-library/react';
import { renderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import mockApplicationsExplore from '@tests/fixtures/blockchainApplicationsExplore';
import mockApplicationsManage from '@tests/fixtures/blockchainApplicationsManage';
import { useBlockchainApplicationExplore } from '@blockchainApplication/explore/hooks/queries/useBlockchainApplicationExplore';
import { useBlockchainApplicationMeta } from '../../hooks/queries/useBlockchainApplicationMeta';
import { useSearchApplications } from '../../hooks/useSearchApplications';
import AddApplicationList from './AddApplicationList';

jest.mock('@blockchainApplication/explore/hooks/queries/useBlockchainApplicationExplore');
jest.mock('../../hooks/queries/useBlockchainApplicationMeta');
jest.mock('../../hooks/useSearchApplications');

const [appExplore1, appExplore2] = mockApplicationsExplore;
const [appManage1, appManage2] = mockApplicationsManage;
useBlockchainApplicationExplore.mockReturnValue({
  data: {
    data: [appExplore1, appExplore2],
  },
  isLoading: false,
  isFetching: false,
});
useBlockchainApplicationMeta.mockReturnValue({
  data: {
    data: [appManage1, appManage2],
  },
  isLoading: false,
  isFetching: false,
});

describe('AddApplicationList', () => {
  it('displays properly', () => {
    useSearchApplications.mockReturnValue({
      isUrl: false,
      urlStatus: '',
      debouncedSearchValue: '',
    });
    renderWithRouterAndQueryClient(AddApplicationList);

    expect(screen.getByText('Add Application')).toBeTruthy();
    expect(screen.getByPlaceholderText('Search by name or application URL')).toBeTruthy();

    expect(screen.getByText('Lisk')).toBeTruthy();
    expect(screen.getByText('5 LSK')).toBeTruthy();

    expect(screen.getByText('Colecti')).toBeTruthy();
    expect(screen.getByText('0.5 LSK')).toBeTruthy();
  });

  it('displays results for URL search', () => {
    useSearchApplications.mockReturnValue({
      isUrl: true,
      urlStatus: 'ok',
      debouncedSearchValue: 'https://service.colecti.com',
    });
    renderWithRouterAndQueryClient(AddApplicationList);

    expect(screen.getByText('Add Application')).toBeTruthy();
    expect(screen.getByPlaceholderText('Search by name or application URL')).toBeTruthy();

    expect(screen.getByText('Colecti')).toBeTruthy();
    expect(screen.getByText('0.5 LSK')).toBeTruthy();
  });

  // skipping this test for now because it hasn't be implemented
  it.skip('displays external applications if search by application node is used', () => {
    renderWithRouterAndQueryClient(AddApplicationList);

    expect(screen.getByText('External test app')).toBeTruthy();
    expect(screen.getByText('8.2 LSK')).toBeTruthy();
  });
});
