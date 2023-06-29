import { fireEvent, screen, waitFor } from '@testing-library/react';
import { smartRender } from 'src/utils/testHelpers';
import mockManagedApplications from '@tests/fixtures/blockchainApplicationsManage';
import { mockAppsTokens } from 'src/modules/token/fungible/__fixtures__';
import Overview from './overview';

const config = {
  renderType: 'render',
  queryClient: true,
};

const mockSetFilter = jest.fn();

jest.mock('@blockchainApplication/manage/hooks/useCurrentApplication', () => ({
  useCurrentApplication: () => [mockManagedApplications[0]],
}));
jest.mock('@token/fungible/hooks', () => ({
  useTransferableTokens: () => ({ data: mockAppsTokens.data }),
}));

const props = { setFilter: mockSetFilter };

describe('Overview', () => {
  beforeEach(() => mockSetFilter.mockClear());
  it('renders properly', () => {
    smartRender(Overview, props, config);

    expect(screen.getByText('All accounts')).toBeInTheDocument();
    expect(screen.getByTestId('selected-menu-item')).toHaveTextContent('LSK');
    expect(screen.getAllByTestId('dropdown-options')).toHaveLength(6);
    expect(screen.getByPlaceholderText('Search by name')).toBeInTheDocument();
  });

  it('updates the filter when a different token is selected', async () => {
    smartRender(Overview, props, config);

    fireEvent.click(screen.getAllByTestId('dropdown-options')[2]);
    expect(mockSetFilter).toHaveBeenCalledTimes(1);
    expect(mockSetFilter).toHaveBeenCalledWith('tokenID', mockAppsTokens.data[1].tokenID);
  });

  it('updates the filter when the search input is changed', async () => {
    smartRender(Overview, props, config);

    fireEvent.change(screen.getByPlaceholderText('Search by name'), {
      target: { value: 'lsk3szyz' },
    });

    await waitFor(() => {
      expect(mockSetFilter).toHaveBeenCalledTimes(1);
      expect(mockSetFilter).toHaveBeenCalledWith('address', 'lsk3szyz');
    });
  });
});
