import { fireEvent } from '@testing-library/react';
import { renderWithRouter } from 'src/utils/testHelpers';
import NoTokenBalanceDialog from './NoTokenBalanceDialog';

describe('NoTokenBalanceDialog', () => {
  it('should render properly', async () => {
    const wrapper = renderWithRouter(NoTokenBalanceDialog);

    expect(
      wrapper.getByText('There are no tokens to display for this account at this moment.')
    ).toBeTruthy();
    expect(wrapper.getByText('Request token')).toBeTruthy();

    fireEvent.click(wrapper.getByText('Request token'));
  });
});
