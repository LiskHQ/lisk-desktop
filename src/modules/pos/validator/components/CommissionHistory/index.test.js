import { smartRender } from 'src/utils/testHelpers';
import { screen, waitFor } from '@testing-library/react';
import accounts from '@tests/fixtures/accounts';
import CommissionHistory from '.';

const mockTransactionEvents = [
  {
    id: 'b56686f68697a81680fe9bc3faf65f9f639faa2fa21b965321652c1ddf327301',
    module: 'pos',
    name: 'commissionChange',
    data: {
      validatorAddress: 'lsk7cd4wv3ygqabp2dw52sbg5sm7zt3m2yxc6gcmr',
      oldCommission: 9000,
      newCommission: 8990,
    },
    block: {
      id: '345b5c298c93b6fc551d279deaf3a84d7eaf37e59cb5cac3ad5df661f8609cbf',
      height: 20775999,
      timestamp: 1701704990,
    },
  },
  {
    id: '80cb72536360ea2cfd1331dce858643fac3459faa64165e3a2e82495e7da213a',
    module: 'pos',
    name: 'commissionChange',
    data: {
      validatorAddress: 'lsk7cd4wv3ygqabp2dw52sbg5sm7zt3m2yxc6gcmr',
      oldCommission: 10000,
      newCommission: 9000,
    },
    topics: [
      '0438ba3dc9432dcf93a2f3c73ee70a019ea520bb64211e564ef357fdc777e3541d',
      'lsk7cd4wv3ygqabp2dw52sbg5sm7zt3m2yxc6gcmr',
    ],
    index: 1,
    block: {
      id: 'fb84988d5be7c0d24972ede7d74e8a36ad6a940434905d2e55a8ffb8d124a16f',
      height: 20604925,
      timestamp: 1699980490,
    },
  },
];
const mockCurrentAccount = accounts[0];

jest.mock('@account/hooks', () => ({
  useCurrentAccount: () => [mockCurrentAccount],
}));
jest.mock('@transaction/hooks/queries/useTransactionEvents', () => ({
  useTransactionEvents: () => ({
    data: { data: mockTransactionEvents },
    isLoading: false,
  }),
}));

const config = {
  queryClient: true,
};

describe('CommissionHistory', () => {
  it('renders properly', async () => {
    smartRender(CommissionHistory, null, config);

    expect(screen.getByText('Commission history')).toBeInTheDocument();
    expect(
      screen.getByText('Below is the commission history for this validator.')
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/04 Dec 2023/)).toBeInTheDocument();
      expect(screen.getByText('(Latest)')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('89.9')).toBeInTheDocument();
    });
  });
});
