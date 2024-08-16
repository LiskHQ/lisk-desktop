import React from 'react';
import { MemoryRouter } from 'react-router';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import mockSavedAccounts from '@tests/fixtures/accounts';
import {
  useTokenBalances,
  useLiskLegacyAccount,
  useLiskLegacyHistory,
} from '@token/fungible/hooks/queries';
import { useValidators } from '@pos/validator/hooks/queries';
import { useAuth } from '@auth/hooks/queries';

import { mockBlocks } from '@block/__fixtures__';
import { mockValidators } from '@pos/validator/__fixtures__';
import { mockAuth } from '@auth/__fixtures__/mockAuth';
import { mockAppsTokens, mockTokensBalance } from '@token/fungible/__fixtures__/mockTokens';
import { useLatestBlock } from '@block/hooks/queries/useLatestBlock';
import { useBlocks } from '@block/hooks/queries/useBlocks';
import FlashMessageHolder from 'src/theme/flashMessage/holder';
import useFiatRates from 'src/modules/common/hooks/useFiatRates';
import Overview from './overview';

const mockedCurrentAccount = mockSavedAccounts[0];

jest.mock('@account/hooks', () => ({
  useCurrentAccount: jest.fn(() => [mockedCurrentAccount, jest.fn()]),
}));

jest.mock('@token/fungible/hooks/queries');
jest.mock('@settings/hooks/useSettings', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    mainChainNetwork: { name: 'mainnet' },
    setValue: jest.fn(),
  })),
}));
jest.mock('@account/hooks');
jest.mock('@pos/validator/hooks/queries', () => ({
  useValidators: jest.fn(),
}));
jest.mock('@auth/hooks/queries');
jest.mock('@block/hooks/queries/useBlocks');
jest.mock('@block/hooks/queries/useLatestBlock');
jest.mock('src/modules/common/hooks/useFiatRates');

describe('Overview', () => {
  const history = { location: { search: '' } };

  useFiatRates.mockReturnValue({ LSK: { USD: 1, EUR: 1 } });

  it('should display properly', async () => {
    const props = {
      history,
    };

    const mergedTokensData = mockTokensBalance.data.map((tokenData, idx) => ({
      ...tokenData,
      ...mockAppsTokens.data[idx],
    }));
    useTokenBalances.mockReturnValue({
      data: { data: mergedTokensData },
      isLoading: false,
      isSuccess: true,
    });
    useLiskLegacyAccount.mockReturnValue({
      data: {
        token: {
          availableBalance: '1586739386',
          lockedBalances: [
            {
              module: 'pos',
              amount: '1000000000000',
            },
          ],
          symbol: 'LSK',
        },
      },
      isLoading: false,
      isSuccess: true,
    });
    useLiskLegacyHistory.mockReturnValue({
      data: "Version,Block Height,Date,Sender Address,Amount,Transaction ID,Transaction Type,Transaction Fee,Success,Recipient Address,Additional Information,Comment,\nv1,2199158,2017-02-28 12:32:40 +0000 UTC,lskgtrrftvoxhtknhamjab5wenfauk32z9pzk79uj,2500000000,16167385358120905513,token_transfer,0,true,lskervnyptonqvc4byqz5jsnded4gd264tacqzx9p,,3766202724911711412L's new address is lskervnyptonqvc4byqz5jsnded4gd264tacqzx9p.",
      isLoading: false,
      isSuccess: true,
    });
    useAuth.mockReturnValue({ data: mockAuth });
    useValidators.mockReturnValue({ data: mockValidators });
    useBlocks.mockReturnValue({ data: mockBlocks });
    useLatestBlock.mockReturnValue({ data: mockBlocks.data[0] });
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <FlashMessageHolder />
          <Overview {...props} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText('Tokens')).toBeTruthy();
    expect(screen.getByText(mockAuth.meta.address)).toBeTruthy();
    expect(screen.getByText(mockedCurrentAccount.metadata.name)).toBeTruthy();

    expect(screen.getAllByTestId('token-card')).toHaveLength(1);

    expect(screen.getByText('15.86739386 LSK')).toBeTruthy();
    expect(screen.getByText('10,000 LSK')).toBeTruthy();
  });
});
