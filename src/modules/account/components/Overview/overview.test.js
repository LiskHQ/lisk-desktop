import { fireEvent, screen, waitFor } from '@testing-library/react';
import { smartRender } from 'src/utils/testHelpers';
import { mockAppsTokens } from 'src/modules/token/fungible/__fixtures__';
import Overview from './overview';

const config = {
  renderType: 'render',
  queryClient: true,
};

const mockSetFilter = jest.fn();

const props = { setFilter: mockSetFilter, tokenData: { isFetched: true, data: mockAppsTokens } };

describe('Overview', () => {
  beforeEach(() => mockSetFilter.mockClear());

  it('renders properly', () => {
    smartRender(Overview, props, config);

    expect(screen.getByText('All accounts')).toBeInTheDocument();
    expect(screen.getByTestId('selected-menu-item')).toHaveTextContent('LSK');
    expect(screen.getAllByTestId('dropdown-options')).toHaveLength(6);
    expect(screen.getByPlaceholderText('Search by name or address')).toBeInTheDocument();
  });

  it('does not render dropdown options if data is unavailable', () => {
    const updatedProps = { ...props, tokenData: {} };
    smartRender(Overview, updatedProps, config);

    expect(screen.getByTestId('selected-menu-item')).not.toHaveTextContent('LSK');
    expect(screen.queryByTestId('dropdown-options')).not.toBeInTheDocument();
  });

  it('updates the filter when a different token is selected', async () => {
    smartRender(Overview, props, config);

    fireEvent.click(screen.getAllByTestId('dropdown-options')[2]);
    expect(mockSetFilter).toHaveBeenCalledTimes(1);
    expect(mockSetFilter).toHaveBeenCalledWith('tokenID', mockAppsTokens.data[1].tokenID);
  });

  it('updates the filter when the search input is changed', async () => {
    smartRender(Overview, props, config);

    fireEvent.change(screen.getByPlaceholderText('Search by name or address'), {
      target: { value: 'lsk3szyz' },
    });

    await waitFor(() => {
      expect(mockSetFilter).toHaveBeenCalledTimes(1);
      expect(mockSetFilter).toHaveBeenCalledWith('search', 'lsk3szyz');
    });
  });
});
