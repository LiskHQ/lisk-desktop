import { useLocation } from 'react-router';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderWithRouter } from 'src/utils/testHelpers';
import NoTokenBalance from './NoActionView';

jest.mock('react-router');

describe('NoTokenBalance', () => {
  const mockOnRequestToken = jest.fn();

  it('should render properly', async () => {
    useLocation.mockReturnValue({});
    const wrapper = renderWithRouter(NoTokenBalance, { onRequestToken: mockOnRequestToken });

    expect(
      wrapper.getByText('There are no tokens to display for this account at this moment.')
    ).toBeTruthy();
    expect(wrapper.getByText('Request token')).toBeTruthy();

    fireEvent.click(wrapper.getByText('Request token'));

    await waitFor(() => {
      expect(mockOnRequestToken).toHaveBeenCalled();
    });
  });

  it('should render custom message', async () => {
    useLocation.mockReturnValue({ search: '?message=test-message' });

    const wrapper = renderWithRouter(NoTokenBalance, { onRequestToken: mockOnRequestToken });

    expect(
      wrapper.queryByText('There are no tokens to display for this account at this monent.')
    ).toBeFalsy();
    expect(wrapper.getByText('test-message')).toBeTruthy();
    expect(wrapper.getByText('Request token')).toBeTruthy();

    fireEvent.click(wrapper.getByText('Request token'));

    await waitFor(() => {
      expect(mockOnRequestToken).toHaveBeenCalled();
    });
  });
});
