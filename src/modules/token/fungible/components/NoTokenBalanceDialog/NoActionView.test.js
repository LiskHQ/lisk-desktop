import { fireEvent, waitFor } from '@testing-library/react';
import { renderWithRouter } from 'src/utils/testHelpers';
import NoActionView from './NoActionView';

describe('NoActionView', () => {
  const mockOnRequestToken = jest.fn();

  it('should render properly', async () => {
    const wrapper = renderWithRouter(NoActionView, { onClick: mockOnRequestToken });

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
    const wrapper = renderWithRouter(NoActionView, {
      onClick: mockOnRequestToken,
      message: 'test-message',
    });

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
