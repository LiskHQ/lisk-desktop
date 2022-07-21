import { screen, fireEvent } from '@testing-library/react';
import { renderWithRouter } from 'src/utils/testHelpers';
import mockApplications from '@tests/fixtures/blockchainApplicationsExplore';
import BlockchainApplicationAddList from './BlockchainApplicationAddList';

const props = {
  liskApplications: {
    data: mockApplications,
    loadData: jest.fn(),
  },
  externalApplications: { data: [] },
  applyFilters: jest.fn(),
  filters: { search: '' },
};

const mockExternalApplication = {
  name: 'External test app',
  chainID: 'ij239sksf5u4jdq8szo3nfmt',
  state: 'active',
  address: 'lsk24cd35u4jdq8ssd03nfmte5dsxwrnazyqqqg5eu',
  lastCertificateHeight: 400,
  lastUpdated: 123456789,
  depositedLsk: 820000000,
};

describe('BlockchainApplicationAddList', () => {
  it('displays properly', () => {
    renderWithRouter(BlockchainApplicationAddList, props);

    expect(screen.getByText('Add Application')).toBeTruthy();
    expect(screen.getByPlaceholderText('Search by name or application URL')).toBeTruthy();
    expect(screen.getByText('Test app 2')).toBeTruthy();
    expect(screen.getByText('5 LSK')).toBeTruthy();
  });

  it('can load more applications', () => {
    const updatedProps = {
      ...props,
      liskApplications: {
        ...props.liskApplications,
        meta: {
          count: 10,
          offset: 20,
          total: 100,
        },
      },
    };
    renderWithRouter(BlockchainApplicationAddList, updatedProps);
    fireEvent.click(screen.getByText('Load more'));
    expect(props.liskApplications.loadData).toHaveBeenCalledTimes(1);
    expect(props.liskApplications.loadData).toHaveBeenCalledWith({
      ...props.filters,
      offset: updatedProps.liskApplications.meta.count + updatedProps.liskApplications.meta.offset,
    });
  });

  it('displays external applications if search by application node is used', () => {
    const newProps = {
      ...props,
      externalApplications: {
        data: [mockExternalApplication],
      },
    };
    renderWithRouter(BlockchainApplicationAddList, newProps);

    expect(screen.getByText('External test app')).toBeTruthy();
    expect(screen.getByText('8.2 LSK')).toBeTruthy();
  });
});
