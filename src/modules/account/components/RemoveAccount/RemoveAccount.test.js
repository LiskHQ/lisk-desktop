import { mountWithRouter } from 'src/utils/testHelpers';
import mockSavedAccounts from '@tests/fixtures/accounts';
import RemoveAccount from './RemoveAccount';

const mockSetAccount = jest.fn();
jest.mock('react-i18next');
jest.mock('@account/hooks', () => ({
  useAccounts: jest.fn(() => ({
    accounts: mockSavedAccounts,
  })),
  useCurrentAccount: jest.fn(() => (
    [mockSavedAccounts[0], mockSetAccount]
  )),
}));

describe('Remove account', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      address: 'lskwhocotuu6bwnhwgjt859ugp467f8kuhdo5xfd6',
      history: {
        push: jest.fn(),
      },
    };
    wrapper = mountWithRouter(RemoveAccount, props);
  });

  it('should render properly', async () => {
    const html = wrapper.html();
    expect(html).toContain('container');
    expect(html).toContain('content');
  });
});
