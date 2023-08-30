import { renderWithRouter } from 'src/utils/testHelpers';
import NoAccountsDialog from './NoAccountsDialog';

describe('NoTokenBalanceDialog', () => {
  it('should render properly', async () => {
    const wrapper = renderWithRouter(NoAccountsDialog);

    expect(
      wrapper.getByText(
        'Please add an account to your wallet before connecting external applications.'
      )
    ).toBeTruthy();
    expect(wrapper.getByText('Add account')).toBeTruthy();
    expect(wrapper.getByAltText('emptyValidatorsIllustration')).toBeTruthy();
  });
});
