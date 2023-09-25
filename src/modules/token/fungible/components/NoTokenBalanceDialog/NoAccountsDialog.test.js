import { fireEvent } from '@testing-library/react';
import { renderWithRouter } from 'src/utils/testHelpers';
import NoAccountsDialog from './NoAccountsDialog';

describe('NoAccountsDialog', () => {
  it('should render properly', async () => {
    const wrapper = renderWithRouter(NoAccountsDialog);

    expect(
      wrapper.getByText(
        'Please add an account to your wallet before connecting external applications.'
      )
    ).toBeTruthy();
    expect(wrapper.getByText('Add account')).toBeTruthy();

    fireEvent.click(wrapper.getByText('Add account'));
  });
  it('should render in currrent account mode', async () => {
    const wrapper = renderWithRouter(NoAccountsDialog, {}, '/?mode=NO_CURRENT_ACCOUNT');

    expect(
      wrapper.getByText(
        'Please select a current account on your wallet before connecting external applications.'
      )
    ).toBeTruthy();
    expect(wrapper.getByText('Select account')).toBeTruthy();

    fireEvent.click(wrapper.getByText('Select account'));
  });
});
